from django.shortcuts import render
from .models import Post, Profile
from django.http import JsonResponse
from .forms import PostForm

# Create your views here.

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({'title':instance.title,'body':instance.body,'author':instance.author.user.username,'id':instance.id})
    context = {
        'form':form,

    }
    return render(request, 'posts/main.html',context)

# def ajax_hello_world(request):
#     return JsonResponse({'text':'Hello World'})

def load_post_data_views(request, num_posts):
    visible = 3
    upper = num_posts
    lower = upper - visible
    size = Post.objects.all().count()
    datas = Post.objects.all()
    data_list = []
    for data in datas:
        data_dict = {
            'id':data.id,
            'title':data.title,
            'body': data.body,
            'liked': True if request.user in data.likes.all() else False,
            'count': data.like_count,
            'author':data.author.user.username,
        }
        data_list.append(data_dict)
    return JsonResponse({'data_list':data_list[lower:upper],'size':size})


def like_unlike_post(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.likes.all():
            liked = False
            obj.likes.remove(request.user)
        else:
            liked = True
            obj.likes.add(request.user)
        return JsonResponse({'liked':liked,'count':obj.like_count})
