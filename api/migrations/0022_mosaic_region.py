# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-07-07 07:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_remove_mission_unavailable'),
    ]

    operations = [
        migrations.AddField(
            model_name='mosaic',
            name='region',
            field=models.CharField(default=b'', max_length=64),
        ),
    ]