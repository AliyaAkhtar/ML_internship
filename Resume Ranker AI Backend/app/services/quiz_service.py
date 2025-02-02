# import os
# import tempfile
# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# from typing import List
# from io import BytesIO
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from langchain_openai import ChatOpenAI
# from langchain.prompts import PromptTemplate

# # Load environment variables (API key from .env file)
# load_dotenv()

# # Setup OpenAI API key
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# # LangChain setup
# llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo", temperature=0.7)

# # Data model for the API request
# class QuizRequest(BaseModel):
#     keywords: List[str]
#     title: str  # Adding the job_role field dynamically


# def generate_coding_quiz(keywords: List[str], title: str) -> str:
#     """
#     Generate a professional-level quiz for interview tests, combining theoretical and coding questions.
#     """
#     """
#     Generate a professional-level quiz tailored to the job role and keywords provided.
#     """
#     prompt = f"""
#       You are tasked with generating a professional-level quiz for a 15-minute assessment tailored to the position of '{title}' using the keywords: {', '.join(keywords)}. 

#       The quiz should be engaging, role-specific, and designed to assess both theoretical knowledge and practical skills in a realistic, time-sensitive manner. Include the following:

#       1. **Six concise multiple-choice theoretical questions (MCQs)**:
#          - Focus on core knowledge, tools, frameworks, or methodologies related to the job role.
#          - Questions should emphasize real-world relevance (e.g., best practices, troubleshooting, or conceptual understanding).
#          - Each question must have four answer choices with only one correct answer.

#       2. **Four short practical tasks**:
#          - For technical roles: Include tasks such as writing a small, functional code snippet (e.g., generating a SQL query, designing a REST API endpoint, debugging a provided code block, or completing a function). These tasks should be solvable within 5–6 minutes each and must include clear constraints, sample inputs, and expected outputs.
#          - For non-technical roles: Include tasks such as drafting a professional email, analyzing a small dataset, or solving a situational case study. Ensure these are relevant to the job position and test role-specific practical skills.

#       Ensure the quiz is:
#       - Practical and concise, designed to be completed in 15 minutes.
#       - Tailored to the provided job role and keywords.
#       - Realistic, reflecting challenges that professionals encounter in the job role.
#       """

#     response = llm(prompt)  # Get AI response (AIMessage object)
#     quiz = response.content  # Access the content of the response
#     return quiz.strip()





import os
import json
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import random
from typing import List, Dict, Union
from fastapi import HTTPException

# Load environment variables (API key from .env file)
load_dotenv()

# Setup OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# LangChain AI setup
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo", temperature=0.7)

# Define refined templates for question types
question_templates = {
    "skill_check": "Generate {n} multiple-choice questions (MCQs) about {keywords} for the role of {job_role}. Each question should have four options (A, B, C, D), one correct answer, and a brief explanation for the correct answer.",
    "problem_solving": "Create {n} simple problem-solving tasks for the role of {job_role} that involve {keywords}. Each task should require a concise solution, like writing a short function, a single query, or fixing a small code snippet. Provide a solution with each task.",
    "knowledge_based": "Generate {n} knowledge-based MCQs for the role of {job_role}, focusing on {keywords}. Provide concise questions with four options (A, B, C, D) and clearly indicate the correct answer.",
    "tool_based": "Create {n} practical challenges for the role of {job_role}, focusing on using tools like {keywords}. Challenges should be concise, such as writing a command, using specific tool features, or configuring something quickly. Provide answers for each challenge.",
}

class JobData(BaseModel):
    job_title: str
    keywords: List[str]

