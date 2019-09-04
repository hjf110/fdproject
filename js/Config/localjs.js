//正式环境
var path = "http://47.99.174.52:8083/kjcy";//接口头地址

//测试环境
// var path = "http://115.238.154.91:8083/kjcy";//接口头地址
var pass = "Qyw6tX4f";// 8位随机签名加密码


(function ($) {
    $.extend({
        myTime: {
            /**
             * 当前时间戳
             * @return <int>    unix时间戳(秒)
             */
            CurTime: function () {
                return Date.parse(new Date()) / 1000;
            },
            /**
             * 日期 转换为 Unix时间戳
             * @param <string> 2014-01-01 20:20:20 日期格式
             * @return <int>    unix时间戳(秒)
             */
            DateToUnix: function (string) {
                var f = string.split(' ', 2);
                var d = (f[0] ? f[0] : '').split('-', 3);
                var t = (f[1] ? f[1] : '').split(':', 3);
                return (new Date(
                    parseInt(d[0], 10) || null,
                    (parseInt(d[1], 10) || 1) - 1,
                    parseInt(d[2], 10) || null,
                    parseInt(t[0], 10) || null,
                    parseInt(t[1], 10) || null,
                    parseInt(t[2], 10) || null
                )).getTime() / 1000;
            },
            /**
             * 时间戳转换日期
             * @param <int> unixTime  待时间戳(秒)
             * @param <bool> isFull  返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
             * @param <int> timeZone  时区
             */
            UnixToDate: function (unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number') {
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime * 1000);
                var ymdhis = "";
                ymdhis += time.getUTCFullYear() + "-";
                ymdhis += (time.getUTCMonth() + 1) + "-";
                ymdhis += time.getUTCDate();
                if (isFull === true) {
                    ymdhis += " " + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                }
                return ymdhis;
            }
        }
    });
})(jQuery);


/*跳转到某一元素*/
function gotoItem(item) {
    var scroll_offset = $(item).offset(); //得到box这个div层的offset，包含两个值，top和left

    $("body,html").animate({
        scrollTop: scroll_offset.top //让body的scrollTop等于pos的top，就实现了滚动
    });
}

/*验证手机号*/
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}


/*校验身份证格式*/
function testId(value) {
    var vcity = {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
        21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
        33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
        42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
        51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
        63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    };

    // 判断是否为空
    isEmpty = function (card) {
        if (/^\s*$/.test(card) === true) {
            return true;
        }
    }
    //检查号码是否符合规范，包括长度，类型
    isCardNo = function (card) {
        if (isEmpty(card)) {
            return true;
        }
        //这个代码表示身份证可以为空
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
        if (reg.test(card) === false) {
            return false;
        }
        return true;
    };

    //取身份证前两位,校验省份
    checkProvince = function (card) {
        if (isEmpty(card)) {
            return true;
        }
        var province = card.substr(0, 2);
        if (vcity[province] == undefined) {
            return false;
        }
        return true;
    };

    //检查生日是否正确
    checkBirthday = function (card) {
        if (isEmpty(card)) {
            return true;
        }
        var len = card.length;
        //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
        if (len == '15') {
            var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
            var arr_data = card.match(re_fifteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date('19' + year + '/' + month + '/' + day);
            return verifyBirthday('19' + year, month, day, birthday);
        }
        //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
        if (len == '18') {
            var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            var arr_data = card.match(re_eighteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date(year + '/' + month + '/' + day);
            return verifyBirthday(year, month, day, birthday);
        }
        return false;
    };

    //校验日期
    verifyBirthday = function (year, month, day, birthday) {
        var now = new Date();
        var now_year = now.getFullYear();
        //年月日是否合理
        if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
            //判断年份的范围（3岁到100岁之间)
            var time = now_year - year;
            if (time >= 3 && time <= 100) {
                return true;
            }
            return false;
        }
        return false;
    };

    //校验位的检测
    checkParity = function (card) {
        if (isEmpty(card)) {
            return true;
        }
        //15位转18位
        card = changeFivteenToEighteen(card);
        var len = card.length;
        if (len == '18') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i, valnum;
            for (i = 0; i < 17; i++) {
                cardTemp += card.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[cardTemp % 11];
            if (valnum == card.substr(17, 1)) {
                return true;
            }
            return false;
        }
        return false;
    };

    //15位转18位身份证号
    changeFivteenToEighteen = function (card) {
        if (isEmpty(card)) {
            return true;
        }
        if (card.length == '15') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i;
            card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
            for (i = 0; i < 17; i++) {
                cardTemp += card.substr(i, 1) * arrInt[i];
            }
            card += arrCh[cardTemp % 11];
            return card;
        }
        return card;
    };

    //checkCard = function () {
    var card = value;
    //校验长度，类型
    if (isCardNo(card) === false) {
        //alert('您输入的身份证号码不正确，请重新输入');
        //document.getElementById('card_no').focus;
        return false;
    }
    //检查省份
    if (checkProvince(card) === false) {
        return false;
    }
    //校验生日
    if (checkBirthday(card) === false) {
        return false;
    }
    //检验位的检测
    if (checkParity(card) === false) {
        return false;
    }

    return true;
}

