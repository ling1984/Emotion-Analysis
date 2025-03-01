import re

text = "Hello!! This is a #weird$ string... with *random* symbols,but 123!"

clean_text = re.sub(r",\s*(but|however)\b", r" \1", text)
clean_text = re.sub(r"[^a-zA-Z0-9\s\.,!?;:(){}[\]<>_-]", "", clean_text).lower()

print(clean_text)