from rest_framework.viewsets import ModelViewSet
from .models import Producto
from .serializers import ProductoSerializer


class ProductoViewSet(ModelViewSet):
    serializer_class = ProductoSerializer
    queryset = Producto.objects.filter(activo=True)
