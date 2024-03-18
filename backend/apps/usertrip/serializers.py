from rest_framework import serializers
from .models import UserTrip


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTrip
        fields = "__all__"
