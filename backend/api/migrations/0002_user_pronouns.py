# Generated by Django 5.2.4 on 2025-07-19 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='pronouns',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]
