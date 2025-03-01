from transformers import pipeline

# Load Whisper speech-to-text pipeline
STT = pipeline("automatic-speech-recognition", model="openai/whisper-medium")

# Transcribe an audio file
result = STT("test.mp3")  

# Print the transcribed text
print(result["text"])
