from fastapi import FastAPI
from pydantic import BaseModel

# Create an instance of FastAPI
app = FastAPI()

# Define a Pydantic model to parse the incoming JSON
class TextData(BaseModel):
    text: str

@app.post("/submit")
async def receive_data(data: TextData):
    # Access the 'text' from the request body
    received_text = data.text

    # do the operations

    return {"received_text": received_text}
