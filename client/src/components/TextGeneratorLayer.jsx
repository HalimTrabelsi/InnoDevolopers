import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PdfUploader = ({ onResults }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warning("⚠️ Please select a file before uploading.");
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
                toast.success("✅ The report is compliant!");
            } else {
                toast.error("❌ The report has compliance issues!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("❌ Error analyzing the file. Please try again.");
        }
    };

    return (
        <div className="pdf-uploader my-4 p-3 border rounded">
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-2" />
            <button onClick={handleUpload} className="btn btn-primary">
                Upload & Analyze
            </button>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

const TextGeneratorLayer = () => {
    const [results, setResults] = useState([]);

    const handlePdfResults = (newResults) => {
        setResults(newResults);
    };

    // Separate results into compliant and non-compliant sections
    const compliantResults = results.filter(item => item.classification === "Compliant");
    const nonCompliantResults = results.filter(item => item.classification !== "Compliant");

    return (
        <div className="row gy-4 flex-wrap-reverse">
           
            <div className="col-xxl-9 col-lg-8">
                <div className="chat-main card overflow-hidden">
                    <div className="chat-sidebar-single gap-8 justify-content-between cursor-default flex-nowrap">
                        <div className="d-flex align-items-center gap-16">
                        <div className="p-24">
                            {/* AI emoji link with moving animation */}
                            <span className="ai-emoji-link text-2xl line-height-1">
                                🤖
                            </span>
                        </div>  
                            <h6 className="text-lg mb-0 text-line-1">
                                Analyze your financial reports here
                            </h6>
                        </div>
                    </div>
                    <div className="chat-message-list max-h-612-px min-h-612-px">
                        {/* Display results as messages */}
                        {results.length > 0 && (
                            <div className="messages-output mb-3">
                                {/* Compliant section */}
                                {compliantResults.length > 0 && (
                                    <div className="compliant-section">
                                        <h5 className="text-success">
                                            ✅ The report is compliant!
                                        </h5>
                                        {compliantResults.map((item, index) => (
                                            <div key={index} className="message compliant">
                                                <strong>{item.sentence}</strong> - <span className="text-success">✅ Compliant</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Non-compliant section */}
                                {nonCompliantResults.length > 0 && (
                                    <div className="non-compliant-section">
                                        <h5 className="text-danger">
                                            ❌ The report has compliance issues!
                                        </h5>
                                        {nonCompliantResults.map((item, index) => (
                                            <div key={index} className="message non-compliant">
                                                <strong>{item.sentence}</strong> - <span className="text-danger">🛑 Non-Compliant</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <PdfUploader onResults={handlePdfResults} />
                </div>
            </div>
        </div>
    );
};

export default TextGeneratorLayer;
