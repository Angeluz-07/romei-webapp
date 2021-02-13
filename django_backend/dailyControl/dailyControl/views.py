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


def date_from_str(date:str, date_format:str="%Y-%m-%d"):
    from datetime import datetime
    return datetime.strptime(date, date_format)

# Create your views here.
def index(request):  
    context={}  
    return render(request, 'dailyControl/index.html',context)


def cuadrar(request):
		context={}
		return render(request, 'dailyControl/cuadrar.html',context)

def ver_cuadres(request):
		context={}
		return render(request, 'dailyControl/ver_cuadres.html',context)

def apuntar(request):  
    context={}  
    return render(request, 'dailyControl/apuntar.html',context)

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class PaymentsRegisterViewSet(viewsets.ModelViewSet):
    queryset = PaymentsRegister.objects.all()
    serializer_class = PaymentsRegisterSerializer

    def list(self, request):
        queryset = PaymentsRegister.objects.all()
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        if register_date and store_id:
            queryset = PaymentsRegister.objects.filter(register_date=register_date,store__id=store_id)
        serializer = PaymentsRegisterSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def total(self, request):
        # Not used by now
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        if register_date and store_id:
            payments = PaymentsRegister.objects.filter(register_date=register_date,store__id=store_id)
            total = sum([payment.value for payment in payments])
            return Response({'value':total})
        else:
            return Response({'error':'register_date or store_id query params missing'}, status=status.HTTP_400_BAD_REQUEST)

class SalesRegisterViewSet(viewsets.ModelViewSet):
    queryset = SalesRegister.objects.all()
    serializer_class = SalesRegisterSerializer

    def create(self, request, *args, **kwargs):
        # If integrity error, throws error as reponse.
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as exc:
            raise APIException(detail=exc)

    def list(self, request):
        queryset = SalesRegister.objects.all()
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        start = self.request.query_params.get('start', None)
        if bool(start) and register_date and store_id:
            register_date = date_from_str(register_date)
            for product in Product.objects.filter(store__id=store_id):
                try:
                    SalesRegister.objects.get(
                        product=product,
                        register_date=register_date,
                    )
                except ObjectDoesNotExist:
                    last_sr = SalesRegister \
                    .objects \
                    .filter(register_date__lt=register_date, product_id=product.id) \
                    .first()

                    product_stock = last_sr.final_stock if last_sr else 0

                    SalesRegister.objects.create(
                        product = product,
                        stock_addition = 0,
                        final_stock = product_stock,
                        product_price = product.price,
                        product_stock = product_stock,
                        register_date = register_date
                    )

            queryset = SalesRegister.objects.filter(register_date=register_date,product__store__id=store_id)

        serializer = SalesRegisterSerializer(queryset, many=True)
        return Response(serializer.data)
