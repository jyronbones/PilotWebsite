from django.urls import re_path, path
from .views import (
  upload_meeting,
  list_meetings,
  delete_meeting,
  download_meeting,
) 

urlpatterns = [
  re_path(r"^upload-meeting", upload_meeting),
  re_path(r"^list-meetings", list_meetings),
  re_path(r"^delete-meeting/(?P<filename>[\w.]+)", delete_meeting),
  re_path(r"^download-meeting/(?P<filename>[\w.]+)", download_meeting),
]
