from django.contrib import admin
from  .models import Product, Store, PaymentRegister
# Register your models here.
admin.site.register(Product)
admin.site.register(Store)
admin.site.register(PaymentRegister)
