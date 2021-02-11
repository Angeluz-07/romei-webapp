from django.shortcuts import render,redirect
from rest_framework import viewsets
from .models import *
from .serializers import *
from django.db import IntegrityError    # Import IntegrityError
from rest_framework.exceptions import APIException  #Import APIException

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

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class SalesRegisterViewSet(viewsets.ModelViewSet):
    queryset = SalesRegister.objects.all()
    serializer_class = SalesRegisterSerializer

    def create(self, request, *args, **kwargs):
        # If integrity error, throws error as reponse.
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as exc:
            raise APIException(detail=exc)
