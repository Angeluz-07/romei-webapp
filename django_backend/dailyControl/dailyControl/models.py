from django.db import models

# Create your models here.

class Product(models.Model):
    stock = models.IntegerField()
    price = models.FloatField()
    name = models.CharField(max_length=100)

class SalesRegister(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    stock_addition = models.IntegerField()
    final_stock = models.IntegerField()
    product_price = models.FloatField()
    product_stock = models.IntegerField()
    register_date = models.DateField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['product_id', 'register_date'], name='unique register for product in date')
        ]
