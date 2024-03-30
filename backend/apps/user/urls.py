from django.urls import re_path, path
from .views import (
    credential_login,
    auth_me,
    refresh_token,
    admin_user_crud,
    get_all_users,
    get_one_user,
    create_admin_account,
    test_aws,
    update_availability,
)

urlpatterns = [
    re_path(r"^login", credential_login),
    re_path(r"^refresh-token", refresh_token),
    re_path(r"^auth-me", auth_me),
    re_path(r"^users", get_all_users),
    re_path(r"^user", admin_user_crud),
    re_path(r"^one_user", get_one_user),
    re_path(r"^create_admin", create_admin_account),
    re_path(r"^test_aws", test_aws),
    re_path(r"^availability", update_availability),
]
