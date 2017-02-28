simulateFloodlightSensor = function () {
    //先从服务器读取 当前 处于工作中 的注册设备，更新设备的检测数据，关键是根据设备的id进行读写

    $.get("/floodlightMonitor/", {read: "sensorRead"}, function (data) {
        var workingSensors = data.workingSensorsJSON; //返回值是JSON
        //随机改变检测的数据
        for (var i = 0; i < workingSensors.length; i++) {
            newSensor = workingSensors[i];
            newSensor.luminance = 350 + Math.round(50*Math.random()*100)/100; //有效数字精确到小数点后两位

            //上传数据到服务器,不能直接传一个sensor对象，只好拆开,但只需部分数据
            var id = newSensor.id;
            var luminance = newSensor.luminance;
            $.post("/floodlightMonitor/", {writeType: "sensorWrite", id:id, luminance:luminance});//用sensorName是为了与编辑操作的公用服务器端操作的request.POST['sensorName']保持一致
        }
    },"JSON")
};

simulateTemperatureSensor = function () {
    //先从服务器读取 当前 处于工作中 的注册设备，更新设备的检测数据，关键是根据设备的id进行读写

    $.get("/temperatureMonitor/", {read: "sensorRead"}, function (data) {
        var workingSensors = data.workingSensorsJSON; //返回值是JSON
        //随机改变检测的数据
        for (var i = 0; i < workingSensors.length; i++) {
            newSensor = workingSensors[i];
            newSensor.temperature = 50 + Math.round(50*Math.random()*100)/100; //有效数字精确到小数点后两位

            //上传数据到服务器,不能直接传一个sensor对象，只好拆开,但只需部分数据
            var id = newSensor.id;
            var temperature = newSensor.temperature;
            $.post("/temperatureMonitor/", {writeType: "sensorWrite", id:id, temperature:temperature});//用sensorName是为了与编辑操作的公用服务器端操作的request.POST['sensorName']保持一致
        }
    },"JSON")
};

simulateHumiditySensor = function () {
    //先从服务器读取 当前 处于工作中 的注册设备，更新设备的检测数据，关键是根据设备的id进行读写

    $.get("/humidityMonitor/", {read: "sensorRead"}, function (data) {
        var workingSensors = data.workingSensorsJSON; //返回值是JSON
        //随机改变检测的数据
        for (var i = 0; i < workingSensors.length; i++) {
            newSensor = workingSensors[i];
            newSensor.humidity = 50 + Math.round(50*Math.random()*100)/100; //有效数字精确到小数点后两位

            //上传数据到服务器,不能直接传一个sensor对象，只好拆开,但只需部分数据
            var id = newSensor.id;
            var humidity = newSensor.humidity;
            $.post("/humidityMonitor/", {writeType: "sensorWrite", id:id, humidity:humidity});//用sensorName是为了与编辑操作的公用服务器端操作的request.POST['sensorName']保持一致
        }
    },"JSON")
};

reloadFloodlightTable = function () {
    $.ajax({
        url: "/floodlightMonitor/",
        data: {read: "webRead"},
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            $("#monitorTable").children("tbody").empty();
            var htmlstr = "";

            for (var i = 0; i < data.allSensorsJSON.length; i++) {

                //将boolean型设备状态数据转换成文字；在model中也可以直接使用CharField表示，但若考虑使用较少的存储空间则使用boolean更好
                var deviceStatusString;
                if (true == data.allSensorsJSON[i].deviceStatus)//在服务器里写入时是True，不知道为什么这里读出来是true
                    deviceStatusString = "工作";
                else
                    deviceStatusString = "暂停";

                if (399 < data.allSensorsJSON[i].luminance)
                    alert("设备：【" + data.allSensorsJSON[i].name + "】 监测到的亮度过高！" + "\n为：" + data.allSensorsJSON[i].luminance + " lm" + "\n超过399 lm限制！");

                htmlstr = htmlstr +
                    "<tr>" +
                    "<td class='hidden'>" + data.allSensorsJSON[i].id + "</td>" +
                    "<td style='text-align:left'>" + (i + 1) + "</td>" +
                    "<td style='text-align:center'>" + data.allSensorsJSON[i].name + "</td>" +
                    "<td style='text-align:center'>" + deviceStatusString + "</td>" +
                    "<td style='text-align:center'>" + data.allSensorsJSON[i].luminance + " lm" + "</td>" +

                    "<td class='text-center'>" +
                    "<a type='button' class='btn btn-xs btn-success btnEdit'>编辑</a>" +
                    "<a type='button' class='btn btn-xs btn-danger btnDel'>删除</a>" +
                    "</td>" +
                    "</tr>";
            }

            $("#monitorTable").children("tbody").html(htmlstr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('获取数据错误');
        }
    })
};

