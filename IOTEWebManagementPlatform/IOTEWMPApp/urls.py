#coding=utf-8
from django.conf.urls import url
from . import views

urlpatterns = [
     url(r'^login/$',views.my_login), #登陆
     url(r'^logout/$',views.my_logout),#注销

     url(r'^$', views.managePage),  #管理页面

     url(r'^floodlightSensor/$', views.floodlightSensor),#新增，删除亮度传感器
     url(r'^floodlightMonitor/$', views.floodlightMonitor),#亮度传感器数据处理
     url(r'^temperatureSensor/$', views.temperatureSensor),#新增，删除温度传感器
     url(r'^temperatureMonitor/$', views.temperatureMonitor),#温度传感器数据处理
     url(r'^humiditySensor/$', views.humiditySensor),#新增，删除湿度传感器
     url(r'^humidityMonitor/$', views.humidityMonitor),#湿度传感器数据处理
]