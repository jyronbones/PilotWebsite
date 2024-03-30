from rest_framework import serializers
from .models import Availability


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = "__all__"