reloadTemperatureTable = function () {
    $.ajax({
        url: "/temperatureMonitor/",
        data: {read: "webRead"},
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            $("#monitorTable").children("tbody").empty();
            var htmlstr = "";

            for (var i = 0; i < data.allSensorsJSON.length; i++) {

                //将boolean型设备状态数据转换成文字；在model中也可以直接使用CharField表示，但若考虑使用较少的存储空间则使用boolean更好
                var deviceStatusString;
                if (true == data.allSensorsJSON[i].deviceStatus)//在服务器里写入时是True，不知道为什么这里读出来是true
                    deviceStatusString = "工作";
                else
                    deviceStatusString = "暂停";

                if (99 < data.allSensorsJSON[i].temperature)
                    alert("设备：【" + data.allSensorsJSON[i].name + "】 监测到的温度过高！" + "\n为：" + data.allSensorsJSON[i].temperature + "°C" + "\n超过99°C限制！");

                htmlstr = htmlstr +
                    "<tr>" +
                    "<td class='hidden'>" + data.allSensorsJSON[i].id + "</td>" +
                    "<td style='text-align:left'>" + (i + 1) + "</td>" +
                    "<td style='text-align:center'>" + data.allSensorsJSON[i].name + "</td>" +
                    "<td style='text-align:center'>" + deviceStatusString + "</td>" +
                    "<td style='text-align:center'>" + data.allSensorsJSON[i].temperature + "°C" + "</td>" +

                    "<td class='text-center'>" +
                    "<a type='button' class='btn btn-xs btn-success btnEdit'>编辑</a>" +
                    "<a type='button' class='btn btn-xs btn-danger btnDel'>删除</a>" +
                    "</td>" +
                    "</tr>";
            }

            $("#monitorTable").children("tbody").html(htmlstr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('获取数据错误');
        }
    })
};

reloadHumidityTable = function () {
    $.ajax({
        url: "/humidityMonitor/",
        data: {read: "webRead"},
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            $("#monitorTable").children("tbody").empty();
            var htmlstr = "";

            for (var i = 0; i < data.allSensorsJSON.length; i++) {

                //将boolean型设备状态数据转换成文字；在model中也可以直接使用CharField表示，但若考虑使用较少的存储空间则使用boolean更好
                var deviceStatusString;
                if (true == data.allSensorsJSON[i].deviceStatus)//在服务器里写入时是True，不知道为什么这里读出来是true
                    deviceStatusString = "工作";
                else
                    deviceStatusString = "暂停";

                if (99 < data.allSensorsJSON[i].humidity)
                    alert("设备：【" + data.allSensorsJSON[i].name + "】 监测到的湿度过高！" + "\n为：" + data.allSensorsJSON[i].humidity + "%" + "\n超过99%限制！");

                htmlstr = htmlstr +
                    "<tr>" +
                    "<td class='hidden'>" + data.allSensorsJSON[i].id + "</td>" +
                    "<td style='text-align:left'>" + (i + 1) + "</td>" +
                    "<td style='text-align:center'>" + data.allSensorsJSON[i].name + "</td>" +
                    "<td style='text-align:center'>" + deviceStatusString + "</td>" +
                    "<td style='text-align:center'>" + data.allSensorsJSON[i].humidity + "%" + "</td>" +

                    "<td class='text-center'>" +
                    "<a type='button' class='btn btn-xs btn-success btnEdit'>编辑</a>" +
                    "<a type='button' class='btn btn-xs btn-danger btnDel'>删除</a>" +
                    "</td>" +
                    "</tr>";
            }

            $("#monitorTable").children("tbody").html(htmlstr);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('获取数据错误');
        }
    })
};

