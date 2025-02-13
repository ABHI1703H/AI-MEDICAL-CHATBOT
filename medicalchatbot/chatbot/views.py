import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from dotenv import load_dotenv
from twilio.rest import Client
from django.http import JsonResponse

# ✅ Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
DOCTOR_PHONE_NUMBER = os.getenv("DOCTOR_PHONE_NUMBER")

# ✅ Fetch real-time medicine details
def get_medicine(request):
    query = request.GET.get("name", "").strip().lower()
    if not query:
        return JsonResponse({"error": "Please provide a medicine name"}, status=400)

    try:
        url = f"https://api.fda.gov/drug/label.json?search=active_ingredient:{query}&limit=5"
        response = requests.get(url)
        data = response.json()

        if "results" not in data:
            return JsonResponse({"error": "No medicine found"}, status=404)

        medicines = [
            {
                "name": med.get("openfda", {}).get("brand_name", ["Unknown"])[0],
                "active_ingredient": med.get("active_ingredient", ["Not available"])[0],
                "purpose": med.get("purpose", ["Not specified"])[0],
                "warnings": med.get("warnings", ["No warnings available"])[0],
                "dosage": med.get("dosage_and_administration", ["Dosage info not available"])[0],
                "buy_link": f"https://www.1mg.com/search/all?name={query.replace(' ', '+')}"
            }
            for med in data["results"]
        ]

        return JsonResponse({"medicines": medicines})

    except requests.RequestException as e:
        return JsonResponse({"error": f"Failed to fetch medicine data: {str(e)}"}, status=500)

# ✅ AI Chatbot with OpenAI GPT
@csrf_exempt
def chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get("query", "").strip()
            user_name = data.get("user_name", "User")

            if not query:
                return JsonResponse({"error": "Query cannot be empty"}, status=400)

            headers = {
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            }

            system_prompt = (
                "You are an advanced AI medical assistant. Your response should be professional, structured, and "
                "medically accurate. Provide:\n"
                "1️⃣ **Diagnosis-Based Response** - Explain the medical condition.\n"
                "2️⃣ **Prescribed Medicines with Dosage** - Suggest real medicines with doses.\n"
                "3️⃣ **Home Remedies** - Provide effective natural treatments.\n"
                "4️⃣ **Warnings & Emergency Advice** - If symptoms are severe, recommend immediate medical attention.\n"
                "Format responses using **headings, bullet points, and bold text**."
            )

            payload = {
                "model": "gpt-4",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                "max_tokens": 500
            }

            openai_response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
            )

            response_data = openai_response.json()
            response_text = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")

            if not response_text:
                response_text = "I'm sorry, but I couldn't generate a response. Please try again."

            return JsonResponse({"response": response_text})

        except Exception as e:
            return JsonResponse({"error": f"Chatbot error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

# ✅ Twilio Doctor Call API
@csrf_exempt
def book_appointment(request):
    if request.method == "POST":
        try:
            print("🔍 Received POST request!")  # ✅ Debugging
            data = json.loads(request.body)
            print("📩 Data Received:", data)  # ✅ Debugging

            name = data.get("name")
            phone = data.get("phone")
            email = data.get("email")
            date = data.get("date")
            time = data.get("time")
            symptoms = data.get("symptoms")

            if not all([name, phone, email, date, time, symptoms]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            return JsonResponse({"message": f"✅ Appointment booked for {name} on {date} at {time}."})

        except json.JSONDecodeError as e:
            print("❌ JSON Decode Error:", str(e))  # ✅ Debugging
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    print("❌ Invalid request method!")  # ✅ Debugging
    return JsonResponse({"error": "Invalid request method"}, status=405)
def call_doctor(request):
    doctor_contact = "+919876543210"  # ✅ Replace with actual doctor's number
    response_data = {
        "message": "You can connect with a doctor via:",
        "call_link": f"tel:{doctor_contact}",  # Click to Call
        "whatsapp_link": f"https://wa.me/{doctor_contact}",  # Click to Chat on WhatsApp
        "booking_link": "http://127.0.0.1:8000/api/book-appointment/"  # Appointment Booking API
    }
    return JsonResponse(response_data)
