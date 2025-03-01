# Use a pipeline as a high-level helper
from transformers import pipeline

classifier = pipeline("text-classification", model="bhadresh-savani/bert-base-go-emotion")


# Input text
text = "I missed my lecture!"

# Predict emotions
result = classifier(text)
print(result)