# Hands-On Lab: Deploying a Serverless Web Application on AWS

Welcome! In this lab you will build a simple serverless backend and static frontend on AWS. By the end you will have:

- A DynamoDB table to persist application data.
- One or more Lambda functions containing your business logic.
- An API Gateway (HTTP API) that exposes those functions to the frontend.
- An S3 bucket that hosts the static website and (optionally) stores images.
- Proper CORS configuration and environment variables so the pieces can talk to each other.

## Configure AWS DynamoDB

### Create a new table
- Search for "DynamoDB" in AWS Console and click on it
- Click on "Create table"
- Enter a name in "Table name"
- Select a "Partition key" and if needed a "Sort Key"
- Click on "Create table"

## Configure AWS Lambda functions

### Create a new function
- Search for "Lambda" in AWS Console and click on it
- Click on "Create a function"
- Select "Author from scratch"
- Enter a name in "Function name"
- Select your "Runtime" (in our case "Node.js 22.x")
- Click on "Create function"

### Upload code
- Open the lambda function
- Select the "Code" tab
- Click on "Upload from"
- Click on ".zip file"
- Click on "Upload"
- Select your zip file
- Click on "Save"

### Set environment variables
- Select the "Configuration" tab
- Click on "Environment variables"
- Click on "Edit"
- Click on "Add environment variable"
- Set your "Key" and "Value"
- Click on "Save"

### Update execution role 
- Open the lambda function
- Select the "Configuration" tab
- Click on "Permissons"
- Click on the link of the Role name in the section "Execution role"
- Click on the "Add permissons"
- Click on the "Create inline policy"
- Set your policy in the wizard or use the JSON editor
- Click on the "Next"
- Enter a name in "Policy name"
- Click on the "Create policy"

## Configure AWS API Gateway

### Create a new HTTP API Gateway
- Search for API Gateway in AWS Console
- Click "Create an API"
- Search for HTTP API and click on "Build"
- Give it the name "summer-school-app-api"
- Click on "Next"
- Click on "Next"
- Click on "Next"
- Click on "Create"

### Create a new Route
- Click on "Routes" in the left menu
- Create a new Route by clicking on "Create"
- Select the fitting HTTP method and url path
- Click on "Create"

### Attach a lambda function to a Route
- Click on "Routes" in the left menu
- Click on the route you want to connect with a integration
- Click on "Attach integration"
- Click on "Create and attach an integration"
- Select "Lambda function" in "Integration type" dropdown
- Select your region and select the lambda function

### Set CORS Settings
- Click on "CORS" in the left menu
- Click on "Configure"
- Set "Access-Control-Allow-Origin" URL of your frontend app
- Set "Access-Control-Allow-Methods" HTTP Methods you need in your frontend app (in our case POST, GET, PUT, DELETE, OPTIONS)
- Click on "Save"

## Configure AWS S3

### Create a S3 bucket
- Search for "S3" in AWS Console
- Click on "Create bucket"
- Enter a name in "Bucket name"
- Click on "Create bucket"

### Upload files to S3 bucket
- Open bucket
- Select the "Objects" tab
- Click on "Upload"

### Set environement variables in web app
Before you copy the code in the S3 bucket for your frontend app, you need to update the `frontend/code/config.js` file with your AWS API Gateway URL and the S3 Bucket URL for the image bucket.

Open `frontend/code/config.js` and replace the placeholder values with your actual URLs:

```javascript
// frontend/code/config.js
const IMAGE_BUCKET_NAME = "YOUR-IMAGE_BUCKET_NAME";
const IMAGE_BUCKET_REGION = "YOUR-REGION";
const API_URL = "YOUR-API-URL";

window.RUNTIME_CONFIG = {
  API_URL,
  IMAGE_BUCKET_URL: `https://${IMAGE_BUCKET_REGION}.s3.${IMAGE_BUCKET_REGION}.amazonaws.com`,
};
```

Copy then all the files from the directory `frontend` in the S3 bucket.

### Unblock public access
- Open bucket
- Select the "Permissions" tab
- Click on "Edit" in section "Block public access (bucket settings)"
- Remove checkbox "Block all public access"
- Click on "Save changes"

### Activate website hosting
- Open bucket
- Select the "Properties" tab
- Click on "Edit" in section "Static website hosting"
- Select "enabled" for Static website hosting
- Set "Index document" to "index.html"
- Set "Error document" to "index.html"

### Set CORS Settings
- Open bucket
- Select the "Permission" tab
- Click on "Edit" in section "Cross-origin resource sharing (CORS)"
- Enter your CORS config in the JSON editor (in our case use the file "CORS.json")
- Click on "Save changes"