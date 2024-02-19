from django.urls import re_path, path
from .views import (
  upload_file,
  list_files,
  delete_file,
  download_file,
) 

urlpatterns = [
  re_path(r"^upload-file", upload_file),
  re_path(r"^list-files", list_files),
  re_path(r"^delete-file/(?P<filename>[\w.]+)", delete_file),
  re_path(r"^download-file/(?P<filename>[\w.]+)", download_file),
]
