import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useRef } from 'react';
import axios from 'axios';

const FileTranslator = () => {
    const fileInputRefs = {
        fr: useRef(null),
        en: useRef(null),
        ar: useRef(null)
    };

    const handleFileChange = async (e, targetLang) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("targetLang", targetLang);

        try {
            const res = await axios.post("http://localhost:5001/api/translate", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Translation success:", res.data);
            // You can display the translated file or download link here
        } catch (err) {
            console.error("Translation failed:", err.response?.data || err.message);
        }
    };

    const triggerFileInput = (lang) => {
        fileInputRefs[lang].current.click();
    };

    return (
        <div>
            <h6 className="mb-24">Translate Your Files</h6>
            <div className="row gy-4">

                {/* Card Generator */}
                {[
                    { lang: "fr", label: "Français", desc: "Traduisez vos fichiers PDF/Excel ici", icon: "twemoji:flag-france", bg: "bg-gradient-purple", btnColor: "text-purple-600", text: "Traduire" },
                    { lang: "en", label: "English", desc: "Translate your PDF/Excel files here", icon: "twemoji:flag-united-states", bg: "bg-gradient-primary", btnColor: "text-primary-600", text: "Translate" },
                    { lang: "ar", label: "العربية", desc: "ترجم ملفات PDF / Excel الخاصة بك هنا", icon: "twemoji:flag-saudi-arabia", bg: "bg-gradient-success", btnColor: "text-success-600", text: "ترجمة" },
                ].map(({ lang, label, desc, icon, bg, btnColor, text }) => (
                    <div className="col-xxl-3 col-sm-6" key={lang}>
                        <div className={`card h-100 radius-12 ${bg} text-center`}>
                            <div className="card-body p-24">
                                <div className={`w-64-px h-64-px d-inline-flex align-items-center justify-content-center text-white mb-16 radius-12`}>
                                    <Icon icon={icon} className="h5 mb-0" />
                                </div>
                                <h6 className="mb-8">{label}</h6>
                                <p className="card-text mb-8 text-secondary-light">{desc}</p>
                                
                                {/* Upload Button */}
                                <button
                                    className={`btn ${btnColor} hover-text-white px-3 py-2 d-inline-flex align-items-center gap-2 border-0`}
                                    onClick={() => triggerFileInput(lang)}
                                >
                                    {text}
                                    <Icon icon="iconamoon:arrow-right-2" className="text-xl" />
                                </button>

                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    ref={fileInputRefs[lang]}
                                    style={{ display: "none" }}
                                    accept=".pdf, .xls, .xlsx"
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
