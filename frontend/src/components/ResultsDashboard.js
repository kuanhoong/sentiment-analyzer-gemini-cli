import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsDashboard = forwardRef(({ results }, ref) => {
    const chartRef = useRef();

    useImperativeHandle(ref, () => ({
        exportChart: async () => {
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current);
                return canvas.toDataURL('image/png');
            }
            return null;
        }
    }));

    const { sentiment_counts, top_comments } = results;

    const chartData = {
        labels: Object.keys(sentiment_counts),
        datasets: [
            {
                data: Object.values(sentiment_counts),
                backgroundColor: [
                    '#28a745',
                    '#dc3545',
                    '#ffc107',
                    '#6c757d',
                ],
            },
        ],
    };

    const totalComments = Object.values(sentiment_counts).reduce((a, b) => a + b, 0);

    return (
        <div className="row">
            <div className="col-md-5">
                <div className="card">
                    <div className="card-body" ref={chartRef}>
                        <h5 className="card-title">Sentiment Distribution</h5>
                        <Pie data={chartData} />
                        <div className="d-flex justify-content-around mt-3">
                            {Object.keys(sentiment_counts).map(sentiment => (
                                <div key={sentiment} className="text-center">
                                    <strong>{sentiment}</strong>
                                    <div>{sentiment_counts[sentiment]} ({((sentiment_counts[sentiment] / totalComments) * 100).toFixed(1)}%)</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-7">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Detailed Breakdown</h5>
                        {Object.entries(top_comments).map(([sentiment, comments]) => (
                            <div key={sentiment} className="mb-4">
                                <h6>{sentiment} <span className="text-muted">{sentiment_counts[sentiment]} comments ({((sentiment_counts[sentiment] / totalComments) * 100).toFixed(1)}%)</span></h6>
                                {comments.map((comment, index) => (
                                    <div key={index} className="bg-light p-2 mb-2 rounded">
                                        {comment}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ResultsDashboard;