from django.urls import re_path, path
from .views import upload_file

urlpatterns = [
    re_path(r"^upload-file", upload_file),
]
