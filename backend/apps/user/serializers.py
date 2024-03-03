from rest_framework import serializers
from apps.user.models import UserNew


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNew
        fields = "__all__"
