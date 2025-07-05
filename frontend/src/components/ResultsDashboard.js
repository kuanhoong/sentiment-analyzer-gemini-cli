
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsDashboard = ({ results }) => {
    const { sentiment_counts, top_comments } = results;

    const chartData = {
        labels: Object.keys(sentiment_counts),
        datasets: [
            {
                label: 'Number of Comments',
                data: Object.values(sentiment_counts),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
            },
        ],
    };

    return (
        <div>
            <h2>Sentiment Distribution</h2>
            <Bar data={chartData} />

            <h2>Top Comments</h2>
            {Object.entries(top_comments).map(([sentiment, comments]) => (
                <div key={sentiment}>
                    <h3>{sentiment}</h3>
                    <ul>
                        {comments.map((comment, index) => (
                            <li key={index}>{comment}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ResultsDashboard;
