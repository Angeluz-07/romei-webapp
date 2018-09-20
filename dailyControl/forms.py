from django import forms
from .models import Product

#check if renders id
#in dict 'labels', you change the labels rendered in the form 
class ProductForm(forms.ModelForm):
	class Meta:
		model = Product
		fields = '__all__'
		labels = {
			'name':'Nombre',
			'quantity':'Cantidad',
			'unit_price':'Precio unitario',
		}
