import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom"; // Ensure react-router-dom is installed

const FaceRecon = () => {
    const [storedImageUrl, setStoredImageUrl] = useState(null);
    const [email, setUserEmail] = useState(null);
    const [role, setRole] = useState(null); // State for user role
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

                if (decoded.email) {
                    setUserEmail(decoded.email);
                }

                if (decoded.image) {
                    setStoredImageUrl(decoded.image);
                }

                if (decoded.role) {
                    setRole(decoded.role); // Store the user role
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            console.error("No token found in localStorage");
        }

        // Start the camera on component mount
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera:", error);
            }
        };

        startCamera();
    }, []);

    const handleVerificationClick = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Simulated face matching logic (replace this with actual verification logic)
            const isMatch = Math.random() < 0.5; // Simulating a match with random outcome

            if (isMatch) {
                // Show success notification and redirect based on role
                await Swal.fire({
                    title: 'Success!',
                    text: 'Face match successful!',
                    icon: 'success',
                    confirmButtonText: 'Go to Dashboard'
                });

                // Role-based redirection
                switch (role) {
                    case 'Admin':
                        navigate("/admin-dashboard");
                        break;
                    case 'Business owner':
                        navigate("/business-owner-dashboard");
                        break;
                    default:
                        navigate("/");
                }
            } else {
                // Show failure notification
                Swal.fire({
                    title: 'Failed!',
                    text: 'Face match failed. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100vh', padding: '20px', backgroundColor: '#f9f9f9' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
                {storedImageUrl ? (
                    <img src={storedImageUrl} alt="User" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} />
                ) : (
                    <p>No image available.</p>
                )}
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <video ref={videoRef} autoPlay style={{ width: '100%', maxHeight: '80vh', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <button onClick={handleVerificationClick} style={{ padding: '15px 30px', fontSize: '18px', color: 'white', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                    Start Verification
                </button>
            </div>
        </div>
    );
};

export default FaceRecon;