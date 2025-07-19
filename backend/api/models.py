from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # ---- Profile info ----
    date_of_birth = models.DateField(null=True, blank=True)

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        null=True,
        blank=True,
    )

    pronouns = models.CharField(max_length=20, blank=True)

    elo = models.IntegerField(default=1200)   # start everyone at 1200

    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)

    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        null=True,
        blank=True,
    )
    photo1 = models.ImageField(
        upload_to='profile_pics/',
        null=True,
        blank=True,
        help_text="Optional extra photo #1",
    )
    photo2 = models.ImageField(
        upload_to='profile_pics/',
        null=True,
        blank=True,
        help_text="Optional extra photo #2",
    )
    photo3 = models.ImageField(
        upload_to='profile_pics/',
        null=True,
        blank=True,
        help_text="Optional extra photo #3",
    )

    # ---- Dating preferences ----
    looking_for = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        null=True,
        blank=True,
        help_text="Which gender(s) this user is interested in",
    )
    min_age = models.PositiveIntegerField(null=True, blank=True)
    max_age = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.username
