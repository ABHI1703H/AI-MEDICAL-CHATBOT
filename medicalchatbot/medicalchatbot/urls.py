from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Default homepage route
def home_view(request):
    return JsonResponse({"message": "Welcome to AI Medical Chatbot API!"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("chatbot.urls")),  # ✅ Includes chatbot & medicine API
    path("", home_view),  # ✅ Fixes "Not Found: /" error
]
