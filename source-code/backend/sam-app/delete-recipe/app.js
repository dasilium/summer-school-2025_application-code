import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("DeleteRecipeFunction called.");
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing recipe ID" }),
    };
  }

  const command = new DeleteCommand({
    TableName: "Recipes",
    Key: {
      id,
    },
  });

  try {
    await docClient.send(command);
    console.log(`Recipe deleted successfully (ID: ${id})`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Recipe deleted successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error deleting recipe", error }),
    };
  }
};
