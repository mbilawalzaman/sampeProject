import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

export const clerkOAuthCallback = async (req, res) => {
    try {
        if (!req.auth.userId) {
            return res.status(401).json({ message: "User authentication failed" });
        }

        // Store user ID in session
        req.session.userId = req.auth.userId;
        console.log("Session after login:", req.session);

        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).json({ message: "Error saving session" });
            }
            res.json({ message: "Session stored successfully", userId: req.auth.userId });
        });
    } catch (error) {
        console.error("OAuth callback error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
