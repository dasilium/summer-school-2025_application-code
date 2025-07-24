#!/bin/bash

echo "Checking if DynamoDB table 'Recipes' already exists..."
awslocal dynamodb describe-table --table-name Recipes > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Table 'Recipes' already exists. Skipping creation."
else
    echo "Table 'Recipes' does not exist. Creating table..."
    awslocal dynamodb create-table         --table-name Recipes         --attribute-definitions             AttributeName=id,AttributeType=S         --key-schema             AttributeName=id,KeyType=HASH         --provisioned-throughput             ReadCapacityUnits=5,WriteCapacityUnits=5

    if [ $? -eq 0 ]; then
        echo "Table 'Recipes' created successfully."
    else
        echo "Error creating table 'Recipes'."
        exit 1
    fi
fi

awslocal s3api create-bucket --bucket summer-school-app
awslocal s3api put-bucket-cors --bucket summer-school-app --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["PUT","GET","HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }]
}'

echo "Bucket 'summer-school-app' created successfully."