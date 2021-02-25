from django.urls import include, path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'products', ProductViewSet)
router.register(r'sale-registers', SaleRegisterViewSet)
router.register(r'stores', StoreViewSet)
router.register(r'payment-registers', PaymentRegisterViewSet)

urlpatterns = [
	path('api/',include(router.urls)),
]
