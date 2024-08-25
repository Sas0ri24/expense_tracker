# Expense Tracker DApp

This project is a decentralized application (DApp) for tracking personal expenses. It allows users to add, update, and view expenses. The DApp communicates with a rollup server to handle task updates and inspections efficiently.

## Features

- **Add Expenses**: Users can add new expenses with descriptions, amounts, and dates.
- **Update Expenses**: Users can update existing expenses.
- **Inspect Expenses**: Users can retrieve the current list of expenses.
- **Integration with Rollup Server**: Efficiently manages off-chain expense data while interacting with a rollup server.

## Prerequisites

- Node.js
- `ethers` library (Install using `npm install ethers`)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install ethers
   ```

3. **Set Up Environment Variables**:
   Ensure you have the following environment variable set:
   - `ROLLUP_HTTP_SERVER_URL`: The URL of the rollup HTTP server.

   You can set this variable in your environment or in a `.env` file.

## Usage

1. **Run the Script**:
   Execute the script using Node.js:
   ```bash
   node <script-file-name>.js
   ```

2. **Functionality**:
   - **`handle_update(data)`**: Processes requests to add or update expenses. Communicates changes to the rollup server and updates the `expenses` array.
   - **`handle_inspect(data)`**: Handles requests to retrieve the current list of expenses and provides a response.
   - **Polling Loop**: Continuously fetches finish status from the rollup server and processes incoming requests.

## Code Overview

- **`hex2Object(hex)`**: Converts a hexadecimal string to a JavaScript object.
- **`obj2Hex(obj)`**: Converts a JavaScript object to a hexadecimal string.
- **`expenses`**: An array that stores expense records with attributes such as `id`, `description`, `amount`, and `date`.
- **`handlers`**: An object mapping request types to their corresponding handler functions (`handle_update` and `handle_inspect`).
- **Polling Loop**: Continuously checks the rollup server for finish requests and processes them accordingly.