// layui.use('form', function () {
//     var form = layui.form;
//
//     //自定义校验规则
//     form.verify({
//         selectnull: function (value) {
//             if (value == null || value == "") {
//                 return "请选择"
//             }
//         }
//     });
//
// });


//-----------------压缩图片----------------------------
function convertBase64UrlToBlob(urlData) {
    var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/png'});
}


var compress = function (res, fff) {
    var dataUrl;
    var img = new Image(),
        maxH = 500;
    img.onload = function () {
        var cvs = document.createElement('canvas'),
            ctx = cvs.getContext('2d');
        if (img.height > maxH) {
            img.width *= maxH / img.height;
            img.height = maxH;
        }
        cvs.width = img.width;
        cvs.height = img.height;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        dataUrl = cvs.toDataURL('image/jpeg', 0.6);
        console.log("图片信息-------", dataUrl);
        // 上传略
        fff(convertBase64UrlToBlob(dataUrl));
    }
    img.src = res;
};

//---------------------------------------------
function Add_ajaxSubmit(url, json, tableID) {
    $.ajax({
        type: "POST",
        url: url,
        data: json,
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader("KJCY-TOKEN", sessionStorage.getItem('token'));
            //request.setRequestHeader("FORM-TOKEN", fd);
            request.setRequestHeader("Content-Type", "application/json");
        },
        success: function (res) {
            console.log("msg信息------" + res.msg);
            // alert("添加成功");
            if (res.msg == "success") {
                var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                parent.layui.table.reload(tableID, {page: {curr: 1}});
                parent.layer.msg('添加成功');
                parent.layer.close(index);
            }

        },
        error: function (XMLHttpResponse, textStatus, errorThrown) {
            console.log("1 异步调用返回失败,XMLHttpResponse.readyState:" + XMLHttpResponse.readyState);
            console.log("2 异步调用返回失败,XMLHttpResponse.status:" + XMLHttpResponse.status);
            console.log("3 异步调用返回失败,textStatus:" + textStatus);
            console.log("4 异步调用返回失败,errorThrown:" + errorThrown);

        }
    })
}


