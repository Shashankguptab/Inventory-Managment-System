from rest_framework import serializers
from .models import Sale, SaleItem
from django.db import transaction

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name",read_only=True)
    class Meta:
        model = SaleItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
        ]

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    customer_name = serializers.CharField(source="customer.name",read_only=True)
    class Meta:
        model = Sale
        fields = [
            "id",
            "customer",
            "customer_name",
            "sale_date",
            "items",
        ]
        read_only_fields = ["sale_date"]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("At least one product is required.")
        for item in items:
            if item["quantity"] <= 0:
                raise serializers.ValidationError("Quantity must be greater than zero.")
        return items

    @transaction.atomic
    def create(self, validated_data):
        items_data=validated_data.pop("items")

        for item_data in items_data:
            product=item_data["product"]
            requested_quantity=item_data["quantity"]

            if product.quantity<requested_quantity:
                raise serializers.ValidationError(
                    {
                        "stock": (
                            f"Insufficient stock for {product.name}. "
                            f"Available: {product.quantity}, "
                            f"Requested: {requested_quantity}."
                        )
                    }
                )
        sale=Sale.objects.create(**validated_data)

        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]
            SaleItem.objects.create(sale=sale,**item_data)
            product.quantity -= quantity
            product.save(update_fields=["quantity"])
        return sale
