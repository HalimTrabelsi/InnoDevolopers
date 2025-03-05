import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FaceRecon = ({ userEmail }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState("");
  const [storedImageUrl, setStoredImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          console.log("Camera setup successful");
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam. Please allow camera access.");
      }
    };

    setupCamera();
  }, []);

  useEffect(() => {
    const fetchStoredImage = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/users/profile-image", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStoredImageUrl(response.data.imageUrl);
        console.log("Stored image URL:", response.data.imageUrl);
      } catch (err) {
        console.error("Error fetching stored image:", err.response?.data || err.message);
        setError("Error fetching stored image. Please try again later.");
      }
    };

    fetchStoredImage();
  }, [userEmail]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Get the image as a Base64 string (remove metadata prefix)
    return canvas.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");
  };

  const verifyFace = async () => {
    const imageBase64 = captureImage();
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    console.log("Retrieved token for verification:", token);

    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/compare",
        {
          email: userEmail,
          imageBase64,
          storedImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in request
          },
        }
      );

      console.log("Face verification response:", response.data);

      if (response.data.success) {
        setVerificationResult("Face verified successfully!");

        const { role } = JSON.parse(atob(token.split(".")[1]));
        console.log("User role:", role);

        navigate(role === "Admin" ? "/admin-dashboard" : "/user-dashboard");
      } else {
        setVerificationResult("Face verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying face:", err.response?.data || err.message);
      setError("Error verifying face. Please try again later.");
    }
  };

  return (
    <div>
      <video ref={videoRef} width="300" height="300" autoPlay />
      <canvas ref={canvasRef} width="300" height="300" style={{ display: "none" }} />
      <div>
        <button onClick={verifyFace}>Verify Face</button>
      </div>
      {verificationResult && <p>{verificationResult}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FaceRecon;
