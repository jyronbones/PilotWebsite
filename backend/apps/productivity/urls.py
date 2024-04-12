from django.urls import re_path, path
from .views import (
    crud_prod,
    get_all_assignments,
    update_auth_corp,
    update_rate,
    get_assignment_summary,
    get_productivity_supp,
    crud_year,
)

urlpatterns = [
    re_path(r"^productivity", crud_prod),
    re_path(r"^assignment-summary", get_assignment_summary),
    re_path(r"^get-allassignments", get_all_assignments),
    re_path(r"^auth-corp", update_auth_corp),
    re_path(r"^rate", update_rate),
    re_path(r"^prodsupport", get_productivity_supp),
    re_path(r"^years", crud_year),
]
