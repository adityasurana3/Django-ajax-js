from django.shortcuts import render
from .models import Post, Profile, Photo
from django.http import JsonResponse
from .forms import PostForm
from django.http import HttpResponse

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

def post_detail_data_view(request, pk):
    post = Post.objects.get(pk=pk)
    data = {
        'title':post.title,
        'body':post.body,
        'author':post.author.user.username,
        'logged_in': request.user.username,
    }
    return JsonResponse({'data':data})

def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    form = PostForm(instance=post)
    if form.is_valid():
        print(form)
    context = {
        'post':post,
        'form':form,
    }
    return render(request, 'posts/detail.html', context)

def update_post(request, pk):
    post = Post.objects.get(pk=pk)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')
        post.title = new_title
        post.body = new_body
        post.save()
    return JsonResponse({
        'title':new_title,
        'body':new_body,
    })
def delete_post(request, pk):
    print("Hello Delete")
    post = Post.objects.get(pk=pk)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        post.delete()
    return JsonResponse({})

def image_upload_view(request):
    if request.method == 'POST':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(image = img, post=post)
    return HttpResponse()
