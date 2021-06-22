from django.urls import path
from . import views

app_name    = "users"
urlpatterns = [ 
    path('follow/<uuid:pk>/', views.follow, name="follow"),
]
