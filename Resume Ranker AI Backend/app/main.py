import json
import shutil
from typing import List
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status, Form
from fastapi.datastructures import UploadFile
from fastapi.responses import JSONResponse
from app.services.drive_service import get_credentials, process_file
from app.services.keyword_service import extract_keywords_with_langchain
from app.services.resume_service import rank_resume_with_bonus
# from app.services.quiz_service import generate_coding_quiz, QuizRequest
from app.services.quiz_service import generate_question_pool, JobData, load_json, select_questions
from app.services.email_service import generate_email_content, EmailRequest, GeneratedContent
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
from apiclient import discovery
from pydantic import BaseModel
import os
from typing import List, Dict, Union

app = FastAPI()

# Directory for storing uploaded PDFs
UPLOAD_DIR = "uploads/jd_pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Drive API service
credentials = get_credentials()
service = discovery.build('drive', 'v3', credentials=credentials)

# Global variable to store keywords extracted from JD
extracted_keywords = []

# Assuming the `questions` folder is inside the `app` directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FOLDER = os.path.join(BASE_DIR, "questions")

@app.post("/upload-jd/", response_model=dict)
async def upload_jd(jd: UploadFile = File(...)):
    """Endpoint to upload and process a job description (JD) file."""
    global extracted_keywords

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(await jd.read())
        tmp_path = tmp_file.name

    # Use Google Drive API to process the JD file and extract text
    jd_text = process_file(tmp_path, service)
    os.remove(tmp_path)

    if not jd_text:
        return JSONResponse(content={"error": "Failed to extract text from JD file"}, status_code=400)

    # Extract keywords from the JD text
    extracted_keywords = extract_keywords_with_langchain(jd_text)

    if not extracted_keywords:
        return JSONResponse(content={"error": "Failed to extract keywords from JD"}, status_code=400)

    return {"keywords": extracted_keywords}


@app.post("/upload-resume/", response_model=dict)
async def upload_resume(resume: UploadFile = File(...), keywords: str = Form(...)):
    """Endpoint to upload and process a resume file."""

    # Split the incoming keywords string by commas
    extracted_keywords = [keyword.strip() for keyword in keywords.split(',')]
    print(extracted_keywords)

    if not extracted_keywords:
        return JSONResponse(content={"error": "No keywords extracted from JD."}, status_code=400)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(await resume.read())
        tmp_path = tmp_file.name

    # Process the resume file and extract text
    resume_text = process_file(tmp_path, service)
    os.remove(tmp_path)

    if not resume_text:
        return JSONResponse(content={"error": "Failed to extract text from resume file"}, status_code=400)

    # Rank resume based on the provided keywords
    score, matched_keywords = rank_resume_with_bonus(resume_text, extracted_keywords)

    # Round off the score to three decimal places
    rounded_score = round(score, 3)

    return {"score": rounded_score, "matched_keywords": matched_keywords}


# @app.post("/generate-quiz/", response_model=dict)
# async def generate_quiz(request: QuizRequest):
#     """
#     Endpoint to generate a quiz based on keywords and job role.
#     """
#     if not request.keywords:
#         raise HTTPException(status_code=400, detail="No keywords provided to generate a quiz")

#     if not request.title:
#         raise HTTPException(status_code=400, detail="No job role provided to generate a quiz")

#     # Generate a quiz based on the provided keywords and job role
#     quiz = generate_coding_quiz(request.keywords, request.title)

#     return {"quiz": quiz}

@app.post("/generate_questions/")
async def generate_questions(job_data: JobData):
    """
    Endpoint to generate job-specific questions based on job title and keywords.
    """
    try:
        num_questions_per_template = 10  # Hardcoded value
        questions_folder = "app/questions"  # Path to the 'questions' folder
        os.makedirs(questions_folder, exist_ok=True)  # Create the folder if it doesn't exist
        
        output_filename = os.path.join(
            questions_folder,
            f"{job_data.job_title.replace(' ', '_').lower()}.json"
        )
        
        # Generate the question pool
        generate_question_pool(job_data.job_title, job_data.keywords, num_questions_per_template, output_filename)

        return {"msg": f"Successfully generated {num_questions_per_template} questions for job title {job_data.job_title}. File saved as {output_filename}."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

@app.get("/api/questions/{job_title}")
def get_questions(job_title: str) -> Dict[str, Union[str, Dict[str, List[Dict[str, Union[str, List[str], None]]]]]]:
    """
    API endpoint to fetch questions based on the job title.
    """
    # Normalize job title to lowercase and replace spaces with underscores
    normalized_job_title = job_title.lower().replace(" ", "_")
    
    # Look for a JSON file matching the job title
    matching_file = None
    for filename in os.listdir(QUESTIONS_FOLDER):
        if filename.lower().startswith(normalized_job_title) and filename.endswith(".json"):
            matching_file = os.path.join(QUESTIONS_FOLDER, filename)
            break

    if not matching_file:
        raise HTTPException(
            status_code=404,
            detail=f"No questions found for job title: {job_title}",
        )
    
    # Load questions from the matched file
    data = load_json(matching_file)

    # print(data)
    
    # Randomly select questions as per the specified distribution
    selected_questions = select_questions(data)
    
    return {
        "job_title": job_title,
        "questions": selected_questions,
    }

# Endpoint to generate email content using the above function
@app.post("/generate-email-content/", response_model=GeneratedContent)
async def generate_email_content_endpoint(request: EmailRequest):
    return generate_email_content(request.candidate_name, request.job_title, request.hr_email, request.hrName, request.title, request.job_description)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
