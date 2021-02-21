from django.urls import include, path
from . import views
from rest_framework import routers
from .views import *

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'products', ProductViewSet)
router.register(r'sales-registers', SalesRegisterViewSet)
router.register(r'stores', StoreViewSet)
router.register(r'payments-registers', PaymentsRegisterViewSet)

urlpatterns = [
	path('api/',include(router.urls)),
	path('api/set-csrf', set_csrf_token, name='set_csrf'),
	path('api/login', login_view, name='L_ogin'),
	path('api/who-am-i', who_am_i, name="who_am_i"),
	path('api/logout', logout_view, name='L_ogout'),
]
