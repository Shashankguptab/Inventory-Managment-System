from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]