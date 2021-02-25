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

class PaymentRegisterSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField()

    class Meta:
        model=PaymentRegister
        fields = '__all__'

class SaleRegisterSerializer(serializers.ModelSerializer):
    cash_sale = serializers.ReadOnlyField()
    product_name = serializers.ReadOnlyField()

    class Meta:
        model=SaleRegister
        fields = '__all__'
