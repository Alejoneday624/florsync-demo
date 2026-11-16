from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.management import call_command

from .models import Categoria
from .serializers import CategoriaSerializer


class CategoriaViewSet(ModelViewSet):
    serializer_class = CategoriaSerializer
    queryset = Categoria.objects.filter(activo=True)

    def perform_destroy(self, instance):
        instance.activo = False
        instance.save()

    def create(self, request, *args, **kwargs):
        nombre = request.data.get("nombre_categoria")
        if not nombre:
            return Response(
                {"error": "nombre_categoria es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        categoria, created = Categoria.objects.update_or_create(
            nombre_categoria=nombre,
            defaults={'activo': True}
        )

        serializer = self.get_serializer(categoria)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


# ─────────────────────────────────────────
# RESTABLECER DATOS DE LA DEMO
# ─────────────────────────────────────────
@api_view(["POST"])
@permission_classes([AllowAny])
def reset_demo(request):
    """Vuelve a cargar los datos de ejemplo. Cualquiera puede limpiar la demo."""
    try:
        call_command("seed_demo")
        return Response({"mensaje": "Datos de la demo restablecidos correctamente"})
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
