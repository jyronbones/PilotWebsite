from django.urls import re_path, path
from apps.user.views import credential_login, auth_me, refresh_token, admin_user_crud

urlpatterns = [
    re_path(r'^login', credential_login),
    re_path(r'^refresh-token', refresh_token),
    re_path(r'^auth-me', auth_me),
    re_path(r'^user', admin_user_crud),
]