//文件上传接口
var ImageajaxSubmit = function (base64url, url, type, method, imgName, isasync) {
    var data;
    var headers = {};
    headers["KJCY-TOKEN"] = sessionStorage.getItem('token');
    headers["KJCY-SUBTOKEN"] = sessionStorage.getItem('subtoken');
    var async_is = true;


    if (imgName == "" || imgName == null || imgName == true || imgName == false) {
        imgName = "image";
    }


    if (isasync == false) {
        async_is == false;
    }

    var formData = new FormData();
    //formData.append("vinnop",convertBase64UrlToBlob(b64));

    formData.append(imgName, convertBase64UrlToBlob(base64url), "file_" + Date.parse(new Date()) + ".jpg");


    console.log("url为:", url);
    console.log("值为:", base64url);
    console.log("头信息为", headers);
    jQuery.ajax({
        url: url,
        data: formData,
        type: type,
        headers: headers,
        cache: false,    //上传文件不需缓存
        processData: false, //需设置为false。因为data值是FormData对象，不需要对数据做处理
        contentType: false, //需设置为false。因为是FormData对象，且已经声明了属性enctype="multipart/form-data"
        dataType: 'json',
        //contentType: "application/json;charset=UTF-8",
        //  timeout: 1000000,
        async: async_is, //异步
        // cache: false, //不缓存
        success: function (res) {
            console.log("访问接口成功后返回的参数", res);
            // console.log(11111111111111111111);
            if (res.code == "0") {
                method(res);
            } else {
                alert(res.msg);
                // method(data);
            }
            //method(data);
        },
        error: function (XMLHttpResponse, textStatus, errorThrown) {
            alert("网络错误");
            console.log("1 异步调用返回失败,XMLHttpResponse.readyState:" + XMLHttpResponse.readyState);
            console.log("2 异步调用返回失败,XMLHttpResponse.status:" + XMLHttpResponse.status);
            console.log("3 异步调用返回失败,textStatus:" + textStatus);
            console.log("4 异步调用返回失败,errorThrown:" + errorThrown);
        }
    });
};


//通用接口
var ajaxSubmit = function (submitData, url, type, method, headType, istoken, isasync, ismsg) {
    var data;
    var headers = {};
    let asc = true;


    if (ismsg == false) {
        asc = false;
    }
    ;
    // headers["Access-Control-Allow-Origin"] = "*";
    headers["KJCY-TOKEN"] = sessionStorage.getItem('token');
    let aac = sessionStorage.getItem('subtoken');
    if (aac != "null" && sessionStorage.getItem('subtoken') != null && sessionStorage.getItem('subtoken') != "" && sessionStorage.getItem('subtoken') != undefined) {
        headers["KJCY-SUBTOKEN"] = sessionStorage.getItem('subtoken');
    }
    // console.log(sessionStorage.getItem('token'));
    var async_is = true;
    if (type != "GET") {
        data = JSON.stringify(submitData);
    } else {
        data = submitData;
    }
    if (headType == "json") {
        headers["Content-Type"] = "application/json";
    }

    if (istoken == true) {
        // console.log("token头信息--------", $.cookie("token"));
        headers["KJCY-TOKEN"] = sessionStorage.getItem('token');
    }
    if (isasync == false) {
        async_is == false;
    }


    if (asc) {
        console.log("url为:", url);
        console.log("值为:", data);
        console.log("头信息为", headers);
    }

    jQuery.ajax({
        url: url,
        data: data,
        type: type,
        headers: headers,
        dataType: "json",
        //contentType: "application/json;charset=UTF-8",
        //  timeout: 1000000,
        async: async_is, //异步
        // cache: false, //不缓存
        success: function (res) {
            if (asc) {
                console.log("" + url, res);
            }
            // console.log(11111111111111111111);
            method(res);

            if (res.code == "0") {
                // method(res);
            } else {
                alert(res.msg);
                // method(data);
            }
            //method(data);
        },
        error: function (XMLHttpResponse, textStatus, errorThrown) {
            alert("网络错误");
            console.log("1 异步调用返回失败,XMLHttpResponse.readyState:" + XMLHttpResponse.readyState);
            console.log("2 异步调用返回失败,XMLHttpResponse.status:" + XMLHttpResponse.status);
            console.log("3 异步调用返回失败,textStatus:" + textStatus);
            console.log("4 异步调用返回失败,errorThrown:" + errorThrown);
        }
    });
};

