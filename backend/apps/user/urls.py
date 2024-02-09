from django.urls import re_path, path
from .views import (
    credential_login,
    auth_me,
    refresh_token,
    admin_user_crud,
    create_admin_account,
)

urlpatterns = [
    re_path(r"^login", credential_login),
    re_path(r"^refresh-token", refresh_token),
    re_path(r"^auth-me", auth_me),
    re_path(r"^user", admin_user_crud),
    re_path(r"^create_admin", create_admin_account),
]
