from django.urls import re_path, path
from .views import (
    initial_availability,
    crud_availability,
)

urlpatterns = [
    re_path(r"^initial_availability", initial_availability),
    re_path(r"^availability", crud_availability),
]
