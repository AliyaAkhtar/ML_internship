# keyword_extraction.py
import re
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv

# Load environment variables (API key from .env file)
load_dotenv()

# Setup OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI model using LangChain
llm = ChatOpenAI(model_name="gpt-3.5-turbo", openai_api_key=OPENAI_API_KEY)

# Define prompt templates
keyword_extraction_template = PromptTemplate(
    input_variables=["jd_text"],
    template=(
        "Please extract the most relevant skills, tools, and qualifications from the following job description. "
        "Provide the output as a comma-separated list of key skills and technologies only (no other text).\n\n"
        "{jd_text}"
    )
)

def extract_keywords_with_langchain(jd_text):
    """Extracts relevant job-related keywords from the job description using LangChain."""
    print("Extracting keywords from JD using LangChain...")
    keywords_response = LLMChain(llm=llm, prompt=keyword_extraction_template).run(jd_text)
    keywords = clean_keywords(keywords_response)
    print("Extracted keywords: ", keywords)
    return keywords

def clean_keywords(extracted_text):
    """Cleans and splits the extracted keywords from the job description."""
    cleaned_text = re.sub(r'(Skills|Tools|Qualifications|[\d.]+|Extracted from the Job Description|for software developer:|\n|:-)', '', extracted_text)
    keywords = re.split(r'[,\n]+', cleaned_text)
    keywords = [kw.strip().lower() for kw in keywords if kw.strip()]
    print(f"Cleaned Keywords: {keywords}")
    return keywords
