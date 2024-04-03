from django.urls import re_path, path
from .views import (
    crud_availability,
    get_availability
)

urlpatterns = [
    re_path(r"^availability", crud_availability),
    re_path(r"^get-availability", get_availability),
]
