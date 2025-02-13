import requests

url = "http://127.0.0.1:8000/api/book-appointment/"
data = {
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "date": "2025-02-15",
    "time": "10:00",
    "symptoms": "Fever and cough"
}

response = requests.post(url, json=data)
print(response.text)  # ✅ Print raw response to debug
