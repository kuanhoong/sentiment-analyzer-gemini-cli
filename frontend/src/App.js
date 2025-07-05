import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

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
        <div className="App">
            <header className="App-header">
                <h1>Sentiment Analysis</h1>
            </header>
            <main>
                <FileUpload onFileUpload={handleFileUpload} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {results && <ResultsDashboard results={results} />}
            </main>
        </div>
    );
}

export default App;