import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const FaceRecon = () => {
    const [storedImageUrl, setStoredImageUrl] = useState(null);
    const [email, setUserEmail] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                        .join("")
                );
                const decoded = JSON.parse(jsonPayload);

                setUserEmail(decoded.email || null);
                setStoredImageUrl(decoded.image || null);
                setRole(decoded.role || null);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            console.error("No token found in localStorage");
        }

        // Start Camera
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera:", error);
                Swal.fire({
                    title: "Camera Access Denied",
                    text: "Please allow camera access to use this feature.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        };
        startCamera();
    }, []);

    // Capture Image & Send to API
    const handleVerificationClick = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageBase64 = canvas.toDataURL("image/jpeg").split(",")[1]; 

        if (!storedImageUrl) {
            Swal.fire({
                title: "Error",
                text: "No stored image found for comparison.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5001/api/users/compare-faces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    storedImageUrl,
                    imageBase64,
                }),
            });

            const responseData = await response.json(); // Parse response as JSON

            if (responseData.success) {
                await Swal.fire({
                    title: "Success!",
                    text: `Face match successful! Similarity: ${responseData.similarity.toFixed(2)}%`,
                    icon: "success",
                    confirmButtonText: "Go to Dashboard"
                });

                // Role-based redirection
                switch (role) {
                    case "Admin":
                        navigate("/admin-dashboard");
                        break;
                    case "Business owner":
                        navigate("/business-owner-dashboard");
                        break;
                    default:
                        navigate("/");
                }
            } else {
                Swal.fire({
                    title: "Failed!",
                    text: "Face match failed. Please try again.",
                    icon: "error",
                    confirmButtonText: "Okay"
                });
            }
        } catch (error) {
            console.error("Error verifying face:", error);
            const message = error.response ? error.response.data.message : "Face verification failed due to a server error.";
            Swal.fire({
                title: "Error",
                text: message,
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100vh", padding: "20px", backgroundColor: "#f9f9f9" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
                {storedImageUrl ? (
                    <img src={storedImageUrl} alt="User" style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} />
                ) : (
                    <p>No image available.</p>
                )}
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
                <video ref={videoRef} autoPlay style={{ width: "100%", maxHeight: "80vh", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} />
                <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
                
                <button 
                    onClick={handleVerificationClick} 
                    style={{ 
                        padding: "15px 30px", 
                        fontSize: "18px", 
                        color: "white", 
                        backgroundColor: loading ? "#6c757d" : "#007bff", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: loading ? "not-allowed" : "pointer", 
                        marginTop: "10px"
                    }}
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Start Verification"}
                </button>
            </div>
        </div>
    );
};

export default FaceRecon;