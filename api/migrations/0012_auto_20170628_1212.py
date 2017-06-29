# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-06-28 12:12
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0011_auto_20170627_2000'),
    ]

    operations = [
        migrations.CreateModel(
            name='Creator',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default=b'', max_length=32)),
                ('faction', models.CharField(default=b'', max_length=8)),
            ],
        ),
        migrations.CreateModel(
            name='Mosaic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref', models.CharField(default=b'', max_length=64)),
                ('rows', models.IntegerField(default=0)),
                ('cols', models.IntegerField(default=0)),
                ('type', models.CharField(default=b'', max_length=64)),
                ('desc', models.CharField(default=b'', max_length=1024)),
                ('city', models.CharField(default=b'', max_length=64)),
                ('title', models.CharField(default=b'', max_length=128)),
                ('status', models.CharField(default=b'', max_length=64)),
                ('country', models.CharField(default=b'', max_length=64)),
                ('register_date', models.DateField(default=datetime.datetime.now)),
                ('_distance', models.FloatField(default=0.0)),
                ('_startLat', models.FloatField(default=0.0)),
                ('_startLng', models.FloatField(default=0.0)),
                ('creators', models.ManyToManyField(to='api.Creator')),
                ('registered', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mosaics', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='mission',
            name='mosaic',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='missions', to='api.Mosaic'),
        ),
    ]