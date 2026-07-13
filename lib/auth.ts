import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.DB_URI;

if (!uri) {
    throw new Error("DB_URI is not defined in your environment variables.");
}

const client = new MongoClient(uri);
const db = client.db();

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: mongodbAdapter(db, {
        client,
    }),
});