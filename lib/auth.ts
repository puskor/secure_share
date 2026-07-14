import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.DB_URI;
// console.log(uri)

if (!uri) {
  throw new Error("DB_URI is not defined");
}
const client = new MongoClient(uri);
await client.connect();

const db = client.db("secure_share");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },

});