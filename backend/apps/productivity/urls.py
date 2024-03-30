from django.urls import re_path, path
from .views import (
    crud_prod,
    get_summary
)

urlpatterns = [
    re_path(r"^productivity", crud_prod),
    re_path(r"^summary", get_summary),
]
