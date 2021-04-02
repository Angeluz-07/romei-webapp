from django.urls import include, path
from django.views.generic.base import RedirectView
from .views import *

urlpatterns = [
    path('payments-in-range', payments_in_range, name='payments_in_range'),
    path('losts-in-range', losts_in_range, name='losts_in_range'),
]
