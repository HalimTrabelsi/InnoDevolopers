import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'

const UploadWithImagePreviewList = () => {
    const [fileNames, setFileNames] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newFileNames = files.map((file) => file.name);
        setFileNames((prev) => [...prev, ...newFileNames]);
    };

    const removeFileName = (name) => {
        setFileNames((prev) => prev.filter((fileName) => fileName !== name));
    };
    return (
        <div className="col-md-6">
            <div className="card h-100 p-0">
                
                <div className="card-body p-24">
                   
                        <Icon icon="solar:upload-linear" className="text-xl"></Icon>
                        <input
                            type="file"
                            className="form-control w-auto mt-24 form-control-lg"
                            id="file-upload-name"
                            multiple
                            hidden
                            onChange={handleFileChange}
                        />

                    {fileNames.length > 0 && (
                        <ul id="uploaded-img-names" className="show-uploaded-img-name">
                            {fileNames.map((fileName, index) => (
                                <li
                                    key={index}
                                    className="uploaded-image-name-list text-primary-600 fw-semibold d-flex align-items-center gap-2"
                                >
                                    <Icon
                                        icon="ph:link-break-light"
                                        className="text-xl text-secondary-light"
                                    ></Icon>
                                    {fileName}
                                    <Icon
                                        icon="radix-icons:cross-2"
                                        className="remove-image text-xl text-secondary-light text-hover-danger-600"
                                        onClick={() => removeFileName(fileName)}
                                    ></Icon>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UploadWithImagePreviewList