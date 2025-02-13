from django.urls import path
from .views import get_medicine, chat, call_doctor

urlpatterns = [
    path("medicine/", get_medicine, name="get_medicine"),
    path("chat/", chat, name="chat"),
    path("call-doctor/", call_doctor, name="call_doctor"),  # ✅ Add call doctor route
]
