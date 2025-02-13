from twilio.rest import Client
import os

# Twilio Credentials
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
DOCTOR_PHONE_NUMBER = os.getenv("DOCTOR_PHONE_NUMBER")

def make_call(user_phone):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    call = client.calls.create(
        to=user_phone,
        from_=TWILIO_PHONE_NUMBER,
        url="http://demo.twilio.com/docs/voice.xml"
    )

    return {"message": "Calling the doctor now!", "call_sid": call.sid}
