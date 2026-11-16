from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

from .models import Clientes
from .serializers import ClienteSerializer


class ClienteViewSet(ModelViewSet):
    serializer_class = ClienteSerializer
    queryset = Clientes.objects.filter(activo=True)
    lookup_field = "cedula"

    def create(self, request, *args, **kwargs):
        cedula = request.data.get("cedula")

        if not cedula:
            return Response(
                {"error": "La cédula es obligatoria"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cliente_existente = Clientes.objects.filter(cedula=cedula).first()

        # Si existía un cliente dado de baja, se reactiva con los nuevos datos
        if cliente_existente and not cliente_existente.activo:
            cliente_existente.nombre_cliente = request.data.get(
                "nombre_cliente",
                cliente_existente.nombre_cliente
            )
            cliente_existente.direccion = request.data.get(
                "direccion",
                cliente_existente.direccion
            )
            cliente_existente.telefono = request.data.get(
                "telefono",
                cliente_existente.telefono
            )
            cliente_existente.correo = request.data.get(
                "correo",
                cliente_existente.correo
            )

            cliente_existente.activo = True
            cliente_existente.save()

            serializer = self.get_serializer(cliente_existente)
            return Response(serializer.data)

        if cliente_existente and cliente_existente.activo:
            return Response(
                {"error": "Ya existe un cliente activo con esa cédula"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

    # Baja lógica: el cliente queda inactivo pero no se borra su historial
    def destroy(self, request, *args, **kwargs):
        cliente = self.get_object()
        cliente.activo = False
        cliente.save()

        return Response(
            {"mensaje": "Cliente eliminado correctamente"},
            status=status.HTTP_200_OK
        )
