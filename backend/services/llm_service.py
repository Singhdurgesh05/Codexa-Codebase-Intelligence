from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def ask_llm(prompt: str):

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    return completion.choices[0].message.content


def llm(prompt: str):
    """
    Backwards-compatible wrapper used by agents.
    """
    return ask_llm(prompt)