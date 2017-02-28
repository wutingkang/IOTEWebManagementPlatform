#coding=utf-8
from django.shortcuts import render
from django.http import HttpResponseRedirect
from IOTEWMPApp.models import *
from django.contrib.auth import  authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import logging

# Create your views here.

def managePage(request):
    username = "用户"
    return render(request, 'ManagementPlatform.html', {'username':username})

def my_login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == 'POST':
        username= request.POST['username']
        password= request.POST['password']
        user = authenticate(username=username,password=password)
        if user is not None:
            if user.is_active:
                login(request,user)
                #重定向到成功页面
            else:
                #提示错误信息
                warning1 = "登陆失败！"
                return render(request, 'login.html', {'warning': warning1})
        else:
            #提示错误信息
            warning2 = "用户不存在或密码错误！"
            return render(request, 'login.html', {'warning': warning2})
        return render(request, 'ManagementPlatform.html', {'username': username})

def my_logout(request):
    logout(request)
    return HttpResponseRedirect("/")

######################################亮度处理#####################################################
#共用的亮度sensor数据处理函数
@login_required()
def floodlightMonitor(request):
    result = {}
    #读取传感器数据
    if request.method == "GET":
        #来自传感器模拟的读请求,返回工作中的传感器
        if "sensorRead" == request.GET['read']:
            #filter方法：匹配到数据时返回一个列表，不可以对查询到的数据进行修改(没有.save()方法)。没有匹配到数据时会返回一个空列表[].
            workingSensors = FloodlightSensor.objects.filter(deviceStatus = True)
            workingSensorsJSONArray = []
            for item in workingSensors:
                temp = {"id": item.id, "name": item.name, "deviceStatus":item.deviceStatus, "luminance":item.luminance}
                workingSensorsJSONArray.append(temp)
            result={"workingSensorsJSON":workingSensorsJSONArray}
        # 来自监视器网页的读请求
        else:
            allSensors = FloodlightSensor.objects.all()
            allSensorsJSONArray = []
            for item in allSensors:
                temp = {"id": item.id, "name": item.name, "deviceStatus": item.deviceStatus,"luminance": item.luminance}
                allSensorsJSONArray.append(temp)
            result = {"allSensorsJSON": allSensorsJSONArray}
    #传感器和web端更新传感器数据的操作
    else:
        id = request.POST['id']
        oldSensor = FloodlightSensor.objects.get(id=id)
        if "sensorWrite" == request.POST['writeType']:
            oldSensor.luminance = request.POST['luminance']
            oldSensor.save(update_fields=['luminance'])
        #web端写
        else:
            sensorName = request.POST['sensorName']
            # 如果找到该名称
            if len(FloodlightSensor.objects.filter(name=sensorName)):
                # 且该名称与其他名称重合，不能修改
                if oldSensor.name != sensorName:
                    result["editStatus"] = "该名称已存在！"
                # 是原来的名称，可以修改
                else:
                    result["editStatus"] = "修改成功！"
                    oldSensor.deviceStatus = request.POST['deviceStatus']
                    oldSensor.save(update_fields=['deviceStatus'])
            # 新的唯一的名称，直接修改
            else:
                result["editStatus"]="修改成功！"
                oldSensor.name = sensorName
                oldSensor.save(update_fields=['name'])
                oldSensor.deviceStatus = request.POST['deviceStatus']
                oldSensor.save(update_fields=['deviceStatus'])
    return JsonResponse(result)

#增加，删除亮度传感器
@login_required()
def floodlightSensor(request):
    result = {}
    #新增传感器
    if request.method == "POST":
        sensorName = request.POST['sensorName']
        if len(FloodlightSensor.objects.filter(name=sensorName)):
            result["addStatus"]="名称已存在！"
        else:
            result["addStatus"] = "添加成功！"
            aSensor = FloodlightSensor(name=sensorName, deviceStatus=True, luminance=350.64)
            aSensor.save()
    #删除传感器
    else:
        sensorId = request.GET['sensorId']
        FloodlightSensor.objects.get(id=sensorId).delete()
    return JsonResponse(result)



