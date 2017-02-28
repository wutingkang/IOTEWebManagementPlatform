from __future__ import unicode_literals
from django.db import models

# Create your models here.

class TemperatureSensor(models.Model):
    name = models.CharField(max_length=30)
    deviceStatus = models.BooleanField()
    temperature = models.DecimalField(decimal_places=2,max_digits=6)

class FloodlightSensor(models.Model):
    name = models.CharField(max_length=30)
    deviceStatus = models.BooleanField()
    luminance = models.DecimalField(decimal_places=2,max_digits=6)

class HumiditySensor(models.Model):
    name = models.CharField(max_length=30)
    deviceStatus = models.BooleanField()
    humidity = models.DecimalField(decimal_places=2,max_digits=6)