from __future__ import print_function
import httplib2
import os
import io
import re
import nltk
from transformers import LlamaTokenizer, LlamaForCausalLM
import torch
from nltk.corpus import stopwords

from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage
from apiclient.http import MediaFileUpload, MediaIoBaseDownload

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

SCOPES = 'https://www.googleapis.com/auth/drive'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'OCR Project'

# Download NLTK stopwords
nltk.download('stopwords')
nltk_stopwords = set(stopwords.words('english'))  # Convert to set for better performance

# Load LLaMA model and tokenizer
print("Loading LLaMA model and tokenizer...")
model_name = 'meta-llama/Llama-2-7b-hf'  # You can change this to any LLaMA model variant
tokenizer = LlamaTokenizer.from_pretrained(model_name)
model = LlamaForCausalLM.from_pretrained(model_name)
print("LLaMA model and tokenizer loaded successfully!")

def get_credentials():
    """Gets valid user credentials from storage."""
    print("Getting Google Drive credentials...")
    credential_path = os.path.join("./", 'drive-python-quickstart.json')
    store = Storage(credential_path)
    credentials = store.get()
    if not credentials or credentials.invalid:
        flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
        flow.user_agent = APPLICATION_NAME
        if flags:
            credentials = tools.run_flow(flow, store, flags)
        else:
            credentials = tools.run(flow, store)
        print('Storing credentials to ' + credential_path)
    return credentials

def rank_resume(resume_text, keywords):
    """Ranks the resume based on keyword matches."""
    print("Ranking resume based on keywords...")
    resume_words = resume_text.lower().split()
    matched_keywords = [keyword for keyword in keywords if keyword.lower() in resume_words]
    max_score = 10
    score = (len(matched_keywords) / len(keywords)) * max_score
    print(f"Resume matched {len(matched_keywords)} keywords.")
    return round(score, 2), matched_keywords

def process_file(file_path, service):
    """Uploads a file to Google Drive, converts it, and downloads the text."""
    print(f"Processing file: {file_path}")
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    txtfile = os.path.join('output', base_name + '.txt')

    try:
        mime = 'application/pdf'
        res = service.files().create(
            body={
                'name': base_name,
                'mimeType': 'application/vnd.google-apps.document'
            },
            media_body=MediaFileUpload(file_path, mimetype=mime, resumable=True)
        ).execute()

        print(f"File uploaded to Google Drive: {base_name}")

        downloader = MediaIoBaseDownload(
            io.FileIO(txtfile, 'wb'),
            service.files().export_media(fileId=res['id'], mimeType="text/plain")
        )

        done = False
        while not done:
            status, done = downloader.next_chunk()

        print(f"Text file downloaded: {txtfile}")

        with open(txtfile, 'r', encoding='utf-8') as file:
            file_text = file.read()

        # Clean up: delete the file from Google Drive after processing
        service.files().delete(fileId=res['id']).execute()
        print(f"File deleted from Google Drive: {base_name}")

        return file_text

    except Exception as e:
        print(f"An error occurred while processing {base_name}: {e}")
        return None

def extract_keywords_llama(jd_text):
    """Extracts relevant job-related keywords from the job description using LLaMA."""
    print("Extracting keywords from JD using LLaMA...")
    prompt = (
        "Please extract the most relevant skills, tools, and qualifications from the following job description. "
        "Focus on specific skills and tools needed for the job, and avoid lengthy descriptions.\n\n"
        f"{jd_text}"
    )
    
    # Encode the prompt
    inputs = tokenizer(prompt, return_tensors="pt")
    
    # Generate keywords using LLaMA
    outputs = model.generate(inputs['input_ids'], max_new_tokens=150)  # Limit to 150 tokens
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract keywords as a list (split by commas, based on model output)
    keywords = [kw.strip() for kw in response.split(",") if kw.strip()]
    
    print(f"Keywords extracted: {keywords}")
    return keywords


def main():
    print("Starting the process...")
    # Get credentials and initialize Google Drive API service
    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('drive', 'v3', http=http)

    # Job description files (JDs)
    jd_files = [
        'JD- RSM.pdf'
    ]

    # Resume files
    resume_files = [
        'Aliya Akhtar Resume (1).pdf',
        'Aminah_Akhtar.pdf',
        'resume.pdf'
    ]

    scores = []

    for jd_file in jd_files:
        # Extract keywords from the JD using OCR
        print(f"Extracting keywords from JD file: {jd_file}")
        jd_text = process_file(os.path.join('jds', jd_file), service)
        if jd_text is None:
            print(f"Failed to process JD file: {jd_file}")
            continue

        # Dynamically extract keywords from JD text using LLaMA
        extracted_keywords = extract_keywords_llama(jd_text)

        # Process each resume against the extracted JD keywords
        for resume_file in resume_files:
            print(f"Processing resume file: {resume_file}")
            resume_text = process_file(os.path.join('uploads', resume_file), service)
            if resume_text is None:
                print(f"Failed to process resume file: {resume_file}")
                continue

            score, matched_keywords = rank_resume(resume_text, extracted_keywords)
            base_name = os.path.splitext(resume_file)[0]
            scores.append((score, base_name, matched_keywords, jd_file))

    # Sort and display the scores
    print("Ranking resumes based on the extracted keywords...")
    scores.sort(reverse=True, key=lambda x: x[0])

    for rank, (score, base_name, matched_keywords, jd_file) in enumerate(scores, start=1):
        print(f"Rank {rank} for JD '{jd_file}': {base_name} - Score: {score}/10")
        print(f"Matched Keywords: {matched_keywords}\n")

    print("Process completed!")

if __name__ == '__main__':
    main()
