from django.shortcuts import render
from .forms import ProfileForm
from .models import Profile
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def my_profile_view(request):
    profile = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=profile)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bio':instance.bio,
                'avatar':instance.avatar.url,
                'username':instance.user.username
            })
    context = {
        'profile':profile,
        'form':form,
    }
    return render(request, 'profile/main.html', context)
