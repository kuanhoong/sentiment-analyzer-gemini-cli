
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import io
import os
from dotenv import load_dotenv
import google.generativeai as genai
import re
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import json

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
        prompt = f"Classify the sentiment of the following comment as Positive, Negative, Neutral, or Mixed: \"{comment}\"";
        response = model.generate_content(prompt);
        sentiment_text = response.text.strip();
        
        # Use regex to find the sentiment word
        match = re.search(r'(Positive|Negative|Neutral|Mixed)', sentiment_text, re.IGNORECASE);
        if match:
            return match.group(1).capitalize();
        else:
            return "Mixed" # Default to Mixed if no clear sentiment is found
    except Exception as e:
        print(f"Error classifying sentiment for \"{comment}\": {e}");
        return "Error"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")
    contents = await file.read()
    print(f"File content length: {len(contents)} bytes")
    
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        print("Successfully read CSV into DataFrame.")
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return {"error": f"Error reading CSV: {e}"}
    
    if 'Comment' not in df.columns:
        print("Error: 'Comment' column not found.")
        return {"error": "'Comment' column not found in the uploaded file."}
    print("Comment column found.")

    # Gemini sentiment analysis
    df['sentiment'] = df['Comment'].apply(classify_sentiment)
    print("Sentiment analysis complete.")
    
    # Count total number of comments per sentiment
    sentiment_counts = df['sentiment'].value_counts().to_dict()
    print(f"Sentiment counts: {sentiment_counts}")

    # Extract top 3 representative comments for each sentiment
    top_comments = {}
    for sentiment in sentiment_counts.keys():
        top_comments[sentiment] = df[df['sentiment'] == sentiment]['Comment'].head(3).tolist()
    print(f"Top comments: {top_comments}")

    return {
        "sentiment_counts": sentiment_counts,
        "top_comments": top_comments
    }

@app.post("/generate-pdf")
async def generate_pdf_report(results: dict):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("Sentiment Analysis Report", styles['h1']))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Sentiment Distribution:", styles['h2']))
    for sentiment, count in results['sentiment_counts'].items():
        story.append(Paragraph(f"{sentiment}: {count}", styles['Normal']))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Top Comments:", styles['h2']))
    for sentiment, comments in results['top_comments'].items():
        story.append(Paragraph(f"{sentiment}:", styles['h3']))
        for comment in comments:
            story.append(Paragraph(f"- {comment}", styles['Normal']))
        story.append(Spacer(1, 0.1 * inch))

    doc.build(story)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={'Content-Disposition': 'attachment; filename="sentiment_report.pdf"'})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
