from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.

def post_list_and_create(request):
    posts = Post.objects.all()
    return render(request, 'posts/main.html',{'posts':posts})

def ajax_hello_world(request):
    return JsonResponse({'text':'Hello World'})

def load_post_data_views(request):
    datas = Post.objects.all()
    data_list = []
    for data in datas:
        data_dict = {
            'id':data.id,
            'author':data.author.user.username,
            'title':data.title,
            'body': data.body
        }
        data_list.append(data_dict)
    return JsonResponse({'data_list':data_list})