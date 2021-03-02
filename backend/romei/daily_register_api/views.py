from django.shortcuts import render,redirect
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import *
from .serializers import *
from django.db import IntegrityError    # Import IntegrityError
from rest_framework.exceptions import APIException  #Import APIException
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


def date_from_str(date:str, date_format:str="%Y-%m-%d"):
    from datetime import datetime
    return datetime.strptime(date, date_format)

class StoreViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

class ProductViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class PaymentRegisterViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = PaymentRegister.objects.all()
    serializer_class = PaymentRegisterSerializer

    def list(self, request):
        queryset = PaymentRegister.objects.all()
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        if register_date and store_id:
            queryset = PaymentRegister.objects.filter(register_date=register_date,store__id=store_id)

        register_date_gte = self.request.query_params.get('register_date.gte', None)
        register_date_lte = self.request.query_params.get('register_date.lte', None)
        description_contains =  self.request.query_params.get('description.contains', None)
        if register_date_gte \
            and register_date_lte \
            and description_contains is not None:
            start_date, end_date = date_from_str(register_date_gte), date_from_str(register_date_lte)
            queryset = PaymentRegister.objects \
            .filter(
                description__icontains=description_contains,
                register_date__range=(start_date,end_date),
            )

        serializer = PaymentRegisterSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def total(self, request):
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        if register_date and store_id:
            payments = PaymentRegister.objects.filter(register_date=register_date,store__id=store_id)
            total = sum([payment.value for payment in payments])
            return Response({'value':total})

        register_date_gte = self.request.query_params.get('register_date.gte', None)
        register_date_lte = self.request.query_params.get('register_date.lte', None)
        description_contains =  self.request.query_params.get('description.contains', None)
        if register_date_gte \
            and register_date_lte \
            and description_contains is not None:
            start_date, end_date = date_from_str(register_date_gte), date_from_str(register_date_lte)
            payments = PaymentRegister.objects \
            .filter(
                description__icontains=description_contains,
                register_date__range=(start_date,end_date),
            )
            total = sum([payment.value for payment in payments])
            return Response({'value':total})

        return Response({'error':'query params missing'}, status=status.HTTP_400_BAD_REQUEST)

class SaleRegisterViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = SaleRegister.objects.all()
    serializer_class = SaleRegisterSerializer

    def create(self, request, *args, **kwargs):
        # If integrity error, throws error as reponse.
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as exc:
            raise APIException(detail=exc)

    @action(detail=False, methods=['GET'])
    def total(self, request):
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        if register_date and store_id:
            sales_registers = SaleRegister.objects.filter(register_date=register_date,product__store__id=store_id)
            total = sum([sales_register.cash_sale for sales_register in sales_registers])
            return Response({'value':total})
        else:
            return Response({'error':'register_date or store_id query params missing'}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        queryset = SaleRegister.objects.all()
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        start = self.request.query_params.get('start', None)
        if bool(start) and register_date and store_id:
            register_date = date_from_str(register_date)
            for product in Product.objects.filter(store__id=store_id):
                try:
                    sr = SaleRegister.objects.get(
                        product=product,
                        register_date=register_date,
                    )
                except ObjectDoesNotExist:
                    last_sr = SaleRegister \
                    .objects \
                    .filter(register_date__lt=register_date, product_id=product.id) \
                    .order_by('-register_date') \
                    .first()

                    product_stock = last_sr.final_stock if last_sr else 0

                    SaleRegister.objects.create(
                        product = product,
                        stock_addition = 0,
                        final_stock = product_stock,
                        product_price = product.price,
                        product_stock = product_stock,
                        register_date = register_date
                    )
                else:
                    last_sr = SaleRegister \
                    .objects \
                    .filter(register_date__lt=register_date, product_id=product.id) \
                    .order_by('-register_date') \
                    .first()

                    if last_sr and sr.product_stock != last_sr.final_stock:
                        sr.product_stock = last_sr.final_stock
                        sr.save()

            queryset = SaleRegister \
            .objects \
            .filter(register_date=register_date,product__store__id=store_id) \
            .order_by('product__id')

        serializer = SaleRegisterSerializer(queryset, many=True)
        return Response(serializer.data)
