from django.db import transaction
from rest_framework import serializers
from .models import Purchase, PurchaseItem
from products.models import Product

class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name",read_only=True)
    class Meta:
        model = PurchaseItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
        ]


class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True)
    supplier_name = serializers.CharField(source="supplier.name",read_only=True)
    class Meta:
        model = Purchase
        fields = [
            "id",
            "supplier",
            "supplier_name",
            "purchase_date",
            "items",
        ]
        read_only_fields = ["purchase_date"]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        purchase = Purchase.objects.create(**validated_data)

        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]
            PurchaseItem.objects.create(purchase=purchase,**item_data)
            product.quantity += quantity
            product.save(update_fields=["quantity"])
        return purchase