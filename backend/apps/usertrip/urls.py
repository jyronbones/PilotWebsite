from django.urls import re_path, path
from .views import (
    crud_usertrip,
    get_usertrips,
    get_total
)

urlpatterns = [
    re_path(r"^usertrip", crud_usertrip),
    re_path(r"^get-usertrips", get_usertrips),
    re_path(r"^get-total", get_total),
    re_path(r"^user", admin_user_crud),
    # re_path(r"^create_admin", create_admin_account),
    re_path(r"^test_aws", test_aws),
]
