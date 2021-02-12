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
            models.UniqueConstraint(fields=['product_id', 'register_date'], name='unique register for product in date')
        ]
