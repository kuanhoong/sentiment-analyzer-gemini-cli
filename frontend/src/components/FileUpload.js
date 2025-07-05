import React, { useRef } from 'react';

const FileUpload = ({ onFileUpload }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".csv,.xlsx"
            />
            <button className="btn btn-secondary" onClick={handleClick}>Upload New File</button>
        </>
    );
};

export default FileUpload;