const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ endpoint: process.env.DYNAMODB_ENDPOINT });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("ListRecipesFunction called.");
  const command = new ScanCommand({
    TableName: "Recipes",
  });

  try {
    const { Items } = await docClient.send(command);
    console.log(`Listed ${Items.length} recipes.`);
    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error listing recipes" }),
    };
  }
};
