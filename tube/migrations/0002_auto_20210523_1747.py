# Generated by Django 3.2.3 on 2021-05-23 08:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tube', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='tag',
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
    ]