var postAjaxFile = function (submitData, submitUrl, method) {
    jQuery.ajax({
        url: submitUrl,
        data: submitData, //FormData对象
        type: "POST",
        timeout: 10000,
        processData: false, //是否对data序列化
        contentType: false,
        async: true, //异步
        cache: false, //不缓存
        success: function (data) {
            method(JSON.parse(data));
        },
        error: function () {
            alert("网络错误");
        }
    });
}


//单击行勾选checkbox事件
$(document).on("click", ".layui-table-body table.layui-table tbody tr", function () {
    var index = $(this).attr('data-index');
    var tableBox = $(this).parents('.layui-table-box');
    //存在固定列
    if (tableBox.find(".layui-table-fixed.layui-table-fixed-l").length > 0) {
        tableDiv = tableBox.find(".layui-table-fixed.layui-table-fixed-l");
    } else {
        tableDiv = tableBox.find(".layui-table-body.layui-table-main");
    }
    var checkCell = tableDiv.find("tr[data-index=" + index + "]").find("td div.laytable-cell-checkbox div.layui-form-checkbox I");
    if (checkCell.length > 0) {
        checkCell.click();
    }
});

$(document).on("click", "td div.laytable-cell-checkbox div.layui-form-checkbox", function (e) {
    e.stopPropagation();
});
// 454464646464464646464

//去重添加数组
Array.prototype.push_unique = function () {
    for (var i = 0; i < arguments.length; i++) {
        var ele = arguments[i];
        if (this.indexOf(ele) == -1) {
            this.push(ele);
        }
    }
};

//json对象数组去重
function unique(list) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        if (i == 0) arr.push(list[i]);
        b = false;
        if (arr.length > 0 && i > 0) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].typesname == list[i].typesname) {
                    b = true;
                    //break;
                }
            }
            if (!b) {
                arr.push(list[i]);
            }
        }
    }
    return arr;
};

/*
* 获取url上的参数
* */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2]));
    return null;
}


//json对象数组去重
function JsonUnique(list, id) {
    let arr = [];
    let b;
    for (let i = 0; i < list.length; i++) {
        if (i == 0) arr.push(list[i]);
        b = false;
        if (arr.length > 0 && i > 0) {
            for (var j = 0; j < arr.length; j++) {
                if (Compare(arr[j], list[i])) {
                    b = true;
                    //break;
                }
                //
                // if (arr[j].id == list[i].id) {
                //     b = true;
                //     //break;
                // }
            }
            if (!b) {
                arr.push(list[i]);
            }
        }
    }
    return arr;
};


function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + M + D + h + m + s;
}

/*
* 去掉字符串中的所有空格
* */
function Trim(str) {
    var result;
    result = result.replace(/\s/g, "");
    return result;
}


/*语音播报功能*/

//html5语音播报
function speak(textToSpeak) {
    //创建一个 SpeechSynthesisUtterance的实例
    var utterance = new SpeechSynthesisUtterance();
    // 设置文本
    utterance.text = textToSpeak;
    //增加中文支持
    utterance.lang = 'zh-CN';
    //播报语速
    utterance.rate = 1;
    // 添加到队列
    window.speechSynthesis.speak(utterance);
}

/*
* 获取当前时间
* type参数
* 1：获取年月日
* 2：获取年月日时分秒
* 3：获取年月日星期时分秒
* */
function updateTime(type) {
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    if (this.month < 10) {
        this.month = "0" + this.month + "";
    }
    this.date = date.getDate();
    if (this.date < 10) {
        this.date = "0" + this.date + "";
    }
    this.day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
    this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var currentTime;
    if (type == 3) {
        currentTime = this.year + "-" + this.month + "-" + this.date + "-" + this.day + " " + this.hour + ":" + this.minute + ":" + this.second;
    } else if (type == 1) {
        currentTime = this.year + "-" + this.month + "-" + this.date;
    } else if (type == 2) {
        currentTime = this.year + "-" + this.month + "-" + this.date + " " + this.hour + ":" + this.minute + ":" + this.second;
    }

    return currentTime;
}


