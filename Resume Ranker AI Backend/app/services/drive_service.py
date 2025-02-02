# # drive_api.py
# import os
# import io
# import httplib2
# from apiclient import discovery
# from fastapi import UploadFile, File
# from oauth2client import client, tools
# from oauth2client.file import Storage
# from apiclient.http import MediaFileUpload, MediaIoBaseDownload # type: ignore
# from oauth2client.client import flow_from_clientsecrets
# from oauth2client.tools import run_flow

# # Setup for Google Drive API
# try:
#     if __name__ == "__main__":
#         import argparse
#         flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
# except ImportError:
#     flags = None

# SCOPES = 'https://www.googleapis.com/auth/drive'
# CLIENT_SECRET_FILE = 'client_secret.json'
# APPLICATION_NAME = 'OCR Project'

# def get_credentials():
#     """Gets valid user credentials from storage."""
#     print("Getting Google Drive credentials...")
#     credential_path = os.path.join("./", 'drive-python-quickstart.json')
#     store = Storage(credential_path)
#     credentials = store.get()
#     if not credentials or credentials.invalid:
#         flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
#         flow.user_agent = APPLICATION_NAME
#         if flags:
#             credentials = tools.run_flow(flow, store, flags)
#         else:
#             credentials = tools.run(flow, store)
#         print('Storing credentials to ' + credential_path)
#     return credentials

# def process_file(file_path, service):
#     """Uploads a file to Google Drive, converts it, and downloads the text."""
#     print(f"Processing file: {file_path}")
#     base_name = os.path.splitext(os.path.basename(file_path))[0]
#     txtfile = os.path.join('output', base_name + '.txt')

#     try:
#         mime = 'application/pdf'
#         res = service.files().create(
#             body={
#                 'name': base_name,
#                 'mimeType': 'application/vnd.google-apps.document'
#             },
#             media_body=MediaFileUpload(file_path, mimetype=mime, resumable=True)
#         ).execute()

#         print(f"File uploaded to Google Drive: {base_name}")

#         downloader = MediaIoBaseDownload(
#             io.FileIO(txtfile, 'wb'),
#             service.files().export_media(fileId=res['id'], mimeType="text/plain")
#         )

#         done = False
#         while not done:
#             status, done = downloader.next_chunk()

#         print(f"Text file downloaded: {txtfile}")

#         with open(txtfile, 'r', encoding='utf-8') as file:
#             file_text = file.read()

#         service.files().delete(fileId=res['id']).execute()
#         print(f"File deleted from Google Drive: {base_name}")

#         return file_text

#     except Exception as e:
#         print(f"An error occurred while processing {base_name}: {e}")
#         return None





import os
import io
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/drive']
CLIENT_SECRET_FILE = 'client_secret.json'
TOKEN_FILE = 'token.json'
APPLICATION_NAME = 'OCR Project'


def get_credentials():
    """
    Get valid user credentials from storage or prompt login.
    """
    print("Fetching Google Drive credentials...")
    creds = None
    
    # Load existing tokens, if available
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # Refresh or re-authenticate if necessary
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for later use
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
            print("Saved new credentials to token.json")
    
    return creds


def process_file(file_path, service):
    """
    Upload a file to Google Drive, convert it, and download the extracted text.
    """
    print(f"Processing file: {file_path}")
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    txtfile = os.path.join('output', base_name + '.txt')
    os.makedirs('output', exist_ok=True)  # Create output directory if not exists

    try:
        # Upload the file as a Google Document
        mime = 'application/pdf'
        uploaded_file = service.files().create(
            body={
                'name': base_name,
                'mimeType': 'application/vnd.google-apps.document'
            },
            media_body=MediaFileUpload(file_path, mimetype=mime, resumable=True)
        ).execute()

        print(f"File uploaded to Google Drive: {base_name}")

        # Export the Google Document to plain text
        request = service.files().export_media(
            fileId=uploaded_file['id'], mimeType="text/plain"
        )
        downloader = MediaIoBaseDownload(io.FileIO(txtfile, 'wb'), request)
        
        done = False
        while not done:
            status, done = downloader.next_chunk()
            print(f"Download progress: {int(status.progress() * 100)}%")

        print(f"Text file downloaded: {txtfile}")

        # Read the downloaded text
        with open(txtfile, 'r', encoding='utf-8') as file:
            file_text = file.read()

        # Delete the file from Google Drive after processing
        service.files().delete(fileId=uploaded_file['id']).execute()
        print(f"Temporary file deleted from Google Drive: {base_name}")

        return file_text

    except Exception as e:
        print(f"An error occurred while processing {base_name}: {e}")
        return None

