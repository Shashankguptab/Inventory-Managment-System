from django.db import models
from suppliers.models import Supplier
from products.models import Product

# Create your models here.
class Purchase(models.Model):
    supplier = models.ForeignKey(Supplier,on_delete=models.PROTECT,related_name="purchases")
    purchase_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Purchase #{self.id} - {self.supplier.name}"


class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase,on_delete=models.CASCADE,related_name="items")
    product = models.ForeignKey(Product,on_delete=models.PROTECT,related_name="purchase_items")
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"