/*
* 转换时间格式
* 参数说明
* date 传入的时间显示格式的参数
*  type 等于true时 返回 2015-03-19 12:00:00
*        否则的话  返回 2015-03-19
* */
const formatDateTime = (date, type) => {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    let minute = date.getMinutes();
    let seconds = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    seconds = seconds < 10 ? ("0" + seconds) : seconds;
    if (type) {
        return y + '-' + m + '-' + d;
    } else {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ":" + seconds;
    }
};


/*
* 根据元素值删除元素
* */
function delList(arr, obj) {
    arr.splice($.inArray(obj, arr), 1);
}


function checkEndTime(now, input) {
    var start = new Date(now.replace("-", "/").replace("-", "/"));
    var end = new Date(input.replace("-", "/").replace("-", "/"));
    if (end < start) {
        return false;
    }
    return true;
}


/*
* 判断两个json 是否相等的一系列方法
* */

function isObj(object) {
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
}

function isArray(object) {
    return object && typeof (object) == 'object' && object.constructor == Array;
}

function getLength(object) {
    var count = 0;
    for (var i in object) count++;
    return count;
}


function Compare(objA, objB) {
    if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
    if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
    return CompareObj(objA, objB, true);//默认为true
}

function CompareObj(objA, objB, flag) {
    for (var key in objA) {
        if (!flag) //跳出整个循环
            break;
        if (!objB.hasOwnProperty(key)) {
            flag = false;
            break;
        }
        if (!isArray(objA[key])) { //子级不是数组时,比较属性值
            if (objB[key] != objA[key]) {
                flag = false;
                break;
            }
        } else {
            if (!isArray(objB[key])) {
                flag = false;
                break;
            }
            var oA = objA[key], oB = objB[key];
            if (oA.length != oB.length) {
                flag = false;
                break;
            }
            for (var k in oA) {
                if (!flag) //这里跳出循环是为了不让递归继续
                    break;
                flag = CompareObj(oA[k], oB[k], flag);
            }
        }
    }
    return flag;
}


