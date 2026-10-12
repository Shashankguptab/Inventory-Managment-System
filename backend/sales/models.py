from django.db import models
from customers.models import Customer
from products.models import Product

# Create your models here.
class Sale(models.Model):
    customer = models.ForeignKey(Customer,on_delete=models.PROTECT,related_name="sales")
    sale_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale #{self.id} - {self.customer.name}"

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale,on_delete=models.CASCADE,related_name="items")
    product = models.ForeignKey(Product,on_delete=models.PROTECT,related_name="sale_items")
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"