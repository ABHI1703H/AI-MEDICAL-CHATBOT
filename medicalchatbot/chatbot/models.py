from django.db import models

class MedicalQuery(models.Model):
    user_name = models.CharField(max_length=255)
    query_text = models.TextField()
    response_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.query_text
