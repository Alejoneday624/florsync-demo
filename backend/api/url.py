from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, reset_demo

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categorias')

urlpatterns = router.urls + [
    # POST /api/demo/reset/ → recarga los datos de ejemplo
    path('demo/reset/', reset_demo, name='reset_demo'),
]
