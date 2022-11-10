import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import csv from "csv-parser";
export const handler = async (event, context) => {
  try {
    const s3Client = new S3Client({ region: "eu-west-1" });
    const sqsClient = new SQSClient({ region: "eu-west-1" });
    const comandParams = {
      Bucket: event.Records[0].s3.bucket.name,
      Key: event.Records[0].s3.object.key,
    };
    const data = await s3Client.send(new GetObjectCommand(comandParams));
    const products = [];

    const parser = csv();

    data.Body.pipe(parser);

    for await (const row of parser) {
      products.push(row);
    }

    for (const product of products) {
      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl:
            "https://sqs.eu-west-1.amazonaws.com/156853902166/product-service-import-sqs",
          MessageBody: JSON.stringify(product),
        })
      );
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: e,
      }),
    };
  }
};
