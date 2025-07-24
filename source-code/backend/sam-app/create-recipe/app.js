import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("CreateRecipeFunction called.");
  const { name, tags, ingredients, steps, notes, imageUrl } = JSON.parse(
    event.body
  );

  if (!name || !tags || !ingredients || !steps) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required fields" }),
    };
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const command = new PutCommand({
    TableName: "Recipes",
    Item: {
      id,
      name,
      createdAt,
      updatedAt,
      tags,
      notes: notes ?? "",
      ingredients,
      steps,
      imageUrl: imageUrl ?? null,
    },
  });

  try {
    await docClient.send(command);
    console.log(`Recipe created successfully: ${name} (ID: ${id})`);
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Recipe created successfully", id }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating recipe" }),
    };
  }
};
