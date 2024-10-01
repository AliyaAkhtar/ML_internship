### Project Structure

```bash
OCR/
├── jds/                            # Folder containing job descriptions (PDF format)
├── output/                         # Folder for storing OCR output (text files)
├── uploads/                        # Folder for uploaded resumes (PDF format)
├── .gitignore                      # Gitignore file to exclude unnecessary files from version control
├── client_secret.json              # Google Drive API credentials for authentication
├── drive-python-quickstart.py      # Script for handling Google Drive API setup and authentication
├── dulcet-antler-xxxxxxxx.json     # OAuth token or additional API-related configuration
├── main.py                         # Main script to run OCR process and extract text from PDFs using LLaMA
└── test1.py                        # Script to run OCR process and extract text from PDFs using NLP
