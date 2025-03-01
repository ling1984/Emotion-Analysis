# import spacy
# from preprocessing import clean_text

# test = "I'm happy, but I'm also anxious. (help) lol; going... somewhere: yay!"
# nlp = spacy.load("en_core_web_sm")
# doc = nlp(clean_text)

# splits = {'and', 'or'}

# punctuation = {',', '.', '. . .', '...', ':', ';', '!', '?', '(', ')'}
# clauses = []
# current_clause = []

# for token in doc:
#     if token.text.lower() in splits:
#         if current_clause:
#             clauses.append(" ".join(current_clause).strip())
#             current_clause = []
#         clauses.append(token.text)
#     elif token.text in punctuation:
#         if current_clause:
#             current_clause[-1] += token.text
#         else:
#             current_clause.append(token.text)
#         clauses.append(" ".join(current_clause).strip())
#         current_clause = []
#     else:
#         current_clause.append(token.text)

# if current_clause:
#     clauses.append(" ".join(current_clause).strip())

# #print(clauses)