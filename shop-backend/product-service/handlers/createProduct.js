"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const put = async (params) => {
  const response = await dynamoDb.put(params).promise();
  return response.Items;
};

const createProductTableParams = {
  TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
};

module.exports.createProduct = async (event, context) => {
  const data = JSON.parse(event.body);
  createProductTableParams.Item = data;
  await put(createProductTableParams);
  const response = {
    statusCode: 200,
    body: JSON.stringify(event.body),
  };
  return response;
};
