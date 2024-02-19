from django.urls import re_path, path
from .views import (
  upload_file,
  list_files,
) 

urlpatterns = [
  re_path(r"^upload-file", upload_file),
  re_path(r"^list-files", list_files),
]
