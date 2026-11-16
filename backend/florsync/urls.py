from django.urls import path, include

urlpatterns = [
    # APIs publicas de la demo
    path('api/', include('api.url')),
    path('api/productos/', include('productos.urls')),
    path('api/clientes/', include('clientes.urls')),
    path('api/ventas/', include('ventas.urls')),
]
