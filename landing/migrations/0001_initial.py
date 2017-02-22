# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-02-16 11:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500)),
                ('email', models.CharField(max_length=500)),
                ('source', models.CharField(max_length=500)),
                ('datetime', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]