from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='daily_register/vue_test.html'), name='vue_test'),
]