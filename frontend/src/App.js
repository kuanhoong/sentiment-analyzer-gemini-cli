
import React, { useState, useRef } from 'react';
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
            console.log("File upload successful:", response.data);
        } catch (error) {
            console.error("File upload error:", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                console.error("Error response headers:", error.response.headers);
                setError(`Error: ${error.response.data.error || 'Server error'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error request:", error.request);
                setError('Error: No response from server. Is the backend running?');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error message:", error.message);
                setError(`Error: ${error.message}`);
            }
            setResults(null);
        }
    };

    const resultsDashboardRef = useRef(null);

    const handleDownloadPdf = async () => {
        try {
            let chartImage = null;
            if (resultsDashboardRef.current) {
                chartImage = await resultsDashboardRef.current.exportChart();
            }

            const response = await axios.post('http://localhost:8000/generate-pdf', { ...results, chartImage }, {
                responseType: 'blob', // Important for downloading files
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sentiment_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            setError('Error generating PDF report.');
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
                            <button className="btn btn-primary me-2" onClick={handleDownloadPdf} disabled={!results}>Download PDF Report</button>
                            <FileUpload onFileUpload={handleFileUpload} />
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {results && (
                <div>
                    <KeyInsights results={results} />
                    <ResultsDashboard ref={resultsDashboardRef} results={results} />
                </div>
            )}
        </div>
    );
}

export default App;
