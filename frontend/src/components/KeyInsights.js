
import React from 'react';

const KeyInsights = ({ results }) => {
    const { sentiment_counts } = results;
    const totalComments = Object.values(sentiment_counts).reduce((a, b) => a + b, 0);
    const positivePercentage = ((sentiment_counts['Positive'] / totalComments) * 100).toFixed(1);
    const negativePercentage = ((sentiment_counts['Negative'] / totalComments) * 100).toFixed(1);

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Key Insights</h5>
                <p>
                    Comments show mixed sentiment with positive being most common ({positivePercentage}%).
                    A significant portion ({negativePercentage}%) are negative.
                </p>
            </div>
        </div>
    );
};

export default KeyInsights;
