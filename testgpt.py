from openai import OpenAI
import os
from dotenv import load_dotenv

# So as long as you have a .env file with your OpenAI API key in it, you can simply load_dotenv() to load the api key to OpenAI().
load_dotenv()

client = OpenAI()

systemPrompt = "You are a highly intelligent assistant. The user will provide you with multiple-choice questions along with possible answers labeled A, B, C, D, etc. Your task is to analyze the question and the given options and return the letter (A-Z) corresponding with the correct answer."

userPrompt = """The best way to prevent SQL injection vulnerabilities is to use _____.

Question 3Select one:

a.
Microsoft SQL


b.
run-time detection of SQL Injection


c.
MySQL


d.
input validation that prevents mixing commands and data
"""

completion = client.chat.completions.create(
  model="gpt-4o",
  messages=[
    {"role": "system", "content": systemPrompt},
    {"role": "user", "content": userPrompt}
  ]
)


print(completion.choices[0].message)