# loadData
移动端下拉加载分页，支持h5定位
```
$(obj).dataLazyload({
                    pageSize: 10,//每页的数量,这个参数没有用到
                    pageNumber: 1,//当前页码
                    totalPage: 2,//总页数
                    url: "?",//页面请求url
                    isApp: false,//定位的时候用到,是否app也支持h5定位
                    bottom: 80,//距离底部多高的距离加载下一页请求
                    isSetStation: false,//是否需要页面定位仅支持h5页面定位记录
                    success: function (jq, data) {//数据执行的回调函数  
                        ajax读取数据，展示数据，
                        async: false,//写成同步,这样,再数据执行完才有下一步的操作,异步的话,定位会有不准确
                    });
```


h5分页是采用sessonStorage来记录位置的，全名是以lazyData_开头的以_sTop，_pageNumber为结尾。

```
 var name = !!$(jq).className ? $(jq).className : $(jq).attr("id");
                    if (!!!name) {
                        name = $(jq)[0].getElementsByTagName();
                    }
                    sessionStorage.setItem("lazyData_" + name + "_" + $(jq).index() + "_sTop", sTop);
                    sessionStorage.setItem("lazyData_" + name + "_" + $(jq).index() + "_pageNumber", pams.pageNumber);
```



详细内容可以参考demo
