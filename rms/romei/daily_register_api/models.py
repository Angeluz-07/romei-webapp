from django.db import models

# Create your models here.

class Store(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return f'Store : {self.name}, {self.description[:40]}...'

class Product(models.Model):
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    price = models.FloatField()
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'Product : {self.name}, {self.store.name}'

class PaymentRegister(models.Model):
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    description = models.TextField(blank=True)
    value = models.FloatField()
    register_date = models.DateField()

    @property
    def store_name(self):
        return self.store.name

class SaleRegister(models.Model):
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
        sold = self.initial_stock - self.final_stock
        if sold < 0 :
            return 0
        return sold

    @property
    def cash_sale(self):
        return self.stock_sold * self.product_price

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['product', 'register_date'], name='unique register for product in date')
        ]
