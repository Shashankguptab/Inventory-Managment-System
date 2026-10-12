from django.db import models
from categories.models import Category 

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=150)
    sku = models.CharField(max_length=50,unique=True)
    category = models.ForeignKey(Category,on_delete=models.PROTECT,related_name="products")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name