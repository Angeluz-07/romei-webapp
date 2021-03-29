from django.urls import include, path
from django.views.generic.base import RedirectView
from .views import *

urlpatterns = [
	path('', RedirectView.as_view(url='daily-register')),
	path('daily-register', daily_register, name='daily_register'),
    path('management/payment-query', payment_query, name='payment_query'),
]
