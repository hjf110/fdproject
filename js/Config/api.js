



//正式环境



//测试环境
var baseURL = "http://124.202.145.102:8079/";



var Api = {
    Log:true,
    Demo:{
        list:baseURL+"project/list"//项目列表
        ,submit:baseURL+"project/submit"//提交送审
    }
};


window.Api = Api;