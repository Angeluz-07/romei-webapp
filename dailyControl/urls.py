from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
		path('apuntar', views.apuntar, name='apuntar'),
		path('cuadrar', views.cuadrar, name='cuadrar'),
		path('nueva_mercaderia', views.nueva_mercaderia, name='nueva_mercaderia'),
]
