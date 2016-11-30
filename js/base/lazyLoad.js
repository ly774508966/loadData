/**
 * Created by Administrator on 2015/11/9.
 */


;(function(){

    var LazyLoad=function(ele,opt){
        this.element=ele;
        this.defaults={
            'time':'100',
            'src':'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'attr':'data-src',
            'isReadWebp':false
        };

        this.options=$.extend({},this.defaults,opt);

    };


    LazyLoad.prototype={
        init:function(){
            var that=this;
            if ($(that.element).length<0) {
                return;
            };
            var delay = null;
            $(that.element).find("img["+that.options.attr+"]").each(function () {
                var _this = $(this)[0];
                this.onerror = function () {
                    this.className="err-product";
                    this.src =that.options.src ;
                };
                var h = window.innerHeight || window.screen.height;
                var top = $(this).offset().top;
                //alert( window.pageYOffset);
                //alert(top-200 < h + window.pageYOffset);

                if (top-200 < h + window.pageYOffset && _this.getAttribute(that.options.attr) != "done") {
                   var newUrl = _this.getAttribute(that.options.attr);
                  //是否需要加载的时候支持webp图片
                    if (that.options.isReadWebp) {
                        //判断是否支持webp
                        var isBool = getIsSupport();
                       if (isBool) {
                         newUrl += "?from=mobile";
                        }
                    }
                    _this.src =newUrl;
                    _this.setAttribute(that.options.attr, "done");
                    _this.className="opt1";
                }
            });

            this.removeScroll();
            this.bindScroll();

        },
        bindScroll:function(){
            var that=this;
            window.addEventListener("scroll", function () {
                that.scrollLoad(that.element);
            }, false);

        },
        removeScroll:function(){
            var that=this;
            window.removeEventListener("scroll", function () {
                that.scrollLoad(that.element);
            }, false);

        },
        scrollLoad:function(obj){
            var that=this;

            delay = setTimeout(function () {
                $(obj).find("img["+that.options.attr+"]").each(function () {
                    var _this = $(this)[0];
                    if (_this.getAttribute(that.options.attr) == null) {
                        return;
                    }

                    var top = $(this).offset().top;
                    var h = window.innerHeight || window.screen.height;

                    if (window.pageYOffset > top+200 || window.pageYOffset < top - h-200 && _this.getAttribute(that.options.attr) != "done") {
                        clearTimeout(delay);
                        return;
                    }
                    if (window.pageYOffset > top - h-200 && _this.getAttribute(that.options.attr) != "done") {
                        _this.onerror = function () {
                            this.className="err-product";
                            this.src = that.options.src;
                        };
                        var newUrl = _this.getAttribute(that.options.attr);

                        //是否需要加载的时候支持webp图片
                        if (that.options.isReadWebp) {
                            //判断是否支持webp
                            var isBool = getIsSupport();
                            if (isBool) {
                                newUrl += "?from=mobile";
                            }
                        }
                        _this.src =newUrl;
                        _this.setAttribute(that.options.attr, "done");
                        _this.className="opt1";
                    }
                });
            }, that.options.time);

        }


    };

    $.fn.lazyLoad=function(options){
        var scrollLoad=new LazyLoad(this,options);
        return scrollLoad.init();
    }

})();
