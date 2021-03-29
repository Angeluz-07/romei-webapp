from django.urls import path
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    path('', daily_register, name='daily_register'),
]