$(document).ready(function () {
    var showType = "null";
    var temSim, floSim, humSim;
    var temRel, floRel, humRel;

    $("#floodlightShowBtn").click(function () {
        $("#realTimeData").text("实时亮度");
        $("#floodlightShowBtn").attr("class", "btn btn-primary");
        $("#temperatureShowBtn").attr("class", "btn btn-danger");
        $("#humidityShowBtn").attr("class", "btn btn-danger");

        if ("temperature" == showType){
            window.clearInterval(temSim);
            window.clearInterval(temRel);
        }else if ("humidity" == showType){
            window.clearInterval(humSim);
            window.clearInterval(humRel);
        }

        showType = "floodlight";
        reloadFloodlightTable();
        floSim = window.setInterval(simulateFloodlightSensor, 2500);
        floRel = window.setInterval(reloadFloodlightTable, 2000);
    });

     $("#temperatureShowBtn").click(function () {
        $("#realTimeData").text("实时温度");
        $("#temperatureShowBtn").attr("class", "btn btn-primary");
        $("#humidityShowBtn").attr("class", "btn btn-danger");
        $("#floodlightShowBtn").attr("class", "btn btn-danger");

        if ("floodlight" == showType){
            window.clearInterval(floSim);
            window.clearInterval(floRel);
        }else if ("humidity" == showType){
            window.clearInterval(humSim);
            window.clearInterval(humRel);
        }

        showType = "temperature";
        reloadTemperatureTable();
        temSim = window.setInterval(simulateTemperatureSensor, 2500);
        temRel = window.setInterval(reloadTemperatureTable, 2000);
    });

    $("#humidityShowBtn").click(function () {
        $("#realTimeData").text("实时湿度");
        $("#humidityShowBtn").attr("class", "btn btn-primary");
        $("#floodlightShowBtn").attr("class", "btn btn-danger");
        $("#temperatureShowBtn").attr("class", "btn btn-danger");

       if ("floodlight" == showType){
           window.clearInterval(floSim);
           window.clearInterval(floRel);
       }else if ("temperature" == showType){
           window.clearInterval(temSim);
           window.clearInterval(temRel);
       }

        showType = "humidity";
        reloadHumidityTable();
        humSim = window.setInterval(simulateHumiditySensor, 2500);
        humRel = window.setInterval(reloadHumidityTable, 2000);
    });

    $("#addSensor").click( function () {
        if ("null" == showType){
            alert("请先选择显示的传感器种类！")
        }else{
            save_method = 'add';
            $('#form')[0].reset(); // 重置form
            $('#controlDiv').hide();//隐藏控制选项
            $('#modal_form').modal('show'); // 显示modal

            // 设置title
            if ("floodlight" == showType)
                $('.modal-title').text('新建亮度传感器');
            else if ("temperature" == showType)
                $('.modal-title').text('新建温度传感器');
            else if ("humidity" == showType)
                $('.modal-title').text('新建湿度传感器');
        }

    });

    $("#monitorTable").on('click', ".btnEdit", function () {
        save_method = 'update';
        $('#form')[0].reset();
        $("#controlDiv").show();//显示控制选项
        $('[name="id"]').val($(this).parent("td").siblings("td.hidden").text());

        //把deviceStatus的值填入表单，及根据deviceStatus的值显示不同的按钮样式，文字
        var deviceStatus;
        if ("工作" == $(this).parent("td").prev().prev().text()) {
            deviceStatus = "True";//需要加 “”
            $("#btnControl").attr("class", "btn btn-danger");
            $("#btnControl").text("暂停监测");
        }else{
            deviceStatus = "False";
            $("#btnControl").attr("class", "btn btn-primary");
            $("#btnControl").text("启动监测");
        }
        $('[name="deviceStatus"]').val(deviceStatus);
        $('[name="sensorName"]').val($(this).parent("td").prev().prev().prev().text());
        $('#modal_form').modal('show');
        $('.modal-title').text('编辑传感器名称');
    });

    $("#monitorTable").on('click', ".btnDel", function () {
        // 设置url
        var url;
        if ("floodlight" == showType)
            url = "/floodlightSensor/";
        else if ("temperature" == showType)
            url = "/temperatureSensor/";
        else
            url = "/humiditySensor/";

        $.ajax({
            url: url,
            type: "GET",
            data: {sensorId: $(this).parent("td").siblings("td.hidden").text()},
            dataType: "JSON",
            success: function () {
                //如果成功，隐藏弹出框并重新加载数据
                $('#modal_form').modal('hide');
                if ("floodlight" == showType)
                     reloadFloodlightTable();
                else if ("temperature" == showType)
                     reloadTemperatureTable();
                else
                    reloadHumidityTable();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('删除错误！');
            }
        })
    });

    $("#btnSave").click(function () {
        var url;

        if (save_method == 'add') {
            // 设置url
            if ("floodlight" == showType)
                url = "/floodlightSensor/";
            else if ("temperature" == showType)
                url = "/temperatureSensor/";
            else
                url = "/humiditySensor/";

            $.ajax({
                url: url,
                type: "POST",
                data:$('#form').serialize(),
                dataType: "JSON",
                success: function (data) {
                    if ("名称已存在！" == data.addStatus){
                        alert(data.addStatus);
                    }else{
                        //如果成功，隐藏弹出框并重新加载数据
                        $('#modal_form').modal('hide');
                        if ("floodlight" == showType)
                            reloadFloodlightTable();
                        else if ("temperature" == showType)
                            reloadTemperatureTable();
                        else
                            reloadHumidityTable();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("新建错误！");
                }
             })
        }
        else {//编辑

            // 设置url
            if ("floodlight" == showType)
                url = "/floodlightMonitor/";
            else if ("temperature" == showType)
                url = "/temperatureMonitor/";
            else
                url = "/humidityMonitor/";

            $.ajax({
                url: url,
                type: "POST",
                data:$('#form').serialize(),
                dataType: "JSON",
                success: function (data) {
                    if ("该名称已存在！" == data.editStatus){
                        alert(data.editStatus);
                    }else{
                        //如果成功，隐藏弹出框并重新加载数据
                        $('#modal_form').modal('hide');
                        if ("floodlight" == showType)
                            reloadFloodlightTable();
                        else if ("temperature" == showType)
                            reloadTemperatureTable();
                        else
                            reloadHumidityTable();
                    }
                },
                 error: function (jqXHR, textStatus, errorThrown) {
                    alert("修改错误！");
                 }
             })
        }


    });

    $("#btnControl").click(function () {
        //改变deviceStatus的值
        if ("True" == $('[name="deviceStatus"]').val()) {//注意，在btnEdit按钮里处理时填入的是True，
            $('[name="deviceStatus"]').val("False");
        }else {
            $('[name="deviceStatus"]').val("True");
        }

        // 设置url
        var url;
        if ("floodlight" == showType)
            url = "/floodlightMonitor/";
        else if ("temperature" == showType)
            url = "/temperatureMonitor/";
        else
            url = "/humidityMonitor/";


        $.ajax({
            url: url,
            type: "POST",
            data:$('#form').serialize(),
            dataType: "JSON",
            success: function (data) {//因为修改状态和名称的界面是同一个界面，提交的时候也应判断名称是否被修改成已存在名称
                if ("该名称已存在！" == data.editStatus){
                    alert(data.editStatus);
                }else{
                    //如果成功，隐藏弹出框并重新加载数据
                    $('#modal_form').modal('hide');
                    if ("floodlight" == showType)
                        reloadFloodlightTable();
                    else if ("temperature" == showType)
                        reloadTemperatureTable();
                    else
                        reloadHumidityTable();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('修改设备状态错误！');
            }
        })
    });

});




