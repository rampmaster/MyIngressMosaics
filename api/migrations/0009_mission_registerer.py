# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-06-27 07:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20170626_1515'),
    ]

    operations = [
        migrations.AddField(
            model_name='mission',
            name='registerer',
            field=models.CharField(default=b'', max_length=32),
        ),
    ]