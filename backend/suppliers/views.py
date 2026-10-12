from django.shortcuts import render
from .models import Supplier
from .serializers import SupplierSerializer
from rest_framework import viewsets

# Create your views here.
class SupplierViewSet(viewsets.ModelViewSet):
    queryset=Supplier.objects.all().order_by("name")
    serializer_class=SupplierSerializer
