from __future__ import print_function
import httplib2
import os
import io
import re
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
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
nltk_stopwords = list(stopwords.words('english'))  # Convert to list

def get_credentials():
    """Gets valid user credentials from storage."""
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
    resume_words = resume_text.lower().split()
    matched_keywords = [keyword for keyword in keywords if keyword.lower() in resume_words]
    max_score = 10
    score = (len(matched_keywords) / len(keywords)) * max_score
    return round(score, 2), matched_keywords

def process_file(file_path, service):
    """Uploads a file to Google Drive, converts it, and downloads the text."""
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

        downloader = MediaIoBaseDownload(
            io.FileIO(txtfile, 'wb'),
            service.files().export_media(fileId=res['id'], mimeType="text/plain")
        )

        done = False
        while not done:
            status, done = downloader.next_chunk()

        with open(txtfile, 'r', encoding='utf-8') as file:
            file_text = file.read()

        # Clean up: delete the file from Google Drive after processing
        service.files().delete(fileId=res['id']).execute()

        return file_text

    except Exception as e:
        print(f"An error occurred while processing {base_name}: {e}")
        return None

def clean_text(text):
    """Cleans the input text by removing non-alphabetic characters and extra spaces."""
    text = re.sub(r'[^A-Za-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.lower()

def extract_keywords_from_text(text, top_n=20):
    """Extract top N keywords from text using TF-IDF and n-gram analysis."""
    text_cleaned = clean_text(text)
    
    # Use TfidfVectorizer with n-grams (bigrams and trigrams) and custom stopwords
    vectorizer = TfidfVectorizer(stop_words=nltk_stopwords, ngram_range=(1, 3), max_features=100)
    X = vectorizer.fit_transform([text_cleaned])
    
    # Get feature names (words/phrases) sorted by TF-IDF score
    indices = X[0].toarray().argsort()[0, -top_n:][::-1]
    keywords = [vectorizer.get_feature_names_out()[index] for index in indices]
    
    return keywords

def main():
    # Get credentials and initialize Google Drive API service
    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('drive', 'v3', http=http)

    # Job description files (JDs)
    jd_files = [
        'JD DM Audit.pdf',
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
        jd_text = process_file(os.path.join('jds', jd_file), service)
        if jd_text is None:
            continue

        # Dynamically extract keywords from JD text
        extracted_keywords = extract_keywords_from_text(jd_text)
        print(f"Extracted Keywords from JD '{jd_file}': {extracted_keywords}")

        # Process each resume against the extracted JD keywords
        for resume_file in resume_files:
            resume_text = process_file(os.path.join('uploads', resume_file), service)
            if resume_text is None:
                continue

            score, matched_keywords = rank_resume(resume_text, extracted_keywords)
            base_name = os.path.splitext(resume_file)[0]
            scores.append((score, base_name, matched_keywords, jd_file))

    # Sort and display the scores
    scores.sort(reverse=True, key=lambda x: x[0])

    for rank, (score, base_name, matched_keywords, jd_file) in enumerate(scores, start=1):
        print(f"Rank {rank} for JD '{jd_file}': {base_name} - Score: {score}/10")
        print(f"Matched Keywords: {matched_keywords}\n")

if __name__ == '__main__':
    main()
