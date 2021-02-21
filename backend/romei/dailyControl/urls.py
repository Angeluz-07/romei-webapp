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
	path('daily-register', views.daily_register, name='daily_register'),
	path('api/',include(router.urls)),
	path('api/set-csrf', set_csrf_token, name='set_csrf'),
	path('api/login', login_view, name='L_ogin'),
	path('api/who-am-i', who_am_i, name="who_am_i"),
	path('api/logout', logout_view, name='L_ogout'),
]
