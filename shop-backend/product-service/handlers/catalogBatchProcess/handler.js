import axios from "axios";
export const handler = async (event) => {
  const products = event.Records.map(({ body }) => body);
  await Promise.all(
    products.map((p) => {
      return axios.put(process.env.CREAT_PRODUCT_URL, p);
    })
  );

  return {
    statusCode: 200,
  };
};
