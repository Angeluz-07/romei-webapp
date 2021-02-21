from rest_framework import serializers
from .models import *

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model=Store
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields = '__all__'

class PaymentsRegisterSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField()

    class Meta:
        model=PaymentsRegister
        fields = '__all__'

class SalesRegisterSerializer(serializers.ModelSerializer):
    cash_sale = serializers.ReadOnlyField()
    product_name = serializers.ReadOnlyField()

    class Meta:
        model=SalesRegister
        fields = '__all__'
