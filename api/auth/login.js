import User from "../models/user";
import { connectToDatabase } from "../databases/db";
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
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ status: "400", message: "Invalid credentials." });
        }

        const token = generateToken({ id: user.id }, "10h");

        res.json({
            status: "200",
            body: { _id: user._id, email: user.email, access_token: token, token_type: "Bearer" },
            message: "Login successful."
        });
    } catch (err) {
        res.status(500).json({ status: "500", message: `Server error: ${err}` });
    }
}