//比较数组是否相同
compArray = function (array1, array2) {
    if ((array1 && typeof array1 === "object" && array1.constructor === Array) && (array2 && typeof array2 === "object" && array2.constructor === Array)) {
        if (array1.length == array2.length) {
            for (var i = 0; i < array1.length; i++) {
                var ggg = modeler.compObj(array1[i], array2[i]);
                if (!ggg) {
                    return false;
                }

            }

        } else {
            return false;
        }
    }
    return true;
};
compObj = function (obj1, obj2)//比较两个对象是否相等，不包含原形上的属性计较
{
    if ((obj1 && typeof obj1 === "object") && ((obj2 && typeof obj2 === "object"))) {
        var count1 = modeler.propertyLength(obj1);
        var count2 = modeler.propertyLength(obj2);
        if (count1 == count2) {
            for (var ob in obj1) {
                if (obj1.hasOwnProperty(ob) && obj2.hasOwnProperty(ob)) {

                    if (obj1[ob].constructor == Array && obj2[ob].constructor == Array)//如果属性是数组
                    {
                        if (!modeler.compArray(obj1[ob], obj2[ob])) {
                            return false;
                        }
                        ;
                    } else if (typeof obj1[ob] === "string" && typeof obj2[ob] === "string")//纯属性
                    {
                        if (obj1[ob] !== obj2[ob]) {
                            return false;
                        }
                    } else if (typeof obj1[ob] === "object" && typeof obj2[ob] === "object")//属性是对象
                    {
                        if (!modeler.compObj(obj1[ob], obj2[ob])) {
                            return false;
                        }
                        ;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    return true;
};
propertyLength = function (obj)//获得对象上的属性个数，不包含对象原形上的属性
{
    var count = 0;
    if (obj && typeof obj === "object") {
        for (var ooo in obj) {
            if (obj.hasOwnProperty(ooo)) {
                count++;
            }
        }
        return count;
    } else {
        throw new Error("argunment can not be null;");
    }

};


/*去除所有空格
* 第二个参数设为"g"
* */
function Trim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");

    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

/*替换所有字符串*/
String.prototype.replaceAll = function (targetStr, newStr) {
    var sourceStr = this.valueOf();
    while (sourceStr.indexOf(targetStr) !== -1) {
        sourceStr = sourceStr.replace(targetStr, newStr);
    }
    return sourceStr;
};


Array.prototype.removeRepeatAttr = function () {
    var tmp = {}, b = [], a = this;
    for (var i = 0; i < a.length; i++) {
        if (!tmp[a[i].car_vinno]) {
            tmp[a[i].car_vinno] = !0;
        } else {
            a.splice(i, 1);
        }
    }
    ;
};

Array.prototype.removeRepeatAttr_All = function (str) {
    var tmp = {}, b = [], a = this;
    for (var i = 0; i < a.length; i++) {
        if (!tmp[a[i][str]]) {
            tmp[a[i][str]] = !0;
        } else {
            a.splice(i, 1);
        }
    }
    ;
};


Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**
 * 从对象数组中删除属性为objPropery，值为objValue元素的对象
 * @param Array arrPerson  数组对象
 * @param String objPropery  对象的属性
 * @param String objPropery  对象的值
 * @return Array 过滤后数组
 */
function remove(arrPerson, objPropery, objValue) {
    return $.grep(arrPerson, function (cur, i) {
        return cur[objPropery] != objValue;
    });
}

/**
 * 从对象数组中获取属性为objPropery，值为objValue元素的对象
 * @param Array arrPerson  数组对象
 * @param String objPropery  对象的属性
 * @param String objPropery  对象的值
 * @return Array 过滤后的数组
 */
function get(arrPerson, objPropery, objValue) {
    return $.grep(arrPerson, function (cur, i) {
        return cur[objPropery] == objValue;
    });
}

/**
 * 显示对象数组信息
 * @param String info  提示信息
 * @param Array arrPerson  对象数组
 */
function showPersonInfo(info, arrPerson) {
    $.each(arrPerson, function (index, callback) {
        info += "Person id:" + arrPerson[index].id + " name:" + arrPerson[index].name + " sex:" + arrPerson[index].sex + " age:" + arrPerson[index].age + "/r/t";
    });
    alert(info);
}


/*
* 参数说明
* str : 传入的时间戳
* type==1时返回的是日期加时间
* type==2时返回的是日期
* */
function getMyDate(str, type) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds();
    let oTime;
    switch (type) {
        case 1:
            oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
            break;
        case 2:
            oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay);
            break;
    }

    return oTime;
};

//补0操作
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}


//表单输入限制*********************************************************************************


// ----------------------------------------------------------------------
// <summary>
// 限制只能输入数字
// </summary>
// ----------------------------------------------------------------------
$.fn.onlyNum = function () {
    $(this).keypress(function (event) {
        var eventObj = event || e;
        var keyCode = eventObj.keyCode || eventObj.which;
        if ((keyCode >= 48 && keyCode <= 57))
            return true;
        else
            return false;
    }).focus(function () {
        //禁用输入法
        this.style.imeMode = 'disabled';
    }).bind("paste", function () {
        //获取剪切板的内容
        var clipboard = window.clipboardData.getData("Text");
        if (/^\d+$/.test(clipboard))
            return true;
        else
            return false;
    });
};


// ----------------------------------------------------------------------
// <summary>
// 限制只能输入字母
// </summary>
// ----------------------------------------------------------------------
$.fn.onlyAlpha = function () {
    $(this).keypress(function (event) {
        var eventObj = event || e;
        var keyCode = eventObj.keyCode || eventObj.which;
        if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122))
            return true;
        else
            return false;
    }).focus(function () {
        this.style.imeMode = 'disabled';
    }).bind("paste", function () {
        var clipboard = window.clipboardData.getData("Text");
        if (/^[a-zA-Z]+$/.test(clipboard))
            return true;
        else
            return false;
    });
};

