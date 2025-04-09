import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import loadingGif from "../images/face.gif";
import backgroundImage from "../images/3409297.jpg";
import { FaCamera } from "react-icons/fa";

const FaceRecon = () => {
    const [storedImageUrl, setStoredImageUrl] = useState(null);
    const [email, setUserEmail] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(true);
    
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

        const loadingTimer = setTimeout(() => {
            setLoadingImage(false);
            startCamera();
        }, 3000);

        return () => clearTimeout(loadingTimer);
    }, []);

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

            const responseData = await response.json();

            if (responseData.success) {
                await Swal.fire({
                    title: "Success!",
                    text: `Face match successful! Similarity: ${responseData.similarity.toFixed(2)}%`,
                    icon: "success",
                    confirmButtonText: "Go to Dashboard"
                });

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
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backdropFilter: "blur(8px)",
            padding: "20px",
            color: "white"
        }}>
            <h1 style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <FaCamera style={{ marginRight: "10px" }} /> Face Recognition
            </h1>
            <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                {storedImageUrl && <img src={storedImageUrl} alt="User" style={{ width: "250px", height: "250px", borderRadius: "15px", border: "3px solid white" }} />}
                <div style={{ position: "relative" }}>
                    {loadingImage ? (
                        <img src={loadingGif} alt="Loading..." style={{ width: "250px", height: "250px", borderRadius: "15px" }} />
                    ) : (
                        <video ref={videoRef} autoPlay style={{ width: "250px", height: "250px", borderRadius: "15px", border: "3px solid white" }} />
                    )}
                    <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
                </div>
            </div>
            <button onClick={handleVerificationClick} style={{
                marginTop: "20px",
                padding: "15px 30px",
                fontSize: "18px",
                color: "white",
                background: "linear-gradient(135deg, #007bff, #0056b3)",
                border: "none",
                borderRadius: "30px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)"
            }}>
                {loading ? "Verifying..." : "Start Verification"}
            </button>
        </div>
    );
};

export default FaceRecon;
