from django.urls import re_path, path
from .views import (
    crud_usertrip,
    get_usertrips,
)

urlpatterns = [
    re_path(r"^usertrip", crud_usertrip),
    re_path(r"^get-usertrips", get_usertrips),
]
