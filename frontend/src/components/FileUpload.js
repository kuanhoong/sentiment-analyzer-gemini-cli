
import React from 'react';

const FileUpload = ({ onFileUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".csv,.xlsx" />
        </div>
    );
};

export default FileUpload;
