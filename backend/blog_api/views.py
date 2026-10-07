from rest_framework import generics, filters, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import BlogPost, Category, ContactSubmission, Blog, BlogPreview
from .serializers import (
    BlogPostSerializer,
    CategorySerializer,
    ContactSubmissionSerializer,
    BlogSerializer,
    BlogPreviewSerializer,
)
from rest_framework.permissions import AllowAny


class BlogPostListCreateView(generics.ListCreateAPIView):
    queryset = BlogPost.objects.all().select_related('category')
    serializer_class = BlogPostSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            # Allow filter by id or slug
            if category.isdigit():
                qs = qs.filter(category_id=int(category))
            else:
                qs = qs.filter(category__slug=category)
        return qs


class BlogPostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.all().select_related('category')
    serializer_class = BlogPostSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    pagination_class = None


class ContactSubmissionCreateView(generics.CreateAPIView):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


class PreviewBlogListCreateView(generics.ListCreateAPIView):
    queryset = BlogPreview.objects.all().select_related('category')
    serializer_class = BlogPreviewSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


class ApproveBlogView(generics.CreateAPIView):
    serializer_class = BlogSerializer

    def post(self, request, pk, *args, **kwargs):
        preview = get_object_or_404(BlogPreview, pk=pk)
        blog = Blog.objects.create(
            title=preview.title,
            body=preview.body,
            category=preview.category,
            image=preview.image,
        )
        preview.delete()
        serializer = BlogSerializer(blog)
        return Response(serializer.data, status=201)


class ApprovedBlogListView(generics.ListAPIView):
    queryset = Blog.objects.all().select_related('category')
    serializer_class = BlogSerializer
