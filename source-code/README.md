# Summer School Application

This project is a full-stack application developed for a summer school, featuring a React-based frontend and a serverless backend powered by AWS SAM (Serverless Application Model) running on LocalStack.

## Project Structure

- `backend/`: Contains the AWS SAM application with Node.js Lambda functions for recipe management (create, list, update, delete).
- `ui/`: The React frontend application built with Vite.
- `localstack/`: LocalStack data and configuration.
- `aws-init/`: Initialization scripts for LocalStack.
- `docker-compose.yml`: Defines the Docker services for LocalStack.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [npm](https://docs.npmjs.com/cli/v9/commands/npm-install) (comes with Node.js)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [AWS SAM CLI](https://docs.aws.com/serverless-application-model/latest/developerguide/install-samcli.html)

## Local Setup

Follow these steps to get the application running locally:

### 1. Start LocalStack

Navigate to the root directory of the project and start LocalStack using Docker Compose:

```bash
docker-compose up -d
```

This will start LocalStack and provision the necessary AWS services (DynamoDB) locally.

### 2. Deploy Backend to LocalStack

First, configure your AWS CLI to use LocalStack. You can do this by setting environment variables or configuring a profile. For simplicity, you can set the endpoint URL:

```bash
export AWS_ENDPOINT_URL=http://localhost:4566
```

Now, navigate into the `backend/sam-app` directory and deploy the SAM application. The `samconfig.toml` is already configured to deploy to LocalStack.

```bash
cd backend/sam-app
sam deploy --guided
```

During the guided deployment, accept the default values. Ensure the `AWS_ENDPOINT_URL` environment variable is set correctly for the SAM CLI to interact with LocalStack.

### 3. Start Frontend Development Server

Navigate into the `ui` directory and install the dependencies, then start the development server:

```bash
cd ../../ui
npm install
npm run dev
```

The frontend application should now be running and accessible in your web browser, typically at `http://localhost:5173` (or another port indicated by Vite).

Enjoy exploring the Summer School Application locally!