import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';

const PdfSummarizer = () => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [results, setResults] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log("File selected:", selectedFile);
        setFile(selectedFile);
        setSummary('');
        setResults([]);
    };

    const handleUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: '⚠️ Please select a PDF file before uploading.',
                timer: 3000,
                showConfirmButton: false
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            console.log("Uploading:", file.name);
            const res = await axios.post("http://localhost:5001/api/summarize-pdf", formData);

            const summaryFromAPI = res.data.summary_text || res.data.summary;

            if (
                typeof summaryFromAPI === "string" &&
                summaryFromAPI.trim() !== "" &&
                summaryFromAPI !== "No summary could be generated."
            ) {
                console.log("✅ Summary received:", summaryFromAPI);
                setSummary(summaryFromAPI);

                Swal.fire({
                    title: '🧠 Summary of your PDF',
                    html: `<div style="max-height: 300px; overflow-y: auto; text-align: left; font-size: 16px;">${summaryFromAPI.replace(/\n/g, "<br>")}</div>`,
                    width: 700,
                    confirmButtonText: 'Close',
                });
            } else {
                console.log("❌ No valid summary received:", res.data);
                setSummary('No summary could be generated.');
                Swal.fire({
                    icon: 'error',
                    title: 'No summary returned',
                    text: '❌ Could not generate a summary for the document.',
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setSummary('No summary could be generated.');
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: '❌ Error summarizing the PDF. Please try again.',
                timer: 3000,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="pdf-summarizer my-4 p-4 border rounded shadow">
            <h3 className="text-center mb-4">📄 Analyze your PDF Document</h3>

            <div className="file-upload-container mb-3">
                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    className="btn btn-secondary w-100 d-flex align-items-center justify-content-center"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Icon icon="bx:bx-file" className="me-2" />
                    Choose a PDF file
                </button>
                {file && (
                    <p className="text-center mt-2">
                        📎 Selected: <strong>{file.name}</strong>
                    </p>
                )}
            </div>

            <button
                onClick={handleUpload}
                className="btn btn-primary btn-lg w-100"
                disabled={!file}
            >
                Upload & Summarize
            </button>

            {summary && (
                <div className="mt-4 p-3 border rounded bg-light">
                    <h5>🧠 Summary Preview:</h5>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
                </div>
            )}

            {results.length > 0 && (
                <div className="mt-4">
                    <h5>Results:</h5>
                    <ul className="list-unstyled">
                        {results.map((result, index) => (
                            <li
                                key={index}
                                className={`p-2 border rounded mb-2 ${result.classification === "Compliant" ? "bg-success text-white" : "bg-danger text-white"}`}
                            >
                                {result.text} - <strong>{result.classification}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PdfSummarizer;
