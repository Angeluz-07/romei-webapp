from django.urls import include, path
from django.contrib.auth import views as auth_views
from .views import *

urlpatterns = [
    path('payment-query', payment_query, name='payment_query'),
	#path('login',auth_views.LoginView.as_view(), name='login'),
	#path('logout',auth_views.LogoutView.as_view(), name='logout'),
]
