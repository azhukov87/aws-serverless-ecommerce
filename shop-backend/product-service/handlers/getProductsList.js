"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const scan = async (params) => {
  const response = await dynamoDb.scan(params).promise();
  return response.Items;
};

const productTableParams = {
  TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
};

const stockTableParams = {
  TableName: process.env.DYNAMODB_STOCKS_TABLE,
};

module.exports.getProductsList = async (event, context) => {
  const products = await scan(productTableParams);

  const stocks = await scan(stockTableParams);
  const result = products.map((product) => {
    const stock = stocks.find((st) => st.product_id == product.id);
    if (stock) {
      product.count = stock.count;
    }
    return product;
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;
};
