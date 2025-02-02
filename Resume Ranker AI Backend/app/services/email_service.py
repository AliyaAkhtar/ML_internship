from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

# Load environment variables (API key from .env file)
load_dotenv()

# Setup OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# LangChain setup
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo", temperature=0.7)

class EmailRequest(BaseModel):
    candidate_name: str
    job_title: str
    hr_email: str
    hrName: str
    title: str
    job_description: str = ""  # Optional, you can send extra details like the job description

class GeneratedContent(BaseModel):
    subject: str
    body: str

def generate_email_content(candidate_name: str, job_title: str, hr_email: str, hrName: str, title: str, job_description: str = "") -> GeneratedContent:
    try:
        # Request for email content generation from OpenAI via LangChain
        # prompt = (
        #     f"Generate a professional email body. The candidate {candidate_name} applied for the job '{job_title}' "
        #     f"with the HR name being {hrName}, HR email being {hr_email} and title being {title}. "
        #     f"The following details can be used for the job description: {job_description}.\n\n"
        #     "Please write a professional message for the candidate, "
        #     "thanking them for their application and providing next steps in the recruitment process."
        # )

        prompt = (
            f"Generate a professional email body. The candidate {candidate_name} applied for the job '{job_title}' "
            f"with the HR name being {hrName}, HR email being {hr_email}, and title being {title}. "
            f"The following details can be used for the job description: {job_description}.\n\n"
            "Please tart with a greeting to the candidate, such as 'Dear {candidate_name},'\n\n"
            "Then, write a professional message for the candidate, thanking them for their application and providing next steps in the recruitment process. "
            "Let them know that as soon as they receive the email, a quiz related to the job will be available for them on their portal. "
        
        )


        # Call LangChain's API to generate the email content
        response = llm.predict(prompt)

        # Extract email content (text)
        email_body = response.strip()

        return GeneratedContent(
            subject=f"Congratulations on your application for {job_title}!",
            body=email_body
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")
