from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from . import views

urlpatterns = [
    path('', LoginView.as_view(), name='login'),
		path('login',LoginView.as_view(), name='login'),
		path('logout',LogoutView.as_view(), name='logout'),
		path('cuadrar', views.cuadrar, name='cuadrar'),
		path('ver_cuadres', views.ver_cuadres, name='ver_cuadres'),	
		path('apuntar', views.apuntar, name='apuntar'),
]
