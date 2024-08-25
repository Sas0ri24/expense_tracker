const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function hex2Object(hex) {
  const utf8String = ethers.toUtf8String(hex);
  return JSON.parse(utf8String);
}

function obj2Hex(obj) {
  const jsonString = JSON.stringify(obj);
  return ethers.hexlify(ethers.toUtf8Bytes(jsonString));
}

// Expense states
let expenses = [];

// Function to handle expense updates
async function handle_update(data) {
  console.log("Received update request data " + JSON.stringify(data));

  const metadata = data['metadata'];
  const sender = metadata['msg_sender'];
  const payload = data['payload'];

  let request = hex2Object(payload);

  if (!request.expenseId || !request.action || !request.details) {
    const report_req = await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: obj2Hex("Invalid expense format") }),
    });

    return "reject";
  }

  // Handle expense actions
  if (request.action === "add") {
    expenses.push({
      id: request.expenseId,
      description: request.details.description,
      amount: request.details.amount || 0,
      date: request.details.date || new Date().toISOString(),
    });
  } else if (request.action === "update") {
    const expense = expenses.find(exp => exp.id === request.expenseId);
    if (expense) {
      expense.description = request.details.description || expense.description;
      expense.amount = request.details.amount || expense.amount;
      expense.date = request.details.date || expense.date;
    }
  }

  const notice_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: obj2Hex({ message: "Expense updated" }) }),
  });

  return "accept";
}

// Function to handle inspection requests
async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));

  const payload = data['payload'];
  const route = ethers.toUtf8String(payload);

  let responseObject = {};
  if (route === "expenses") {
    responseObject = JSON.stringify({ expenses });
  } else {
    responseObject = "route not implemented";
  }

  const report_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: obj2Hex(responseObject) }),
  });

  return "accept";
}

const handlers = {
  update_expense: handle_update,
  inspect_expense: handle_inspect,
};

const finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      const handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
