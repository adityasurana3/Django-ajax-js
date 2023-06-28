from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver

# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(default='avatar.png', upload_to='avatars/')
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


def post_save_create_profile(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.create(user=instance)


post_save.connect(post_save_create_profile, sender=User)


# 2nd way to create a post signal using decorator
# @receiver(post_save, sender=User)
# def post_save_create_profile(sender, instance, created, *args, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)
