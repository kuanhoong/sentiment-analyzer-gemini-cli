# Sentiment Analysis Dashboard

This is a full-stack web application that allows users to upload Google Sheets files (.csv or .xlsx) containing survey comments and classify their sentiment using the Gemini API.

## Functional Requirements

1.  **File Upload Interface:**
    *   Upload .csv or .xlsx files (from exported Google Sheets).
    *   Read comments from a column named "Comment".

2.  **Sentiment Classification (Gemini only):**
    *   Utilizes the Gemini API to classify the sentiment of each comment into: Positive, Negative, Neutral, or Mixed.
    *   Prompt used: “Classify the sentiment of the following comment as Positive, Negative, Neutral, or Mixed.”
    *   Output is saved alongside the comment in a structured format.

3.  **Analysis and Insight:**
    *   Counts the total number of comments per sentiment category.
    *   Extracts the top 3 representative comments for each sentiment.

4.  **Visualization Dashboard:**
    *   Displays a pie chart of sentiment distribution.
    *   Shows top comments per sentiment category.

## Technical Stack

*   **Frontend:** React
*   **Backend:** Python (FastAPI)
*   **Visualization:** Chart.js
*   **AI:** Gemini 1.5 Flash

## Project Setup

### Prerequisites

*   Python 3.8+
*   Node.js and npm
*   A Gemini API Key

### 1. Clone the repository

```bash
git clone https://github.com/kuanhoong/sentiment-analyzer-gemini-cli.git
cd sentiment-analyzer-gemini-cli
```

### 2. Backend Setup

Navigate to the `backend` directory, create a virtual environment, install dependencies, and set up your Gemini API key.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and add your Gemini API key:

```
GEMINI_API_KEY=YOUR_API_KEY
```

### 3. Frontend Setup

Navigate to the `frontend` directory and install dependencies.

```bash
cd ../frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

From the project root directory, run:

```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend Development Server

From the project root directory, run:

```bash
cd frontend
npm start
```

The frontend application will open in your browser at `http://localhost:3000`.

## Usage

1.  **Upload File:** On the dashboard, click "Upload New File" and select a `.csv` or `.xlsx` file containing survey comments. Ensure there is a column named "Comment".
2.  **View Results:** After uploading, the application will display the sentiment distribution (pie chart) and top comments for each sentiment category.

## Project Automation Rule

This project follows a strict automation rule:

1.  A Git repository is initialized from the beginning.
2.  After each successful development step or test run, code is committed to Git with a meaningful commit message.
3.  This rule ensures that every working state is version-controlled and recoverable.
4.  No local changes should remain uncommitted before starting the next development iteration.

### Example Commit Messages:

*   `feat: added file upload interface`
*   `chore: updated Gemini API call for sentiment classification`
*   `fix: resolved bug in visualization rendering`
*   `refactor: cleaned up component logic`
*   `docs: added sentiment analysis instructions`
