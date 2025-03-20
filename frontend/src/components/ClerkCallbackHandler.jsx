import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@clerk/clerk-react";

function ClerkCallbackHandler() {
    const navigate = useNavigate();
    const { session } = useSession(); // Get Clerk session

    useEffect(() => {
        if (session) {
            session.getToken().then((token) => {
                fetch("http://localhost:5000/api/auth/callback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Send Clerk session token
                    },
                    credentials: "include", // Important for session cookies
                })
                    .then((res) => res.json())
                    .then(() => navigate("/")) // Redirect to dashboard
                    .catch((err) => console.error("Error sending session to backend:", err));
            });
        }
    }, [session]);

    return <div>Processing login...</div>;
}

export default ClerkCallbackHandler;
