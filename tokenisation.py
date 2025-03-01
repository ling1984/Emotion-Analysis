import spacy

text = "I'm happy, but I'm also anxious."
nlp = spacy.load("en_core_web_sm")
doc = nlp(text)

# Split by coordinating conjunctions (e.g., 'and', 'but', 'or')
splits = {'and', ',', 'or'}
clauses = []
current_clause = []
for token in doc:
    current_clause.append(token.text)
    if token.text.lower() in splits:
        clauses.append(" ".join(current_clause).strip())
        current_clause = []

if current_clause:
    clauses.append(" ".join(current_clause).strip())

print(clauses) 