from django.db import models

# Create your models here.

#remind handle uniqueness
class Product(models.Model):
	name=models.CharField(max_length=80)
	quantity=models.IntegerField()
	unit_price=models.DecimalField(max_digits=6,decimal_places=2)
	
	def __str__(self):
		return self.name

