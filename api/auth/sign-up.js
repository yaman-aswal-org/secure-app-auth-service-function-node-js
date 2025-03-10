import { connectToDatabase } from "../databases/db";
import User from "../models/user";
import { generateToken } from "jwt-token-manager";

const secureKey = "secure-code-832ysoznehha22lksttqqq";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password, secure_key } = req.body;

    if (secure_key !== secureKey || !email || !password) {
        return res.status(400).json({ status: "400", message: "Invalid input." });
    }

    await connectToDatabase();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ status: "400", message: "User already exists." });

        const newUser = new User({ email, password });
        await newUser.save();
        const token = generateToken({ id: newUser.id }, "10h");

        res.status(201).json({
            status: "201",
            body: { _id: newUser._id, email: newUser.email, access_token: token, token_type: "Bearer" },
            message: "User created successfully."
        });
    } catch (err) {
        res.status(500).json({ status: "500", message: `Server error: ${err}` });
    }
}
