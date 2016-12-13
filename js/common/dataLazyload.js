/**
 * author:  lirong on 16/11/20.
 * description:移动端下拉分页组件
 */

!function ($) {
    "use strict";

    //设置map,key,value内容
    function setData(jq, key, value) {
        var array = $(jq).data("lazyData");
        array[key] = value;
        $(jq).data("lazyData", array);
    }

    //取某一key里面的内容
    function getData(jq, param) {
        var lzyData = $(jq).data("lazyData");
        if (!!lzyData) {
            return lzyData[param];
        }
        else {
            return "";
        }
    }

    //加载数据
    function loadData(jq) {

        var pams = getData(jq, "options");
        if (!!pams) {
            if ($.isFunction(pams.success)) {
                pams.success(jq, pams);
            }
        }


    }

    //判断是否加载下一页数据
    function loadMoreList(jq) {
        var pams = getData(jq, "options");

        if (!!pams) {
        	
            var btm = pams.bottom;
            var h = document.documentElement.offsetHeight || document.body.offsetHeight, iH = window.innerHeight;
            if (window.pageYOffset + iH + btm >= h) {
                if (pams.pageNumber < pams.totalPage && pams.pageNumber > 0 && pams.totalPage > 0) {
                    pams.pageNumber += 1;
                    $(jq).data("lazyData").options.pageNumber = pams.pageNumber;
                    loadData(jq, pams.pageNumber);
                }
            }
        }
    }

    //监听事件,只能这样写,要不无法移除
    function scrollTopFun(jq) {
        loadMoreList(jq);
        setStation(jq);
    }

    //监听是否加载更多数据和定位
    function eventListener(jq) {
        $(window).off("scroll");
        $(window).on("scroll", function () {
            scrollTopFun(jq);
        });
    }

    //记录当前位置
    function setStation(jq) {

        var pams = getData(jq, "options");
        if (!!pams && (!!pams.isApp || !!!device.isApp)) {
            if (pams.isSetStation == true) {
                var sTop = $(window).scrollTop();

                if (!!window.sessionStorage) {
                    var name = !!$(jq).className ? $(jq).className : $(jq).attr("id");
                    if (!!!name) {
                        name = $(jq)[0].getElementsByTagName();
                    }
                    sessionStorage.setItem("lazyData_" + name + "_" + $(jq).index() + "_sTop", sTop);
                    sessionStorage.setItem("lazyData_" + name + "_" + $(jq).index() + "_pageNumber", pams.pageNumber);
                }
            }
        }
    }

    //设置插件定义
    $.fn.dataLazyload = function (options, params) {
        if (typeof options == "string") {
            return $.fn.dataLazyload.method[options](this, params);
        }
        else {
            $(this).each(function () {
                var pams = getData(this, "options");
                if (!!pams) {
                    $.fn.dataLazyload.method["reinit"](this, options);
                }
                else {
                    $.fn.dataLazyload.method["init"](this, options);
                }
            });
        }


    };
    //初始化数据


    $.fn.dataLazyload.method = {
        //初始化参数
        initData: function (jq) {
            $(jq).data("lazyData", {
                defaults: {
                    pageSize: 10,//每页的数量
                    pageNumber: 1,//当前页码
                    totalPage: 2,//总页数
                    url: "?",//页面请求url
                    isReset:false,//是否要重新重置数据
                    isApp: false,//定位的时候用到,是否app也支持h5定位
                    bottom: 100,//距离底部多高的距离加载下一页请求
                    isSetStation: false,//是否需要页面定位仅支持h5页面定位记录
                    success: function (jq, data) {//数据执行的回调函数
                    }
                }
            });

        },

        //重新设置加载页面页码
        pageNumber: function (jq, param) {
            var pams = getData(jq, "options");
            if (!!pams) {
                if (!!param) {
                    $(jq).data("lazyData").options.pageNumber = param;
                }
                else {
                    return $(jq).data("lazyData").options.pageNumber;
                }

            }
        },
        //重置总页数
        totalPage: function (jq, param) {
            var pams = getData(jq, "options");
            if (!!pams) {
                if (!!param) {
                    $(jq).data("lazyData").options.totalPage = param;
                } else {
                    return $(jq).data("lazyData").options.totalPage;
                }
            }
        },
        //重置每页分页数据
        pageSize: function (jq, param) {
            var pams = getData(jq, "options");
            if (!!pams) {

                if (!!param) {
                    $(jq).data("lazyData").options.pageSize = param;
                } else {
                    return $(jq).data("lazyData").options.pageSize;
                }
            }

        },
        //重置申请的url地址
        url: function (jq, param) {
            var pams = getData(jq, "options");
            if (!!pams) {
                if (!!param) {
                    $(jq).data("lazyData").options.url = param;
                } else {
                    return $(jq).data("lazyData").options.url;
                }
            }
        },

        //初始化定义数据
        init: function (jq, params) {
            $.fn.dataLazyload.method["initData"](jq);
            $(jq).data("lazyData", {options: $.extend({}, $(jq).data("lazyData").defaults, params)});
            setData(jq, "tempPageNum", $(jq).data("lazyData").options.pageNumber);

            var getStation = $.fn.dataLazyload.method["scrollTo"](jq);
            eventListener(jq);
            var pams = getData(jq, "options");
            if ((!!pams.isApp || !!!device.isApp) && !!getStation && !!getStation.pageTop && !!getStation.pageNum) {
                if (getStation.pageNum > 1&&(pams.totalPage>1&&getStation.tempPageNum>1)) {
                    for (var i = getStation.tempPageNum; i <= getStation.pageNum; i++) {

                    	$.fn.dataLazyload.method["pageNumber"](jq, i);
                        loadData(jq);
                        var currentScrolltop=$(window).scrollTop();
                        if(currentScrolltop>=getStation.pageTop){
                            break;
                        }
                    }
                }
                else{
                	
                	if(!(pams.pageNumber>1)){  //如果请求的页面从2页开始,则调用时不需要请求数据
                        loadData(jq);
                    }
                    else{
                 	   $(jq).data("lazyData").options.pageNumber=1;//把初始分页重新设置成1,则滚动加载从2页开始
                     }
                }
                setTimeout(function () {
                    $(window).scrollTop(getStation.pageTop);
                }, 0);
            }
            else {

               if(!(pams.pageNumber>1)){  //如果请求的页面从2页开始,则调用时不需要请求数据
                   loadData(jq);
               }
               else{
            	   $(jq).data("lazyData").options.pageNumber=1;//把初始分页重新设置成1,则滚动加载从2页开始
                   
               }
                setStation(jq);
            }
        },
        //重置初始化数据
        reinit: function (jq, params) {
            setData(jq, "options", $.extend({}, $(jq).data("lazyData").options, params));
            setData(jq, "tempPageNum", $(jq).data("lazyData").options.pageNumber);
            var pams = getData(jq, "options");
            if(pams.isReset){  //如果点击切抱分页列表,不需要重新加载数据,则不走里面的代码,也不需要重新定位
                $(jq).children().remove();
                eventListener(jq);

                if (pams.isSetStation == true) {
                    if (!!window.sessionStorage) {
                        var name = !!$(jq).className ? $(jq).className : $(jq).attr("id");
                        if (!!!name) {
                            name = $(jq)[0].getElementsByTagName();
                        }
                        sessionStorage.setItem("lazyData_" + name + "_" + $(jq).index() + "_sTop", 0);
                        sessionStorage.setItem("lazyData_" + name + "_" + $(jq).index() + "_pageNumber", pams.pageNumber);
                    }
                }

                loadData(jq);

                setStation(jq);
            }



        },
        //取得当前页面定位数据信息
        scrollTo: function (jq) {
            var pams = getData(jq, "options");
            if ((!!pams.isApp || !!!device.isApp) && !!window.sessionStorage) {
                var name = !!$(jq).className ? $(jq).className : $(jq).attr("id");
                if (!!!name) {
                    name = $(jq)[0].getElementsByTagName();
                }

                var pageTop = sessionStorage.getItem("lazyData_" + name + "_" + $(jq).index() + "_sTop");
                var pageNum = sessionStorage.getItem("lazyData_" + name + "_" + $(jq).index() + "_pageNumber");
                var tempPageNum = getData(jq, "tempPageNum");
                return {pageTop: pageTop, pageNum: pageNum, tempPageNum: tempPageNum};
            }
            else {
                return {pageTop: null, pageNum: null, tempPageNum: null};
            }
        }
    };
}(Zepto);