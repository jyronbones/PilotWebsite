from django.urls import re_path, path
from .views import (
    crud_availability,
    get_effective
)

urlpatterns = [
    re_path(r"^availability", crud_availability),
    re_path(r"^effective", get_effective),
]