// ----------------------------------------------------------------------
// <summary>
// 限制只能输入数字和字母
// </summary>
// ----------------------------------------------------------------------
$.fn.onlyNumAlpha = function () {
    $(this).keypress(function (event) {
        var eventObj = event || e;
        var keyCode = eventObj.keyCode || eventObj.which;
        if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122))
            return true;
        else
            return false;
    }).focus(function () {
        this.style.imeMode = 'disabled';
    }).bind("paste", function () {
        var clipboard = window.clipboardData.getData("Text");
        if (/^(\d|[a-zA-Z])+$/.test(clipboard))
            return true;
        else
            return false;
    });
};


const sortby = (attr, rev) => {
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }

    return (a, b) => {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }

};

/*
* list 排序
*
* list  :  要排序的数组
* attr  :  根据对象的哪个参数进行排序
* rev   :  降序还是升序(true为升序,,false为降序)
* */


const tosort = (list, attr, rev) => {
    list.sort(sortby(attr, rev));
};


/*
* 阿拉伯数字转为大写数字
* 参数说明
* str  :  要转为大写的阿拉伯数字
* */
const smallTobig = (str) => {
    let a = "";
    switch (str) {
        case 0:
            a = "零";
            break;
        case 1:
            a = "壹";
            break;
        case 2:
            a = "贰";
            break;
        case 3:
            a = "叁";
            break;
        case 4:
            a = "肆";
            break;
        case 5:
            a = "伍";
            break;
        case 6:
            a = "陆";
            break;
        case 7:
            a = "柒";
            break;
        case 8:
            a = "捌";
            break;
        case 9:
            a = "玖";
            break;
        case 10:
            a = "拾";
            break;
        case 100:
            a = "佰";
            break;
        case 1000:
            a = "仟";
            break;
        case "0":
            a = "零";
            break;
        case "1":
            a = "壹";
            break;
        case "2":
            a = "贰";
            break;
        case "3":
            a = "叁";
            break;
        case "4":
            a = "肆";
            break;
        case "5":
            a = "伍";
            break;
        case "6":
            a = "陆";
            break;
        case "7":
            a = "柒";
            break;
        case "8":
            a = "捌";
            break;
        case "9":
            a = "玖";
            break;
        case "10":
            a = "拾";
            break;
        case "100":
            a = "佰";
            break;
        case "1000":
            a = "仟";
            break;
    }
    return a;
};





//  使用方法
//
// $(function () {
// // 限制使用了onlyNum类样式的控件只能输入数字
// $(".onlyNum").onlyNum();
// //限制使用了onlyAlpha类样式的控件只能输入字母
// $(".onlyAlpha").onlyAlpha();
// // 限制使用了onlyNumAlpha类样式的控件只能输入数字和字母
// $(".onlyNumAlpha").onlyNumAlpha();
// });
//
//
// <ul>
//          <li>只能输入数字：<input type="text" class="onlyNum" /></li>
//          <li>只能输入字母：<input type="text" class="onlyAlpha" /></li>
//          <li>只能输入数字和字母：<input type="text" class="onlyNumAlpha" /></li>
// </ul>


//表单输入限制结束**************************************************************************************


//
// //表单验证
// layui.use(['form'],function () {
//     var formVerify = layui.form;
//     formVerify.verify({
//         idNumber: function(value, item){ //value：表单的值、item：表单的DOM对象
//             if(!testId(value)){
//                 return '身份证格式有误';
//             }
//         }
//     });
// });

