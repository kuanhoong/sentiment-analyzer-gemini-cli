
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI()

# CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def classify_sentiment(comment):
    try:
        prompt = f"Classify the sentiment of the following comment as Positive, Negative, Neutral, or Mixed: \"{comment}\""
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return "Error"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    
    if 'Comment' not in df.columns:
        return {"error": "'Comment' column not found in the uploaded file."}

    # Gemini sentiment analysis
    df['sentiment'] = df['Comment'].apply(classify_sentiment)
    
    # Count total number of comments per sentiment
    sentiment_counts = df['sentiment'].value_counts().to_dict()

    # Extract top 3 representative comments for each sentiment
    top_comments = {}
    for sentiment in sentiment_counts.keys():
        top_comments[sentiment] = df[df['sentiment'] == sentiment]['Comment'].head(3).tolist()

    return {
        "sentiment_counts": sentiment_counts,
        "top_comments": top_comments
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
