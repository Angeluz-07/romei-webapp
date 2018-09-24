from django.shortcuts import render,redirect


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


