from django.http import JsonResponse
from django.urls import path, include


def health(request):
    """Endpoint de salud para los health checks de Render."""
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('health', health, name='health'),

    # APIs publicas de la demo
    path('api/', include('api.url')),
    path('api/productos/', include('productos.urls')),
    path('api/clientes/', include('clientes.urls')),
    path('api/ventas/', include('ventas.urls')),
]
