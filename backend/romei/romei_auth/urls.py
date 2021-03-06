from django.urls import path
from .views import *

urlpatterns = [
	path('api/set-csrf', set_csrf_token, name='set_csrf'),
	path('api/login', login_view, name='login_api'),
	path('api/who-am-i', who_am_i, name="who_am_i"),
	path('api/logout', logout_view, name='logout_api'),
]
