from rest_framework import mixins, viewsets

from .models import Sale
from .serializers import SaleSerializer


class SaleViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        Sale.objects
        .select_related("customer")
        .prefetch_related("items__product")
        .all()
        .order_by("-sale_date")
    )

    serializer_class = SaleSerializer