from django.shortcuts import render
from rest_framework import viewsets
from .models import Customer
from .serializers import CustomerSerializer

# Create your views here.
class CustomerViewSet(viewsets.ModelViewSet):
    queryset=Customer.objects.all().order_by("name")
    serializer_class=CustomerSerializer
