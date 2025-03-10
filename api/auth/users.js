import User from "../models/user";
import { connectToDatabase } from "../databases/db";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    await connectToDatabase();

    try {
        const users = await User.find({}, "-password"); // Exclude password
        res.json({ status: "200", body: users, message: "Fetched all users list." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }

}
