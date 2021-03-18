/*TMODJS:{"version":"1.0.0"}*/
!function () {

    function template (filename, content) {
        return (
            /string|function/.test(typeof content)
            ? compile : renderFile
        )(filename, content);
    };


    var cache = template.cache = {};
    var String = window.String;

    function toString (value, type) {

        if (typeof value !== 'string') {

            type = typeof value;
            if (type === 'number') {
                value += '';
            } else if (type === 'function') {
                value = toString(value.call(value));
            } else {
                value = '';
            }
        }

        return value;

    };


    var escapeMap = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };


    function escapeFn (s) {
        return escapeMap[s];
    }


    function escapeHTML (content) {
        return toString(content)
        .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    };


    var isArray = Array.isArray || function(obj) {
        return ({}).toString.call(obj) === '[object Array]';
    };


    function each (data, callback) {
        if (isArray(data)) {
            for (var i = 0, len = data.length; i < len; i++) {
                callback.call(data, data[i], i, data);
            }
        } else {
            for (i in data) {
                callback.call(data, data[i], i);
            }
        }
    };


    function resolve (from, to) {
        var DOUBLE_DOT_RE = /(\/)[^/]+\1\.\.\1/;
        var dirname = ('./' + from).replace(/[^/]+$/, "");
        var filename = dirname + to;
        filename = filename.replace(/\/\.\//g, "/");
        while (filename.match(DOUBLE_DOT_RE)) {
            filename = filename.replace(DOUBLE_DOT_RE, "/");
        }
        return filename;
    };


    var utils = template.utils = {

        $helpers: {},

        $include: function (filename, data, from) {
            filename = resolve(from, filename);
            return renderFile(filename, data);
        },

        $string: toString,

        $escape: escapeHTML,

        $each: each
        
    };


    var helpers = template.helpers = utils.$helpers;


    function renderFile (filename, data) {
        var fn = template.get(filename) || showDebugInfo({
            filename: filename,
            name: 'Render Error',
            message: 'Template not found'
        });
        return data ? fn(data) : fn; 
    };


    function compile (filename, fn) {

        if (typeof fn === 'string') {
            var string = fn;
            fn = function () {
                return new String(string);
            };
        }

        var render = cache[filename] = function (data) {
            try {
                return new fn(data, filename) + '';
            } catch (e) {
                return showDebugInfo(e)();
            }
        };

        render.prototype = fn.prototype = utils;
        render.toString = function () {
            return fn + '';
        };

        return render;
    };


    function showDebugInfo (e) {

        var type = "{Template Error}";
        var message = e.stack || '';

        if (message) {
            // 利用报错堆栈信息
            message = message.split('\n').slice(0,2).join('\n');
        } else {
            // 调试版本，直接给出模板语句行
            for (var name in e) {
                message += "<" + name + ">\n" + e[name] + "\n\n";
            }  
        }

        return function () {
            if (typeof console === "object") {
                console.error(type + "\n\n" + message);
            }
            return type;
        };
    };


    template.get = function (filename) {
        return cache[filename.replace(/^\.\//, '')];
    };


    template.helper = function (name, helper) {
        helpers[name] = helper;
    };


    if (typeof define === 'function') {define(function() {return template;});} else if (typeof exports !== 'undefined') {module.exports = template;} else {this.template = template;}
    
    /*v:1*/
template('detail',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,product=$data.product,$each=$utils.$each,l=$data.l,$index=$data.$index,r=$data.r,item=$data.item,$string=$utils.$string,option=$data.option,i=$data.i,$out='';$out+='<div class="nav-bar">\n  <div class="container">\n    <h2>';
$out+=$escape(product.detailItem.product_info.name);
$out+='</h2>\n    <div class="con clearfix">\n      <div class="left">\n        ';
$each(product.left,function(l,$index){
$out+='\n        <span class="separator">|</span>\n        <a href="';
$out+=$escape(l.url);
$out+='">';
$out+=$escape(l.title);
$out+='</a>\n        ';
});
$out+='\n\n      </div>\n      <div class="right">\n        ';
$each(product.right,function(r,$index){
$out+='\n        <a href="';
$out+=$escape(r.url);
$out+='">';
$out+=$escape(r.title);
$out+='</a>\n        <span class="separator">|</span>\n        ';
});
$out+='\n        <a href="#">用户评价</a>\n\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class="mi-detail">\n  <div class="page-box">\n    <div class="product-box container">\n      <div class="img-left">\n        <div class="product-img-list">\n          <div class="swiper-container">\n            <div class="swiper-wrapper">\n              ';
$each(product.detailItem.goods_list[0].goods_info.imgs,function(item,$index){
$out+='\n              <div class="swiper-slide">\n                <img src="';
$out+=$escape(item);
$out+='" alt="">\n              </div>\n              ';
});
$out+='\n            </div>\n            <div class="swiper-pagination"></div>\n            <div class="swiper-button-next"></div>\n            <div class="swiper-button-prev"></div>\n          </div>\n        </div>\n      </div>\n      <div class="product-con">\n        <h2>';
$out+=$escape(product.detailItem.product_info.name);
$out+='</h2>\n        <p class="sale-desc">\n          ';
$out+=$string(product.detailItem.product_info.product_desc);
$out+='\n        </p>\n        <p class="company-info">';
$out+=$escape(product.detailItem.goods_list[0].after_sale_info.company_info.name);
$out+='</p>\n        <div class="price-info">\n          ';
$out+=$escape(product.detailItem.goods_list[0].goods_info.price);
$out+=' 元\n        </div>\n        <div class="line"></div>\n        <div class="buy-option">\n\n          ';
$each(product.detailItem.buy_option,function(option,$index){
$out+='\n\n          <div class="buy-box-child">\n            <div class="option-box">\n              <div class="title">选择';
$out+=$escape(option.name);
$out+='</div>\n              <ul class="clearfix">\n                ';
$each(option.list,function(item,i){
$out+='\n                <li class="';
$out+=$escape(i===0 ? 'active' : '');
$out+='">\n                  <a href="#">';
$out+=$escape(item.name);
$out+='</a>\n                </li>\n                ';
});
$out+='\n\n              </ul>\n            </div>\n          </div>\n\n          ';
});
$out+='\n\n          <!-- <div class="buy-box-child">\n            <div class="option-box">\n              <div class="title">选择产品</div>\n              <ul class="clearfix">\n                <li>\n                  <a href="#">Redmi Note 9 4G</a>\n                </li>\n                <li class="active">\n                  <a href="#">Redmi Note 9 4G</a>\n                </li>\n                <li>\n                  <a href="#">Redmi Note 9 4G</a>\n                </li>\n              </ul>\n            </div>\n          </div>\n          <div class="buy-box-child">\n            <div class="option-box">\n              <div class="title">选择版本</div>\n              <ul class="clearfix">\n                <li>\n                  <a href="#">6GB+128GB</a>\n                </li>\n                <li class="active">\n                  <a href="#">6GB+128GB</a>\n                </li>\n                <li>\n                  <a href="#">6GB+128GB</a>\n                </li>\n              </ul>\n            </div>\n          </div>\n          <div class="buy-box-child">\n            <div class="option-box">\n              <div class="title">选择颜色</div>\n              <ul class="clearfix">\n                <li>\n                  <a href="#">云墨灰</a>\n                </li>\n                <li class="active">\n                  <a href="#">云墨灰</a>\n                </li>\n                <li>\n                  <a href="#">云墨灰</a>\n                </li>\n              </ul>\n            </div>\n          </div> -->\n        </div>\n        <div class="selected-list">\n          <ul>\n            <li>Redmi Note 9 5G 8GB+128GB 青山外\n              <span>1499元</span>\n            </li>\n          </ul>\n          <div class="total-price">总计：1499元</div>\n        </div>\n        <div class="btn-box">\n          <div class="sale-btn">\n            <a href="#" class="btn btn-primary">加入购物车</a>\n          </div>\n          <div class="favorite-btn">\n            <a class="btn-gray btn-like">\n              <i class="iconfont default"></i>\n              <i class="iconfont iconfont-heart-outline red">\n                <i class="iconfont redsd"></i>\n              </i>喜欢\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>';
return new String($out);
});

}()