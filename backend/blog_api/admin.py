from django.contrib import admin

from .models import BlogPost, Category, ContactSubmission, Blog, BlogPreview

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user_id', 'category', 'created_at')
    search_fields = ('title', 'body')
    list_filter = ('user_id', 'category', 'created_at')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ('name', 'slug')


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'created_at')
    search_fields = ('title', 'body')
    list_filter = ('category', 'created_at')


@admin.register(BlogPreview)
class BlogPreviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'created_at')
    search_fields = ('title', 'body')
    list_filter = ('category', 'created_at')
