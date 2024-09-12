from __future__ import print_function
import httplib2
import os
import io

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
        else:  # Needed only for compatibility with Python 2.6
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

def process_resume(file_path, service, keywords):
    """Processes a single resume, uploads it, converts it, downloads the text, and ranks it."""
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    txtfile = os.path.join('output', base_name + '.txt')

    try:
        # Upload the file to Google Drive with the correct MIME type
        mime = 'application/pdf'
        res = service.files().create(
            body={
                'name': base_name,
                'mimeType': 'application/vnd.google-apps.document'  # Convert to Google Docs format
            },
            media_body=MediaFileUpload(file_path, mimetype=mime, resumable=True)
        ).execute()

        # Download the converted text file
        downloader = MediaIoBaseDownload(
            io.FileIO(txtfile, 'wb'),
            service.files().export_media(fileId=res['id'], mimeType="text/plain")
        )
        done = False
        while not done:
            status, done = downloader.next_chunk()

        with open(txtfile, 'r', encoding='utf-8') as file:
            resume_text = file.read()

        score, matched_keywords = rank_resume(resume_text, keywords)

        # Clean up: delete the file from Google Drive after processing
        service.files().delete(fileId=res['id']).execute()

        return score, matched_keywords, base_name

    except Exception as e:
        print(f"An error occurred while processing {base_name}: {e}")
        return None, None, base_name


def main():
    # Dictionary to store keyword lists for different job roles
    keyword_dict = {
    'full_stack_developer': [
        "HTML", "CSS", "JavaScript", "ReactJs", "Angular", "Vue.js",
        "Node.js", "Express", "MongoDB", "SQL", "MySQL", "PostgreSQL",
        "RESTful APIs", "GraphQL", "Docker", "Kubernetes", "Git",
        "AWS", "Azure", "DevOps", "Python", "Java", "Ruby", "PHP",
        "Agile", "Scrum", "Jenkins", "CI/CD", "Linux", "TypeScript",
        "WebSockets", "Authentication", "Authorization", "Bootstrap",
        "C++", "C#", "PHP", "Jquery", "WordPress", "Flask", "FastAPI",
        "Microservice Architecture", "SSL certificates", "Vercel", "Digital Ocean"
    ],
    'machine_learning': [
        "Machine Learning", "Artificial Intelligence", "Deep Learning", 
        "Neural Networks", "Supervised Learning", "Unsupervised Learning", 
        "Reinforcement Learning", "Natural Language Processing", "Computer Vision", 
        "Data Science", "Data Mining", "Predictive Modeling", 
        "Python", "R", "TensorFlow", "PyTorch", "Keras", 
        "Scikit-learn", "Pandas", "NumPy", "Matplotlib", 
        "Seaborn", "SQL", "Big Data", "Hadoop", "Spark", 
        "Data Analysis", "Feature Engineering", "Model Deployment", 
        "AWS", "Azure", "Google Cloud", "MLOps", 
        "Cross-validation", "Hyperparameter Tuning", "Gradient Descent", 
        "Support Vector Machines", "Random Forest", "XGBoost", 
        "Dimensionality Reduction", "NLP", "Large Language Models", "Deep Generative Models", 
        "Gaussian Processes", "Time Series Forecasting", "Kernel Methods", 
        "Representation Learning", "Graph Learning", "Sparsity Regularization", 
        "MXNet", "CUDA", "SageMaker", "Cloud Computing", 
        "Accelerated Computing", "Unit/Integration Testing", 
        "Cross-functional Team Collaboration", "Mentoring", 
        "Technical Writing", "Research Proposal Writing"
    ]
}

    # Select the appropriate list of keywords
    job_role = 'full_stack_developer'  
    keywords = keyword_dict[job_role]

    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('drive', 'v3', http=http)

    resume_files = [
            'Aliya Akhtar Resume (1).pdf',  
            'Aminah_Akhtar.pdf',
            'resume.pdf'
        ]

    scores = []

    for resume_file in resume_files:
        file_path = os.path.join('uploads', resume_file)
        score, matched_keywords, base_name = process_resume(file_path, service, keywords)
        scores.append((score, base_name, matched_keywords))

    scores.sort(reverse=True, key=lambda x: x[0])

    for rank, (score, base_name, matched_keywords) in enumerate(scores, start=1):
        print(f"Rank {rank}: {base_name} - Score: {score}/10")
        print(f"Matched Keywords: {matched_keywords}\n")

if __name__ == '__main__':
    main()
