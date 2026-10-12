from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "category",
            "category_name",
            "description",
            "price",
            "quantity",
            "low_stock_threshold",
            "is_low_stock",
            "created_at",
            "updated_at",
        ]

    def get_is_low_stock(self, obj):
        return obj.quantity <= obj.low_stock_threshold