import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';

const FaceRecognition = ({ cloudinaryImageUrl, onFaceVerified }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [video, setVideo] = useState(null);
  
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setIsModelLoaded(true);
      } catch (error) {
        toast.error('Error loading face-api models');
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (isModelLoaded) {
      startVideo();
    }
  }, [isModelLoaded]);

  const startVideo = () => {
    const videoElement = document.getElementById('video');
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoElement.srcObject = stream;
        setVideo(stream);
      })
      .catch((err) => {
        toast.error('Error accessing webcam: ' + err);
      });
  };

  const handleVideoOnPlay = async () => {
    // Detect faces from webcam video
    const detections = await faceapi.detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length > 0) {
      // Fetch the image from Cloudinary
      const cloudinaryImage = await fetch(cloudinaryImageUrl);
      const cloudinaryBlob = await cloudinaryImage.blob();
      const cloudinaryImageData = await faceapi.bufferToImage(cloudinaryBlob);

      // Detect face descriptors from Cloudinary image
      const detectionsFromCloudinary = await faceapi.detectSingleFace(cloudinaryImageData)
        .withFaceLandmarks()
        .withFaceDescriptor();

      // Compare the webcam face descriptor with the Cloudinary face descriptor
      if (detectionsFromCloudinary && detections.length > 0) {
        const faceMatcher = new faceapi.FaceMatcher(detectionsFromCloudinary);
        const match = faceMatcher.findBestMatch(detections[0].descriptor);

        // If the match is above a certain threshold (e.g., 0.6), consider it a successful match
        if (match && match.distance < 0.6) {
          onFaceVerified();  // Successfully recognized face, proceed with login
        } else {
          toast.error('Face not recognized. Please try again.');
        }
      }
    }
  };

  return (
    <div>
      <video
        id="video"
        width="720"
        height="560"
        onPlay={handleVideoOnPlay}
        autoPlay
        muted
      />
      {!isModelLoaded && <p>Loading face-api models...</p>}
    </div>
  );
};

export default FaceRecognition;
