from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import T5ForConditionalGeneration, T5Tokenizer, pipeline
# Use a pipeline as a high-level helper
from transformers import pipeline
import spacy
import re
import shutil
import os

origins = [
    "http://localhost",  # Allow localhost requests
    "http://localhost:3000",  # Adjust if you're running your frontend on a different port
    "http://localhost:5173",  # Adjust if you're running your frontend on a different port

]

# Create an instance of FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins that are allowed to make requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a Pydantic model to parse the incoming JSON
class TextData(BaseModel):
    text: str

@app.post("/submit")
async def receive_data(data: TextData):
    # Access the 'text' from the request body
    received_text = data.text

    # do the operations
    corrected_text = tokenisation(preprocessing(autocorrect(received_text)))
    emotions = emotionDetection(corrected_text)
    print(emotions)
    return {"result": emotions}

@app.post("/recording")
async def upload_audio(file: UploadFile = File(...)):
    file_path = f"temp_audio/{file.filename}"
    os.makedirs("temp_audio", exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process audio file (e.g., transcribe, analyze)
    STT = pipeline("automatic-speech-recognition", model="openai/whisper-medium")
    text = STT(file_path)

    result = {"text": text["text"]}
    return result

def autocorrect(text):
    # Load the best available plug-and-play model
    model_name = "prithivida/grammar_error_correcter_v1"
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    model = T5ForConditionalGeneration.from_pretrained(model_name)

    # Prepare input
    input_text = f"fix:\n{text}"
    input_ids = tokenizer(input_text, return_tensors="pt").input_ids

    # Generate corrections
    outputs = model.generate(input_ids, max_length=250)
    corrected_sentence = tokenizer.decode(outputs[0], skip_special_tokens=True)
    if prefix(corrected_sentence, "fix:") or prefix(corrected_sentence, "Fix:"):
        corrected_sentence = corrected_sentence[5:]
    print(corrected_sentence)
    return corrected_sentence

def prefix(text, prefix):
    if len(text) <= len(prefix):
        return False
    return text[:len(prefix)] == prefix


def emotionDetection(text):
    classifier = pipeline("text-classification", model="bhadresh-savani/bert-base-go-emotion")
    # Input text
    output = []
    # Predict emotions
    for element in text:
        result = classifier(element)
        output.append((element, result))
    return output

def preprocessing(text):
    clean_text = re.sub(r",\s*(but|however)\b", r" \1", text)
    clean_text = re.sub(r"[^a-zA-Z0-9\s\.,!?;:(){}[\]'_-]", "", clean_text)
    print(clean_text)
    return clean_text

def tokenisation(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)

    splits = {'and', 'or'}

    punctuation = {',', '.', '. . .', '...', ':', ';', '!', '?', '(', ')'}
    clauses = []
    current_clause = []

    last_was_punctuation = False

    for token in doc:
        if token.text.lower() in splits:
            if current_clause:
                clauses.append(" ".join(current_clause).strip())
                current_clause = []
            clauses.append(token.text)
            last_was_punctuation = False

        elif token.text in punctuation:
            if current_clause:
                current_clause[-1] += token.text
            else:
                current_clause.append(token.text)
            last_was_punctuation = True

        else:
            if last_was_punctuation and current_clause:
                clauses.append(" ".join(current_clause).strip())
                current_clause = []
            current_clause.append(token.text)
            last_was_punctuation = False

    if current_clause:
        clauses.append(" ".join(current_clause).strip())
    print(clauses)
    return clauses

# testing, helllo?
# testing, helllo?
# ['testing,', 'helllo?']
# [('testing,', [{'label': 'neutral', 'score': 0.9164173007011414}]), ('helllo?', [{'label': 'anger', 'score': 0.3596790134906769}])]

# how's it going? Nice to meet you man.
# hows it going? nice to meet you man.
# ['how s it going?', 'nice to meet you man.']
# [('how s it going?', [{'label': 'curiosity', 'score': 0.5572469234466553}]), ('nice to meet you man.', [{'label': 'admiration', 'score': 0.8493902087211609}])]