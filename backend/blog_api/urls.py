from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.BlogPostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.BlogPostRetrieveUpdateDestroyView.as_view(), name='post-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('contact/', views.ContactSubmissionCreateView.as_view(), name='contact-create'),
    # Automated blog workflow endpoints
    path('preview-blogs/', views.PreviewBlogListCreateView.as_view(), name='preview-blog-list-create'),
    path('approve-blog/<int:pk>/', views.ApproveBlogView.as_view(), name='approve-blog'),
    path('blogs/', views.ApprovedBlogListView.as_view(), name='approved-blog-list'),
]
