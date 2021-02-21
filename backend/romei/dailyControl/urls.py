from django.urls import include, path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'products', ProductViewSet)
router.register(r'sales-registers', SalesRegisterViewSet)
router.register(r'stores', StoreViewSet)
router.register(r'payments-registers', PaymentsRegisterViewSet)

urlpatterns = [
	path('api/',include(router.urls)),
]
