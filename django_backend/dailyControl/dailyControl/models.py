from django.db import models

# Create your models here.

class Store(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

class Product(models.Model):
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    stock = models.IntegerField()
    price = models.FloatField()
    name = models.CharField(max_length=100)

class PaymentsRegister(models.Model):
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    description = models.TextField()
    value = models.IntegerField()
    register_date = models.DateField()
    name = models.CharField(max_length=100)

class SalesRegister(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    stock_addition = models.IntegerField()
    final_stock = models.IntegerField()
    product_price = models.FloatField()
    product_stock = models.IntegerField()
    register_date = models.DateField()

    @property
    def initial_stock(self):
        return self.product_stock + self.stock_addition

    @property
    def product_name(self):
        return self.product.name

    @property
    def stock_sold(self):
        return self.initial_stock - self.final_stock

    @property
    def cash_sale(self):
        return self.stock_sold * self.product_price

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['product', 'register_date'], name='unique register for product in date')
        ]
