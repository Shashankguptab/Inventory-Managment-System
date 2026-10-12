from rest_framework import mixins, viewsets

from .models import Purchase
from .serializers import PurchaseSerializer


class PurchaseViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        Purchase.objects
        .select_related("supplier")
        .prefetch_related("items__product")
        .all()
        .order_by("-purchase_date")
    )

    serializer_class = PurchaseSerializer