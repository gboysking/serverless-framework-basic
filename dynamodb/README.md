# DynamoDB Device Data Storage with Express

AWS DynamoDB + Express + Serverless Framework

This project is an implementation of the AWS DynamoDB service using Express and the Serverless Framework, written in TypeScript. It is based on the implementation described in [this blog post](https://tobelinuxer.tistory.com/69).

This repository contains a simple example of how to store and manage device data using AWS DynamoDB and Express. The project demonstrates how to create a custom table class for interacting with DynamoDB, set up an Express API server, and run the application locally using the Serverless Framework.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Running the Application](#running-the-application)
4. [API Endpoints](#api-endpoints)
5. [Contributing](#contributing)
6. [License](#license)

## Prerequisites

Before getting started, make sure you have the following software installed on your system:

- [Node.js](https://nodejs.org/en/download/) (version 14.x or higher)
- [npm](https://www.npmjs.com/get-npm) (usually included with Node.js)
- [AWS CLI](https://aws.amazon.com/cli/) (optional, for deploying to AWS)
- [Serverless Framework](https://www.serverless.com/) (optional, for running the application locally)

## Project Structure

The project is organized as follows:

- `src/lib`: Contains the source code for the custom DynamoDB table class
  - `BaseDynamoDBTable.ts`: Defines the base class for interacting with DynamoDB tables
  - `DeviceDataTable.ts`: Extends the base class with specific functionality for the device data table
- `src/appExpress.ts`: Sets up the Express server and defines the API routes
- `serverless.yml`: Configuration file for the Serverless Framework

## Running the Application

To run the application locally using the Serverless Framework, follow these steps:

1. Install the Serverless Framework globally, if you haven't already:

   ```bash
   npm install -g serverless
   ```

2. Start the application:

   ```bash
   sls offline start
   ```

The Express server will start listening on the default port 3000.

## API Endpoints

The application exposes the following API endpoints:

- `POST /device_data`: Store device data
  - The body of the request should include device_id, type, timestamp, and any additional data
- `GET /device_data`: Retrieve device data for a specific device and type within a time range
  - The query parameters should include device_id, type, start_time, and end_time
- `DELETE /device_data`: Delete a specific device data entry
  - The query parameters should include device_id, type, and timestamp

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to suggest improvements or report bugs.

## License

This project is licensed under the [MIT License](LICENSE).