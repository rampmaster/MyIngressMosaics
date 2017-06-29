# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-06-29 13:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_auto_20170628_1537'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mission',
            name='mosaic',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='missions', to='api.Mosaic'),
        ),
    ]