export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        res.json({ status: "200", message: "secure api is working fine..." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }

}