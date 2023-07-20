from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list_and_create, name='main-board'),
    # path('hello-world/', views.ajax_hello_world, name="hello-world"),
    path('data/<int:num_posts>/', views.load_post_data_views, name='data'),
    path('like-unlike/', views.like_unlike_post, name='like-unlike'),
    path('<pk>', views.post_detail, name='detail'),
    path('<pk>/update/', views.update_post, name='update-post'),
    path('<pk>/delete/', views.delete_post, name='delete-post'),
    path('<pk>/data/', views.post_detail_data_view, name='post-detail-data'),
    path('upload/', views.image_upload_view, name='image_upload')
]
