import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const handler = async (event, context) => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing query parament 'name' ",
      }),
    };
  }

  const { name } = event.queryStringParameters;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing query parament 'name' ",
      }),
    };
  }

  try {
    const s3Client = new S3Client();
    const comandParams = {
      Bucket: process.env.BUCKET,
      Key: `uploaded/${name}`,
    };
    const command = new PutObjectCommand(comandParams);

    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl: signedUrl }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: e,
      }),
    };
  }
};
