"""
Carga datos de ejemplo para la demo de FlorSync.

Uso:
    python manage.py seed_demo

Es idempotente: si ya hay datos, los limpia y los vuelve a crear.
"""
import random
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import Categoria
from productos.models import Producto
from clientes.models import Clientes
from ventas.models import Venta, DetalleVenta

CATEGORIAS = [
    "Rosas", "Tulipanes", "Girasoles", "Orquídeas",
    "Arreglos de cumpleaños", "Ramos de novia", "Suculentas", "Día de la Madre",
]

# (nombre, categoría, precio COP, stock, stock mínimo)
PRODUCTOS = [
    ("Ramo de rosas rojas (12 tallos)", "Rosas", 45000, 40, 10),
    ("Ramo de rosas rosadas (6 tallos)", "Rosas", 28000, 35, 10),
    ("Rosas blancas en caja corazón", "Rosas", 62000, 18, 5),
    ("Ramo mixto con rosas y eucalipto", "Rosas", 54000, 22, 6),
    ("Rosas amarillas (9 tallos)", "Rosas", 38000, 25, 8),
    ("Tulipanes rojos (10 tallos)", "Tulipanes", 48000, 20, 6),
    ("Tulipanes en ramo pastel", "Tulipanes", 52000, 15, 5),
    ("Tulipanes blancos (6 tallos)", "Tulipanes", 31000, 24, 8),
    ("Girasol individual en maceta", "Girasoles", 18000, 45, 12),
    ("Ramo de girasoles (7 tallos)", "Girasoles", 35000, 28, 8),
    ("Jarrón con girasoles y madera", "Girasoles", 67000, 12, 4),
    ("Orquídea phalaenopsis blanca", "Orquídeas", 85000, 14, 4),
    ("Orquídea morada en matera", "Orquídeas", 78000, 10, 4),
    ("Orquídea dúo en matera cerámica", "Orquídeas", 145000, 6, 2),
    ("Caja de flores variadas mediana", "Arreglos de cumpleaños", 95000, 16, 5),
    ("Caja de cumpleaños gigante", "Arreglos de cumpleaños", 165000, 8, 3),
    ("Canasta de flores con peluche", "Arreglos de cumpleaños", 120000, 10, 3),
    ("Ramo de novia clásico en mano", "Ramos de novia", 180000, 5, 2),
    ("Ramo de novia cascada", "Ramos de novia", 240000, 4, 2),
    ("Corsage para novia", "Ramos de novia", 45000, 12, 4),
    ("Suculenta en matera de concreto", "Suculentas", 22000, 30, 8),
    ("Kit de 3 suculentas", "Suculentas", 55000, 14, 5),
    ("Suculenta gigante en matera", "Suculentas", 68000, 7, 3),
    ("Arreglo Día de la Madre con rosas", "Día de la Madre", 89000, 12, 4),
    ("Caja Día de la Madre premium", "Día de la Madre", 135000, 7, 3),
    ("Ramo de peonías (7 tallos)", "Rosas", 72000, 11, 4),
    ("Ramo de lavanda seca", "Arreglos de cumpleaños", 39000, 19, 6),
    ("Vaso de flores silvestres", "Arreglos de cumpleaños", 44000, 21, 6),
    ("Ramo de hortensias azules", "Rosas", 66000, 9, 3),
    ("Tulipanes dobles en tulipán", "Tulipanes", 41000, 17, 5),
]

NOMBRES = [
    "Ana", "Luis", "Camilo", "Valentina", "Jorge",
    "Mariana", "Andrés", "Sofía", "Diego", "Laura",
]

CLIENTES = [
    ("1023456789", "María Fernanda López", "Calle 10 # 45-23, Bogotá", "3001234567", "maria.lopez@email.com"),
    ("71456789", "Carlos Andrés Ramírez", "Cra 7 # 128-45, Bogotá", "3109876543", "carlos.ramirez@email.com"),
    ("1098765432", "Laura Gómez Pérez", "Calle 93 # 11-21, Bogotá", "3205556677", "laura.gomez@email.com"),
    ("43876543", "Jorge Iván Martínez", "Cra 15 # 63-18, Bogotá", "3154443322", "jorge.martinez@email.com"),
    ("1032198765", "Daniela Restrepo Vargas", "Calle 68 # 54-32, Bogotá", "3007778899", "daniela.restrepo@email.com"),
    ("79876543", "Roberto Carlos Núñez", "Cra 30 # 45-67, Bogotá", "3122221100", "roberto.nunez@email.com"),
    ("1128374655", "Camila Ortiz Silva", "Calle 26 # 69-90, Bogotá", "3189998877", "camila.ortiz@email.com"),
    ("45678912", "Felipe Torres Cárdenas", "Cra 50 # 24-15, Bogotá", "3056667788", "felipe.torres@email.com"),
    ("1015678901", "Isabella Moreno Díaz", "Calle 115 # 18-34, Bogotá", "3221113344", "isabella.moreno@email.com"),
    ("52345678", "Ricardo Peña Gutiérrez", "Cra 19 # 78-45, Bogotá", "3145556677", "ricardo.pena@email.com"),
    ("1073456789", "Valentina Cruz Mendoza", "Calle 39 # 21-67, Bogotá", "3018889900", "valentina.cruz@email.com"),
    ("68765432", "Andrés Felipe León", "Cra 9 # 80-12, Bogotá", "3177775544", "andres.leon@email.com"),
    ("1029837465", "Paula Andrea Ríos", "Calle 72 # 40-23, Bogotá", "3133332211", "paula.rios@email.com"),
    ("49123456", "Sebastián Vargas Ruiz", "Cra 43 # 12-56, Bogotá", "3194445566", "sebastian.vargas@email.com"),
    ("1145678901", "Natalia Gutiérrez Cobo", "Calle 127 # 25-40, Bogotá", "3166667788", "natalia.gutierrez@email.com"),
]

