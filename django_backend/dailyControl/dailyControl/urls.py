from django.urls import include, path
from django.contrib.auth import views as auth_views
from . import views
from rest_framework import routers
from .views import *

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'products', ProductViewSet)
router.register(r'sales-registers', SalesRegisterViewSet)
router.register(r'stores', StoreViewSet)
router.register(r'payments-registers', PaymentsRegisterViewSet)

urlpatterns = [
    path('', auth_views.LoginView.as_view(), name='login'),
	path('login',auth_views.LoginView.as_view(), name='login'),
	path('logout',auth_views.LogoutView.as_view(), name='logout'),
	path('cuadrar', views.cuadrar, name='cuadrar'),
	path('ver_cuadres', views.ver_cuadres, name='ver_cuadres'),
	path('apuntar', views.apuntar, name='apuntar'),
	path('api/',include(router.urls)),
]
