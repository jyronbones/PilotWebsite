from django.urls import re_path, path
from .views import (
    crud_prod,
    get_all_assignments,
    update_auth_corp,
    get_summary
)

urlpatterns = [
    re_path(r"^productivity", crud_prod),
    re_path(r"^assignments", get_all_assignments),
    re_path(r"^auth-corp", update_auth_corp),
    re_path(r"^summary", get_summary),
]