######################################温度处理#####################################################
#共用的sensor数据处理函数
@login_required()
def temperatureMonitor(request):
    result = {}
    #读取传感器数据
    if request.method == "GET":
        #来自传感器模拟的读请求,返回工作中的传感器
        if "sensorRead" == request.GET['read']:
            #filter方法：匹配到数据时返回一个列表，不可以对查询到的数据进行修改(没有.save()方法)。没有匹配到数据时会返回一个空列表[].
            workingSensors = TemperatureSensor.objects.filter(deviceStatus = True)
            workingSensorsJSONArray = []
            for item in workingSensors:
                temp = {"id": item.id, "name": item.name, "deviceStatus":item.deviceStatus, "temperature":item.temperature}
                workingSensorsJSONArray.append(temp)
            result={"workingSensorsJSON":workingSensorsJSONArray}
        # 来自监视器网页的读请求
        else:
            allSensors = TemperatureSensor.objects.all()
            allSensorsJSONArray = []
            for item in allSensors:
                temp = {"id": item.id, "name": item.name, "deviceStatus": item.deviceStatus,"temperature": item.temperature}
                allSensorsJSONArray.append(temp)
            result = {"allSensorsJSON": allSensorsJSONArray}
    #传感器和web端更新传感器数据的操作
    else:
        id = request.POST['id']
        oldSensor = TemperatureSensor.objects.get(id=id)
        if "sensorWrite" == request.POST['writeType']:
            oldSensor.temperature = request.POST['temperature']
            oldSensor.save(update_fields=['temperature'])
        #web端写
        else:
            sensorName = request.POST['sensorName']
            # 如果找到该名称
            if len(TemperatureSensor.objects.filter(name=sensorName)):
                # 且该名称与其他名称重合，不能修改
                if oldSensor.name != sensorName:
                    result["editStatus"] = "该名称已存在！"
                # 是原来的名称，可以修改
                else:
                    result["editStatus"] = "修改成功！"
                    oldSensor.deviceStatus = request.POST['deviceStatus']
                    oldSensor.save(update_fields=['deviceStatus'])
            # 新的唯一的名称，直接修改
            else:
                result["editStatus"]="修改成功！"
                oldSensor.name = sensorName
                oldSensor.save(update_fields=['name'])
                oldSensor.deviceStatus = request.POST['deviceStatus']
                oldSensor.save(update_fields=['deviceStatus'])
    return JsonResponse(result)

#增加，删除传感器
@login_required()
def temperatureSensor(request):
    result = {}
    #新增传感器
    if request.method == "POST":
        sensorName = request.POST['sensorName']
        if len(TemperatureSensor.objects.filter(name=sensorName)):
            result["addStatus"]="名称已存在！"
        else:
            result["addStatus"] = "添加成功！"
            aSensor = TemperatureSensor(name=sensorName, deviceStatus=True, temperature=45.52)
            aSensor.save()
    #删除传感器
    else:
        sensorId = request.GET['sensorId']
        TemperatureSensor.objects.get(id=sensorId).delete()
    return JsonResponse(result)

######################################湿度处理#####################################################
#共用的湿度sensor数据处理函数
@login_required()
def humidityMonitor(request):
    result = {}
    #读取传感器数据
    if request.method == "GET":
        #来自传感器模拟的读请求,返回工作中的传感器
        if "sensorRead" == request.GET['read']:
            #filter方法：匹配到数据时返回一个列表，不可以对查询到的数据进行修改(没有.save()方法)。没有匹配到数据时会返回一个空列表[].
            workingSensors = HumiditySensor.objects.filter(deviceStatus = True)
            workingSensorsJSONArray = []
            for item in workingSensors:
                temp = {"id": item.id, "name": item.name, "deviceStatus":item.deviceStatus, "humidity":item.humidity}
                workingSensorsJSONArray.append(temp)
            result={"workingSensorsJSON":workingSensorsJSONArray}
        # 来自监视器网页的读请求
        else:
            allSensors = HumiditySensor.objects.all()
            allSensorsJSONArray = []
            for item in allSensors:
                temp = {"id": item.id, "name": item.name, "deviceStatus": item.deviceStatus,"humidity": item.humidity}
                allSensorsJSONArray.append(temp)
            result = {"allSensorsJSON": allSensorsJSONArray}
    #传感器和web端更新传感器数据的操作
    else:
        id = request.POST['id']
        oldSensor = HumiditySensor.objects.get(id=id)
        if "sensorWrite" == request.POST['writeType']:
            oldSensor.humidity = request.POST['humidity']
            oldSensor.save(update_fields=['humidity'])
        #web端写
        else:
            sensorName = request.POST['sensorName']
            # 如果找到该名称
            if len(HumiditySensor.objects.filter(name=sensorName)):
                # 且该名称与其他名称重合，不能修改
                if oldSensor.name != sensorName:
                    result["editStatus"] = "该名称已存在！"
                # 是原来的名称，可以修改
                else:
                    result["editStatus"] = "修改成功！"
                    oldSensor.deviceStatus = request.POST['deviceStatus']
                    oldSensor.save(update_fields=['deviceStatus'])
            # 新的唯一的名称，直接修改
            else:
                result["editStatus"]="修改成功！"
                oldSensor.name = sensorName
                oldSensor.save(update_fields=['name'])
                oldSensor.deviceStatus = request.POST['deviceStatus']
                oldSensor.save(update_fields=['deviceStatus'])
    return JsonResponse(result)

#增加，删除湿度传感器
@login_required()
def humiditySensor(request):
    result = {}
    #新增传感器
    if request.method == "POST":
        sensorName = request.POST['sensorName']
        if len(HumiditySensor.objects.filter(name=sensorName)):
            result["addStatus"]="名称已存在！"
        else:
            result["addStatus"] = "添加成功！"
            aSensor = HumiditySensor(name=sensorName, deviceStatus=True, humidity=50.64)
            aSensor.save()
    #删除传感器
    else:
        sensorId = request.GET['sensorId']
        HumiditySensor.objects.get(id=sensorId).delete()
    return JsonResponse(result)
