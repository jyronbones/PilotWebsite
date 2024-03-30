from rest_framework import serializers
from .models import Productivity


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productivity
        fields = "__all__"