# Generate questions using AI
def generate_question_pool(job_role: str, keywords: List[str], n: int, output_file: str):
    """
    Generate a pool of questions using AI and save them in a readable format.
    """
    question_pool = {}

    for template_name, template_prompt in question_templates.items():
        # Fill in the prompt for each template
        prompt = template_prompt.format(
            n=n, job_role=job_role, keywords=", ".join(keywords)
        )
        
        # Generate questions
        print(f"Generating {n} questions for {template_name}...")
        response = llm(prompt)

        # Split and process the response to ensure clear formatting
        try:
            # Use newline splits, but ensure filtering is applied
            questions = [q.strip() for q in response.content.split("\n") if q.strip()]
        except AttributeError:
            print(f"Error processing AI response for {template_name}: {response}")
            questions = ["Error generating questions."]

        # Add questions to the pool
        question_pool[template_name] = questions

    # Save to a file
    try:
        with open(output_file, "w") as file:
            json.dump(question_pool, file, indent=4)  # Pretty print the JSON file
        print(f"Generated questions saved to {output_file}.")
    except Exception as e:
        print(f"Failed to save questions: {e}")

# Helper function to load a JSON file
def load_json(file_path: str) -> Dict[str, List[str]]:
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading JSON file: {e}")

# Helper function to randomly select questions
def select_questions(data: Dict[str, List[str]]) -> Dict[str, List[Dict[str, Union[str, List[str], None]]]]:
    """
    Select a specific number of questions from each type:
    - 4 questions from "skill_check"
    - 3 questions from "knowledge_based"
    - 2 questions from "problem_solving"
    - 1 question from "tool_based"

    Each question should include the question text, options (if applicable), correct answer, and explanation (if applicable).
    """
    selected_questions = {}

    try:
        # Group questions for skill_check
        skill_check_grouped = group_questions(data.get("skill_check", []), lines_per_question=7)
        selected_questions["skill_check"] = [
            {
                "question": question[0],  # First line is the question
                "options": question[1:5],  # Next 4 lines are options
                "correct_answer": question[5].replace("Correct Answer: ", ""),  # Correct answer
                "explanation": question[6].replace("Explanation: ", "")  # Explanation
            }
            for question in random.sample(skill_check_grouped, min(4, len(skill_check_grouped)))
        ]

        # Group questions for knowledge_based
        knowledge_based_grouped = group_questions(data.get("knowledge_based", []), lines_per_question=6)
        selected_questions["knowledge_based"] = [
            {
                "question": question[0],  # First line is the question
                "options": question[1:5],  # Next 4 lines are options
                "correct_answer": question[5].replace("Correct Answer: ", ""),  # Correct answer
                # "explanation": None  # No explanation in knowledge_based questions
            }
            for question in random.sample(knowledge_based_grouped, min(3, len(knowledge_based_grouped)))
        ]

        # Group questions for problem_solving
        problem_solving_grouped = group_questions(data.get("problem_solving", []), lines_per_question=None)
        selected_questions["problem_solving"] = [
            {
                "question": question[0],  # First line is the question
                "solution": "\n".join(question[1:])  # Rest of the lines are the solution
            }
            for question in random.sample(problem_solving_grouped, min(2, len(problem_solving_grouped)))
        ]

        # Group questions for tool_based
        tool_based_grouped = group_questions(data.get("tool_based", []), lines_per_question=None)
        selected_questions["tool_based"] = [
            {
                "question": question[0],  # First line is the question
                "solution": "\n".join(question[1:])  # Rest of the lines are the solution
            }
            for question in random.sample(tool_based_grouped, min(1, len(tool_based_grouped)))
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error selecting questions: {e}",
        )

    return selected_questions


def group_questions(questions: List[str], lines_per_question: int = None) -> List[List[str]]:
    """
    Group the flat list of questions into a list of lists, where each inner list represents a single question.
    If `lines_per_question` is provided, each question is assumed to have a fixed number of lines.
    If `lines_per_question` is None, group lines until a new question number is encountered.
    """
    grouped_questions = []
    current_question = []

    for line in questions:
        if line.strip().startswith(("1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.")):
            if current_question:
                grouped_questions.append(current_question)
                current_question = []
        current_question.append(line)

    if current_question:
        grouped_questions.append(current_question)

    return grouped_questions