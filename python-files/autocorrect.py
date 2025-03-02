# from transformers import T5ForConditionalGeneration, T5Tokenizer

# # Load the best available plug-and-play model
# model_name = "prithivida/grammar_error_correcter_v1"
# tokenizer = T5Tokenizer.from_pretrained(model_name)
# model = T5ForConditionalGeneration.from_pretrained(model_name)

# # Input sentence with grammar mistakes
# sentence = "i hat cookies"

# # Prepare input
# input_text = f"fix: {sentence}"
# input_ids = tokenizer(input_text, return_tensors="pt").input_ids

# # Generate corrections
# outputs = model.generate(input_ids, max_length=50)
# corrected_sentence = tokenizer.decode(outputs[0], skip_special_tokens=True)

# print(f"Original: {sentence}")
# print(f"Corrected: {corrected_sentence}")

