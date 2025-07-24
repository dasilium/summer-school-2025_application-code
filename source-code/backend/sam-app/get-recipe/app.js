import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("GetRecipeFunction called.");
  const { id } = event.pathParameters;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing recipe ID" }),
    };
  }

  const command = new GetCommand({
    TableName: "Recipes",
    Key: {
      id: id,
    },
  });

  try {
    const { Item } = await docClient.send(command);

    if (!Item) {
      console.log(`Recipe with ID ${id} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Recipe not found" }),
      };
    }

    console.log(`Successfully retrieved recipe with ID: ${id}`);
    return {
      statusCode: 200,
      body: JSON.stringify(Item),
    };
  } catch (error) {
    console.error("Error getting recipe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error getting recipe" }),
    };
  }
};
