from django.shortcuts import render,redirect

from .models import Product
from .forms import ProductForm

#may delete this
from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request):  
    context={}  
    return render(request, 'dailyControl/index.html',context)

def cuadrar(request):
		product_list=Product.objects.all()
		context={
			'product_list':product_list,
		}
		return render(request, 'dailyControl/cuadrar.html',context)

def apuntar(request):  
    context={}  
    return render(request, 'dailyControl/apuntar.html',context)

def nueva_mercaderia(request):
		if request.method=='POST':
			form=ProductForm(request.POST)
			if form.is_valid():
				form.save()
				return redirect('nueva_mercaderia')			
		else:
			form=ProductForm()
		product_list=Product.objects.all()
		context={
			'form':form,
			'product_list':product_list
		}
		return render(request, 'dailyControl/nueva_mercaderia.html',context)
