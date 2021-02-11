from rest_framework import serializers
from .models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields = '__all__'

class SalesRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=SalesRegister
        fields = '__all__'
