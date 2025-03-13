# Llama Chatbot

A modern chatbot interface for the fine-tuned Llama 3 model, featuring a beautiful UI with dark mode support.

## Project Structure

```
.
├── backend/
│   ├── app.py          # Flask backend serving the Llama model
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   └── Header.jsx
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
└── Fine_Tuning_Script.py
```

## Features

- 🎨 Modern, responsive UI with Material Design
- 🌙 Dark/Light mode support
- ⚡ Real-time chat interactions
- 📝 Markdown support for bot responses
- 🔄 Smooth animations and transitions
- 🎯 Loading states and error handling

## Setup & Running

### Backend

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Environment Variables

Make sure to set up your Hugging Face API token in the backend:

```python
access_token = "your_huggingface_token"
```

## Contributing

Feel free to submit issues and enhancement requests! 