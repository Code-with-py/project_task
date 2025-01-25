from .models import Product, Category, SubCategory
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all())

    class Meta:
        model = SubCategory
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category'] = CategorySerializer(instance.category).data
        return representation


class ProductSerializer(serializers.ModelSerializer):
    subcategory = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all())

    class Meta:
        model = Product
        fields = '__all__'

    def validate(self, data):
        if 'subcategory' not in data:
            raise serializers.ValidationError("Subcategory is required.")
        if 'name' not in data or not data['name']:
            raise serializers.ValidationError("Product name is required.")
        if 'price' not in data or data['price'] <= 0:
            raise serializers.ValidationError(
                "Price must be a positive number.")
        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['subcategory'] = SubCategorySerializer(
            instance.subcategory).data
        return representation
