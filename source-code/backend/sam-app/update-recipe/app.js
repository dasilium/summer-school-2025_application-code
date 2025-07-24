import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("UpdateRecipeFunction called.");
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing recipe ID" }),
    };
  }

  const { name, tags, ingredients, steps, notes } = JSON.parse(
    event.body || "{}"
  );

  const setClauses = [];
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  const addField = (attr, value) => {
    if (value === undefined) return;
    const nameKey = `#${attr}`;
    const valueKey = `:${attr}`;
    setClauses.push(`${nameKey} = ${valueKey}`);
    ExpressionAttributeNames[nameKey] = attr; // map placeholder -> real attr
    ExpressionAttributeValues[valueKey] = value;
  };

  addField("name", name); // reserved -> now safe
  addField("tags", tags);
  addField("notes", notes);
  addField("ingredients", ingredients);
  addField("steps", steps);
  addField("updatedAt", new Date().toISOString());

  if (setClauses.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No fields to update" }),
    };
  }

  const command = new UpdateCommand({
    TableName: "Recipes",
    Key: { id },
    UpdateExpression: "SET " + setClauses.join(", "),
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  try {
    const { Attributes } = await docClient.send(command);
    console.log(
      `Recipe updated successfully: ${Attributes.name} (ID: ${Attributes.id})`
    );
    return { statusCode: 200, body: JSON.stringify(Attributes) };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating recipe" }),
    };
  }
};
