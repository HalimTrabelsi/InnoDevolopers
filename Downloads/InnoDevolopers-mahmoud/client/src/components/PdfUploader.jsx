import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios'; // Make sure axios is installed in your project

const PdfUploader = ({ onResults }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: '⚠️ Please select a file before uploading.',
                timer: 3000,
                showConfirmButton: false
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5001/api/ai/analyze-pdf", formData);
            const results = res.data.results;
            onResults(results);

            // Check compliance status
            const isCompliant = results.every(item => item.classification === "Compliant");
            if (isCompliant) {
                Swal.fire({
                    icon: 'success',
                    title: 'Compliant!',
                    text: '✅ The report is compliant!',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Compliance Issues!',
                    text: '❌ The report has compliance issues!',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: '❌ Error analyzing the file. Please try again.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="pdf-uploader my-4 p-3 border rounded">
            <div className="file-upload-container">
                {/* Hidden input with custom label button */}
                <input
                    type="file"
                    accept="application/pdf"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="d-none"
                />
                <label htmlFor="file-upload" className="custom-file-upload btn btn-secondary w-100 d-flex align-items-center justify-content-center">
                    <Icon icon="bx:bx-file" className="me-2" /> Choose a PDF file
                </label>
            </div>
            <button onClick={handleUpload} className="btn btn-primary btn-sm mt-3 w-100">
                Upload & Analyze
            </button>
        </div>
    );
};

export default PdfUploader;
