import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FileTranslator = () => {
    const fileInputRefs = {
        fr: useRef(null),
        en: useRef(null),
        ar: useRef(null)
    };
    const [logs, setLogs] = useState([]);
    const [downloadLink, setDownloadLink] = useState('');

    const handleFileChange = async (e, targetLang) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;

            try {
                const res = await axios.post("http://localhost:5000/translate", {
                    q: text,
                    source: "auto",
                    target: targetLang,
                    format: "text",
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                console.log("Translation success:", res.data);
                setLogs(prevLogs => [...prevLogs, "Translation success: " + res.data.translatedText]);

                // Create a blob and set the download link
                const blob = new Blob([res.data.translatedText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                setDownloadLink(url);

                // Show SweetAlert with options
                Swal.fire({
                    title: 'Translation Successful!',
                    text: 'Your file has been translated.',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Proceed',
                    cancelButtonText: 'Download the File'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // User clicked "Proceed"
                        console.log("User chose to proceed.");
                    } else if (result.isDismissed) {
                        // User clicked "Download the File"
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'translated_text.txt'; // Set the filename
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                });

            } catch (err) {
                console.error("Translation failed:", err.response?.data || err.message);
                setLogs(prevLogs => [...prevLogs, "Translation failed: " + (err.response?.data || err.message)]);
            }
        };
        
        reader.readAsText(file); // Read the file as text
    };

    const triggerFileInput = (lang) => {
        fileInputRefs[lang].current.click();
    };

    return (
        <div>
            <h6 className="mb-24">Translate Your Files</h6>
            <div className="row gy-4">
                {[
                    { lang: "fr", label: "Français", desc: "Traduisez vos fichiers texte ici", icon: "twemoji:flag-france", bg: "bg-gradient-purple", btnColor: "text-purple-600", text: "Traduire" },
                    { lang: "en", label: "English", desc: "Translate your text files here", icon: "twemoji:flag-united-states", bg: "bg-gradient-primary", btnColor: "text-primary-600", text: "Translate" },
                    { lang: "ar", label: "العربية", desc: "ترجم ملفات النص الخاصة بك هنا", icon: "twemoji:flag-saudi-arabia", bg: "bg-gradient-success", btnColor: "text-success-600", text: "ترجمة" },
                ].map(({ lang, label, desc, icon, bg, btnColor, text }) => (
                    <div className="col-xxl-3 col-sm-6" key={lang}>
                        <div className={`card h-100 radius-12 ${bg} text-center`}>
                            <div className="card-body p-24">
                                <div className={`w-64-px h-64-px d-inline-flex align-items-center justify-content-center text-white mb-16 radius-12`}>
                                    <Icon icon={icon} className="h5 mb-0" />
                                </div>
                                <h6 className="mb-8">{label}</h6>
                                <p className="card-text mb-8 text-secondary-light">{desc}</p>

                                <button
                                    className={`btn ${btnColor} hover-text-white px-3 py-2 d-inline-flex align-items-center gap-2 border-0`}
                                    onClick={() => triggerFileInput(lang)}
                                >
                                    {text}
                                    <Icon icon="iconamoon:arrow-right-2" className="text-xl" />
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRefs[lang]}
                                    style={{ display: "none" }}
                                    accept=".txt" // Only allow .txt files
                                    onChange={(e) => handleFileChange(e, lang)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

          
        </div>
    );
};

export default FileTranslator;