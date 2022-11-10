import axios from "axios";
export const handler = async (event, ctx, cb) => {
  if (event["type"] != "TOKEN") {
    cb("Unauthorized");
  }

  try {
    const token = event.authorizationToken;

    const encodedCreds = token.split[" "][1];
    const { userName, password } = Buffer.from(encodedCreds, "base64")
      .toString("utf-8")
      .split(":");

    const expectedPassword = process.env[userName];
    const effect =
      !expectedPassword || expectedPassword != password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    cb(policy);
  } catch (error) {
    console.log("error", error);
  }
  return {
    statusCode: 200,
    body: "okay",
  };
};

const generatePolicy = (principalId, resource, effect = "Deny") => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        { Action: "execute-api:Invoke", Effect: effect, Resource: resource },
      ],
    },
  };
};
