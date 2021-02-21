from django.urls import include, path
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', auth_views.LoginView.as_view(), name='login'),
	path('login',auth_views.LoginView.as_view(), name='login'),
	path('logout',auth_views.LogoutView.as_view(), name='logout'),
]
