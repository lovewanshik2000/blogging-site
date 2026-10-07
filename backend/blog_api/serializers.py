from rest_framework import serializers
from .models import BlogPost, Category, ContactSubmission, Blog, BlogPreview

class BlogPostSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_detail = serializers.SerializerMethodField(read_only=True)

    def get_category_detail(self, obj):
        if obj.category:
            return CategorySerializer(obj.category).data
        return None

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'body', 'user_id', 'category', 'category_detail',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class BlogSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_detail = serializers.SerializerMethodField(read_only=True)

    def get_category_detail(self, obj):
        if obj.category:
            return CategorySerializer(obj.category).data
        return None

    class Meta:
        model = Blog
        fields = ['id', 'title', 'body', 'category', 'category_detail', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class BlogPreviewSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )
    category_detail = serializers.SerializerMethodField(read_only=True)

    def get_category_detail(self, obj):
        if obj.category:
            return CategorySerializer(obj.category).data
        return None

    class Meta:
        model = BlogPreview
        fields = ['id', 'title', 'body', 'category', 'category_detail', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']
