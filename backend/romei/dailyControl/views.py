from django.shortcuts import render,redirect
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import *
from .serializers import *
from django.db import IntegrityError    # Import IntegrityError
from django.db.models import Q
from rest_framework.exceptions import APIException  #Import APIException


def date_from_str(date:str, date_format:str="%Y-%m-%d"):
    from datetime import datetime
    return datetime.strptime(date, date_format)

# Create your views here.
def index(request):  
    context={}  
    return render(request, 'dailyControl/index.html',context)

import json
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse


@ensure_csrf_cookie
def set_csrf_token(request):
    return JsonResponse({"details": "CSRF cookie set"})


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    if username is None or password is None:
        return JsonResponse({'error': 'Please provide username and password.'}, status=400)
    
    if request.user.is_authenticated:
        return JsonResponse({'error': 'You\'re already logged in.'}, status=400)

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    login(request, user)
    return JsonResponse({"detail": "Success"})

def who_am_i(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
    return JsonResponse({'username': request.user.username})

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

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

class PaymentsRegisterViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = PaymentsRegister.objects.all()
    serializer_class = PaymentsRegisterSerializer

    def list(self, request):
        queryset = PaymentsRegister.objects.all()
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        if register_date and store_id:
            queryset = PaymentsRegister.objects.filter(register_date=register_date,store__id=store_id)

        register_date_gte = self.request.query_params.get('register_date.gte', None)
        register_date_lte = self.request.query_params.get('register_date.lte', None)
        name_contains =  self.request.query_params.get('name.contains', None)
        description_contains =  self.request.query_params.get('description.contains', None)
        if register_date_gte \
            and register_date_lte \
            and name_contains is not None \
            and description_contains is not None:
            start_date, end_date = date_from_str(register_date_gte), date_from_str(register_date_lte)
            queryset = PaymentsRegister.objects \
            .filter(
                Q(name__icontains=name_contains) | Q(description__icontains=description_contains),
                register_date__range=(start_date,end_date),
            )

        serializer = PaymentsRegisterSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def total(self, request):
        register_date = self.request.query_params.get('register_date', None)
        store_id = self.request.query_params.get('store_id', None)
        if register_date and store_id:
            payments = PaymentsRegister.objects.filter(register_date=register_date,store__id=store_id)
            total = sum([payment.value for payment in payments])
            return Response({'value':total})

        register_date_gte = self.request.query_params.get('register_date.gte', None)
        register_date_lte = self.request.query_params.get('register_date.lte', None)
        name_contains =  self.request.query_params.get('name.contains', None)
        description_contains =  self.request.query_params.get('description.contains', None)
        if register_date_gte \
            and register_date_lte \
            and name_contains is not None \
            and description_contains is not None:
            start_date, end_date = date_from_str(register_date_gte), date_from_str(register_date_lte)
            payments = PaymentsRegister.objects \
            .filter(
                Q(name__icontains=name_contains) | Q(description__icontains=description_contains),
                register_date__range=(start_date,end_date),
            )
            total = sum([payment.value for payment in payments])
            return Response({'value':total})

        return Response({'error':'query params missing'}, status=status.HTTP_400_BAD_REQUEST)

class SalesRegisterViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = SalesRegister.objects.all()
    serializer_class = SalesRegisterSerializer

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
            sales_registers = SalesRegister.objects.filter(register_date=register_date,product__store__id=store_id)
            total = sum([sales_register.cash_sale for sales_register in sales_registers])
            return Response({'value':total})
        else:
            return Response({'error':'register_date or store_id query params missing'}, status=status.HTTP_400_BAD_REQUEST)

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
