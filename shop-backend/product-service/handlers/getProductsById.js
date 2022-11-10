"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const query = async (params) => {
  const response = await dynamoDb.query(params).promise();
  return response.Items;
};

const productTableParams = {
  TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
  KeyConditionExpression: "id = :id",
};

module.exports.getProductsById = async (event, context) => {
  productTableParams.ExpressionAttributeValues = {
    ":id": event.pathParameters.productId,
  };
  const product = await query(productTableParams);
  const response = {
    statusCode: 200,
    body: JSON.stringify(product),
  };
  return response;
};
