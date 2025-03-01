# Use a pipeline as a high-level helper
from transformers import pipeline
from tokenisation import clauses

classifier = pipeline("text-classification", model="bhadresh-savani/bert-base-go-emotion")


# Input text
text = "I missed my lecture!"
output = []
# Predict emotions
for element in clauses:
    result = classifier(element)
    output.append((element, result))
print(output)