METODOS_PAGO = ["efectivo", "tarjeta", "transferencia", "nequi", "daviplata"]


class Command(BaseCommand):
    help = "Carga datos de ejemplo de la demo (flores, clientes y ventas históricas)"

    def handle(self, *args, **options):
        random.seed(42)  # misma data en cada corrida

        self.stdout.write("Limpiando datos anteriores...")
        DetalleVenta.objects.all().delete()
        Venta.objects.all().delete()
        Producto.objects.all().delete()
        Clientes.objects.all().delete()
        Categoria.objects.all().delete()

        self.stdout.write("Creando categorías...")
        categorias = {}
        for nombre in CATEGORIAS:
            cat = Categoria.objects.create(nombre_categoria=nombre)
            categorias[nombre] = cat

        self.stdout.write("Creando productos...")
        productos = []
        for nombre, cat_nombre, precio, stock, stock_min in PRODUCTOS:
            prod = Producto.objects.create(
                nombre=nombre,
                precio=precio,
                categoria=categorias[cat_nombre],
                stock_total=stock,
                stock_minimo=stock_min,
            )
            productos.append(prod)

        self.stdout.write("Creando clientes...")
        clientes = []
        for cedula, nombre, direccion, telefono, correo in CLIENTES:
            cli = Clientes.objects.create(
                cedula=cedula,
                nombre_cliente=nombre,
                direccion=direccion,
                telefono=telefono,
                correo=correo,
            )
            clientes.append(cli)

        self.stdout.write("Creando ventas históricas (últimos 90 días)...")
        hoy = timezone.now()
        total_ventas = 0

        for dia in range(90, -1, -1):
            fecha_base = hoy - timedelta(days=dia)

            # Entre 0 y 6 ventas por día, más actividad los fines de semana
            es_fin_de_semana = fecha_base.weekday() >= 5
            max_ventas_dia = 8 if es_fin_de_semana else 5
            ventas_dia = random.randint(0, max_ventas_dia)

            for _ in range(ventas_dia):
                hora = random.randint(8, 19)
                minuto = random.randint(0, 59)
                fecha_venta = fecha_base.replace(
                    hour=hora, minute=minuto, second=random.randint(0, 59)
                )

                n_items = random.randint(1, 4)
                items = random.sample(productos, n_items)

                # Elige cliente (o venta anónima en el 15% de los casos)
                cliente = random.choice(clientes) if random.random() > 0.15 else None

                venta = Venta.objects.create(
                    cliente=cliente,
                    vendedor=random.choice(NOMBRES),
                    metodo_pago=random.choice(METODOS_PAGO),
                    fecha=fecha_venta,
                )

                total = 0
                for prod in items:
                    cantidad = random.randint(1, 3)
                    precio_unit = float(prod.precio)
                    DetalleVenta.objects.create(
                        venta=venta,
                        producto=prod,
                        cantidad=cantidad,
                        precio=precio_unit,
                    )
                    total += cantidad * precio_unit

                venta.total = total
                venta.save(update_fields=["total"])

                total_ventas += 1

        # Stock final realista: la mayoría de productos queda por encima de su mínimo.
        # Solo 4 quedan en o bajo el mínimo para que se vea la alerta de stock bajo.
        for i, prod in enumerate(productos):
            if i < 4:
                prod.stock_total = prod.stock_minimo
            else:
                margen = prod.stock_minimo + random.randint(3, 20)
                prod.stock_total = margen
            prod.save(update_fields=["stock_total"])

        # Actualizar contador de compras de los clientes
        for cli in clientes:
            cli.compras = Venta.objects.filter(cliente=cli).count()
            cli.save(update_fields=["compras"])

        self.stdout.write(self.style.SUCCESS(
            f"¡Listo! {len(CATEGORIAS)} categorías, {len(productos)} productos, "
            f"{len(clientes)} clientes y {total_ventas} ventas creadas."
        ))
