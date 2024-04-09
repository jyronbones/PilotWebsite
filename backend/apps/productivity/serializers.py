from rest_framework import serializers
from .models import Productivity, ProductivitySupport


class ProductivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Productivity
        fields = "__all__"

class ProductivitySuppSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductivitySupport
        fields = "__all__"