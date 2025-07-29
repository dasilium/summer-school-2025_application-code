terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

/* ─── DynamoDB ─── */
resource "aws_dynamodb_table" "recipes" {
  name         = "Recipes"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

/* ─── IAM for Lambdas ─── */
resource "aws_iam_role" "lambda_role" {
  name = "recipes_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamo" {
  name = "recipes_lambda_dynamodb_access"
  role = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ]
      Resource = aws_dynamodb_table.recipes.arn
    }]
  })
}

/* ─── Node.js Lambdas ─── */
locals {
  lambdas = {
    create_recipe = "create_recipe.zip"
    get_recipe    = "get_recipe.zip"
    update_recipe = "update_recipe.zip"
    delete_recipe = "delete_recipe.zip"
    list_recipes  = "list_recipes.zip"
    upload_recipe = "upload_recipe.zip"
  }
}

resource "aws_lambda_function" "this" {
  for_each      = local.lambdas
  function_name = each.key
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  filename      = "${path.module}/lambda/${each.value}"

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.recipes.name
    }
  }
}

/* ─── API Gateway wiring (unchanged) ─── */
resource "aws_api_gateway_rest_api" "recipes" {
  name        = "summer-school-app"
  description = "Recipes CRUD + Upload API"
}

resource "aws_api_gateway_resource" "recipes" {
  rest_api_id = aws_api_gateway_rest_api.recipes.id
  parent_id   = aws_api_gateway_rest_api.recipes.root_resource_id
  path_part   = "recipes"
}

resource "aws_api_gateway_resource" "recipe_id" {
  rest_api_id = aws_api_gateway_rest_api.recipes.id
  parent_id   = aws_api_gateway_resource.recipes.id
  path_part   = "{id}"
}

resource "aws_api_gateway_resource" "upload" {
  rest_api_id = aws_api_gateway_rest_api.recipes.id
  parent_id   = aws_api_gateway_rest_api.recipes.root_resource_id
  path_part   = "upload"
}

locals {
  methods = [
    { name = "list_recipes",  verb = "GET",    res = aws_api_gateway_resource.recipes.id      },
    { name = "create_recipe", verb = "POST",   res = aws_api_gateway_resource.recipes.id      },
    { name = "get_recipe",    verb = "GET",    res = aws_api_gateway_resource.recipe_id.id    },
    { name = "update_recipe", verb = "PUT",    res = aws_api_gateway_resource.recipe_id.id    },
    { name = "delete_recipe", verb = "DELETE", res = aws_api_gateway_resource.recipe_id.id    },
    { name = "upload_recipe", verb = "POST",   res = aws_api_gateway_resource.upload.id       },
  ]
}

resource "aws_api_gateway_method" "method" {
  for_each      = { for m in local.methods : "${m.name}" => m }
  rest_api_id   = aws_api_gateway_rest_api.recipes.id
  resource_id   = each.value.res
  http_method   = each.value.verb
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  for_each                = aws_api_gateway_method.method
  rest_api_id             = each.value.rest_api_id
  resource_id             = each.value.resource_id
  http_method             = each.value.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.this[each.key].invoke_arn
}

resource "aws_lambda_permission" "apigw" {
  for_each      = aws_api_gateway_method.method
  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.recipes.execution_arn}/*/${each.value.http_method}/*"
}

resource "aws_api_gateway_deployment" "deploy" {
  depends_on  = [aws_api_gateway_integration.integration]
  rest_api_id = aws_api_gateway_rest_api.recipes.id
  stage_name  = "prod"
}

/* ─── Outputs ─── */
output "api_invoke_url" {
  value = aws_api_gateway_deployment.deploy.invoke_url
}

output "recipes_table_name" {
  value = aws_dynamodb_table.recipes.name
}