
import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import ResultsDashboard from './components/ResultsDashboard';
import KeyInsights from './components/KeyInsights';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        setFileName(file.name);

        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResults(response.data);
            setError(null);
        } catch (error) {
            setError('Error uploading file. Please try again.');
            setResults(null);
        }
    };

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h1>Sentiment Analysis Dashboard</h1>
                <p className="lead">Upload your survey comments to analyze sentiment and gain insights</p>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>AI Model:</strong> Gemini 1.5 Flash (High accuracy sentiment analysis)
                        </div>
                        <div>
                            <button className="btn btn-primary me-2">Download PDF Report</button>
                            <FileUpload onFileUpload={handleFileUpload} />
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {results && (
                <div>
                    <KeyInsights results={results} />
                    <ResultsDashboard results={results} />
                </div>
            )}
        </div>
    );
}

export default App;
