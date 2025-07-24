import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
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
