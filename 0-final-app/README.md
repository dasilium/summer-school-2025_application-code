
## Configure frontend application

Before you copy the code in the S3 bucket for your frontend app, you need to update the `frontend/config.js` file with your AWS API Gateway URL and the S3 Bucket URL for the image bucket.

Open `frontend/config.js` and replace the placeholder values with your actual URLs:

```javascript
// config.js
window.RUNTIME_CONFIG = {
    API_URL: 'YOUR_AWS_API_GATEWAY_URL', // Replace with your AWS API Gateway URL
    IMAGE_BUCKET_URL: 'YOUR_S3_IMAGE_BUCKET_URL', // Replace with your S3 Image Bucket URL
};
```

Copy then all the files from the directory `frontend` in the S3 bucket.