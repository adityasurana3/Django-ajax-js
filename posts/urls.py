from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list_and_create, name='main-board'),
    # path('hello-world/', views.ajax_hello_world, name="hello-world"),
    path('data/<int:num_posts>/', views.load_post_data_views, name='data'),
    path('like-unlike/', views.like_unlike_post, name='like-unlike')
]
