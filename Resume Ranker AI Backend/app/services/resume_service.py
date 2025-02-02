# resume_ranking.py
import re
import nltk
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from .keyword_service import extract_keywords_with_langchain
import os
from dotenv import load_dotenv

nltk.download('stopwords')
from nltk.corpus import stopwords

# OPENAI_API_KEY = "sk-HoMhc-gbzHMGwrAhDEai0dk8gEpyXmij31eJkQCPACT3BlbkFJgztz0vXbLHYFkY_vL-lZ2iZbnlch2RF1EeaFbLRGUA"

# Load environment variables (API key from .env file)
load_dotenv()

# Setup OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI model using LangChain
llm = ChatOpenAI(model_name="gpt-3.5-turbo", openai_api_key=OPENAI_API_KEY)

# Define templates
resume_evaluation_template = PromptTemplate(
    input_variables=["resume_text"],
    template=(
        "Please evaluate the following resume and identify any additional skills or experience that are valuable, "
        "even if they are outside the core job description. Please list these additional skills and then assign a bonus score out of 10 at the end of your response.\n\n"
        "Resume:\n{resume_text}"
    )
)

def rank_resume(resume_text, keywords):
    """Ranks the resume based on keyword matches."""
    print("Ranking resume based on keywords...")
    resume_words = clean_resume_text(resume_text)
    matched_keywords = [keyword for keyword in keywords if keyword in resume_words]
    max_score = 10
    score = (len(matched_keywords) / len(keywords)) * max_score if keywords else 0
    print(f"Resume matched {len(matched_keywords)} keywords.")
    return round(score, 2), matched_keywords

def clean_resume_text(resume_text):
    """Normalizes and cleans resume text for comparison."""
    resume_text = re.sub(r'[^\w\s]', '', resume_text.lower())
    resume_words = resume_text.split()
    return resume_words

def evaluate_resume_with_langchain(resume_text):
    """Evaluates the resume for valuable skills or experience beyond the JD."""
    print("Evaluating resume for additional valuable skills using LangChain...")
    response_text = LLMChain(llm=llm, prompt=resume_evaluation_template).run(resume_text)
    match = re.search(r'(\d{1,2})\s*(?:out of|/)?\s*10', response_text, re.IGNORECASE)
    if match:
        bonus_score = int(match.group(1))
        print(f"Bonus score extracted: {bonus_score}")
    else:
        print("No valid bonus score found in response, defaulting to 0.")
        bonus_score = 0
    return bonus_score

def rank_resume_with_bonus(resume_text, keywords):
    """Ranks the resume based on keyword matches and additional valuable skills."""
    print("Ranking resume based on keywords and additional skills...")
    primary_score, matched_keywords = rank_resume(resume_text, keywords)
    bonus_score = evaluate_resume_with_langchain(resume_text)
    final_score = (primary_score * 0.7) + (bonus_score * 0.3)
    print(f"Primary Score: {primary_score}, Bonus Score: {bonus_score}, Final Score: {final_score}")
    return final_score, matched_keywords
