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
template('channelItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,channelList=$data.channelList,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$each(channelList,function($value,$index){
$out+=' <li> <a href=';
$out+=$escape($value.link);
$out+='> <img src=';
$out+=$escape($value.imgUrl);
$out+=' alt=';
$out+=$escape($value.value);
$out+='> ';
$out+=$escape($value.value);
$out+=' </a> </li> ';
});
return new String($out);
});/*v:1*/
template('detail',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,product=$data.product,$each=$utils.$each,l=$data.l,$index=$data.$index,r=$data.r,item=$data.item,$string=$utils.$string,option=$data.option,i=$data.i,$out='';$out+='<div class="nav-bar"> <div class="container"> <h2>';
$out+=$escape(product.detailItem.product_info.name);
$out+='</h2> <div class="con clearfix"> <div class="left"> ';
$each(product.left,function(l,$index){
$out+=' <span class="separator">|</span> <a href="';
$out+=$escape(l.url);
$out+='">';
$out+=$escape(l.title);
$out+='</a> ';
});
$out+=' </div> <div class="right"> ';
$each(product.right,function(r,$index){
$out+=' <a href="';
$out+=$escape(r.url);
$out+='">';
$out+=$escape(r.title);
$out+='</a> <span class="separator">|</span> ';
});
$out+=' <a href="#">用户评价</a> </div> </div> </div> </div> <div class="mi-detail"> <div class="page-box"> <div class="product-box container"> <div class="img-left"> <div class="product-img-list"> <div class="swiper-container"> <div class="swiper-wrapper"> ';
$each(product.detailItem.goods_list[0].goods_info.imgs,function(item,$index){
$out+=' <div class="swiper-slide"> <img src="';
$out+=$escape(item);
$out+='" alt=""> </div> ';
});
$out+=' </div> <div class="swiper-pagination"></div> <div class="swiper-button-next"></div> <div class="swiper-button-prev"></div> </div> </div> </div> <div class="product-con"> <h2>';
$out+=$escape(product.detailItem.product_info.name);
$out+='</h2> <p class="sale-desc"> ';
$out+=$string(product.detailItem.product_info.product_desc);
$out+=' </p> <p class="company-info">';
$out+=$escape(product.detailItem.goods_list[0].after_sale_info.company_info.name);
$out+='</p> <div class="price-info"> ';
$out+=$escape(product.detailItem.goods_list[0].goods_info.price);
$out+=' 元 </div> <div class="line"></div> <div class="buy-option"> ';
$each(product.detailItem.buy_option,function(option,$index){
$out+=' <div class="buy-box-child"> <div class="option-box"> <div class="title">选择';
$out+=$escape(option.name);
$out+='</div> <ul class="clearfix"> ';
$each(option.list,function(item,i){
$out+=' <li class="';
$out+=$escape(i===0 ? 'active' : '');
$out+='"> <a href="#">';
$out+=$escape(item.name);
$out+='</a> </li> ';
});
$out+=' </ul> </div> </div> ';
});
$out+='  </div> <div class="selected-list"> <ul> <li>Redmi Note 9 5G 8GB+128GB 青山外 <span>1499元</span> </li> </ul> <div class="total-price">总计：1499元</div> </div> <div class="btn-box"> <div class="sale-btn"> <a href="#" class="btn btn-primary">加入购物车</a> </div> <div class="favorite-btn"> <a class="btn-gray btn-like"> <i class="iconfont default"></i> <i class="iconfont iconfont-heart-outline red"> <i class="iconfont redsd"></i> </i>喜欢 </a> </div> </div> </div> </div> </div> </div>';
return new String($out);
});/*v:1*/
template('floorItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,goodsFloorData=$data.goodsFloorData,item=$data.item,$index=$data.$index,$escape=$utils.$escape,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},productList=$data.productList,tab=$data.tab,l=$data.l,i=$data.i,product=$data.product,$out='';$each(goodsFloorData,function(item,$index){
$out+=' ';
if(item.view_type === 'cells_auto_fill'){
$out+=' <div class="home-banner-box"> <a href=';
$out+=$escape(item.body.items[0].action.path);
$out+='><img src=';
$out+=$escape(item.body.items[0].img_url);
$out+=' alt=""></a> </div> ';
}else if(item.view_type === 'list_eight_product'){
$out+=' <div class="home-brick-box home-brick-row-2-box"> <div class="box-hd"> <h2 class="title">';
$out+=$escape(item.body.floor_name);
$out+='</h2> <div class="more"> <a href=';
$out+=$escape(item.body.action.path);
$out+=' class="more-link"> ';
$out+=$escape(item.body.more_text);
$out+=' <i class="iconfont iconfont-arrow-right-big"></i> </a> </div> </div> <div class="box-bd"> <div class="row"> <div class="span4"> <ul class="brick-promo-list"> <li class="brick-item brick-item-l"> <a href=';
$out+=$escape(item.body.left_ad.items[0].action.path);
$out+='><img src=';
$out+=$escape(item.body.left_ad.items[0].img_url);
$out+=' alt=""></a> </li> </ul> </div> <div class="span16"> <ul class="brick-list"> ';
include('./productItem',{productList:item.body.product_list},);
$out+=' </ul> </div> </div> </div> </div> ';
}else if(item.view_type === 'list_eight_product_tab'){
$out+=' <div class="home-brick-box home-brick-row-2-box"> <div class="box-hd"> <h2 class="title">';
$out+=$escape(item.body.floor_name);
$out+='</h2> <div class="more"> <ul class="tab-list"> ';
$each(item.body.tab_content,function(tab,$index){
$out+=' <li>';
$out+=$escape(tab.tab_name);
$out+='</li> ';
});
$out+=' </ul> </div> </div> <div class="box-bd"> <div class="row"> <div class="span4"> <ul class="brick-promo-list"> ';
$each(item.body.left_ad.items,function(l,$index){
$out+=' <li class="brick-item brick-item-m"> <a href=';
$out+=$escape(l.action.path);
$out+='><img src=';
$out+=$escape(l.img_url);
$out+=' alt=""></a> </li> ';
});
$out+=' </ul> </div> <div class="span16"> ';
$each(item.body.tab_content,function(tab,i){
$out+=' <ul class=\'';
$out+=$escape("brick-list " + (i !== 0 ? "hide" : ''));
$out+='\'> ';
$each(tab.product_list.slice(0,-1),function(product,$index){
$out+=' <li class="brick-item brick-item-m brick-item-m-2"> <a href="';
$out+=$escape('/detail.html?product_id='+product.product_id);
$out+='"> <div class="figure figure-img"><img src="';
$out+=$escape(product.img_url);
$out+='" alt=""></div> <h3 class="title">';
$out+=$escape(product.product_name);
$out+='</h3> <p class="desc">';
$out+=$escape(product.product_brief);
$out+='</p> <p class="price"> <span class="num">';
$out+=$escape(product.product_price);
$out+='</span> <span>';
$out+=$escape(product.product_org_price);
$out+='</span> </p> </a> </li> ';
});
$out+=' </ul> ';
});
$out+=' </div> </div> </div> </div> ';
}
$out+=' ';
});
return new String($out);
});/*v:1*/
template('productItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,productList=$data.productList,product=$data.product,$index=$data.$index,$escape=$utils.$escape,$out='';$each(productList,function(product,$index){
$out+=' <li class="brick-item brick-item-m brick-item-m-2"> <a href=';
$out+=$escape('/detail.html?product_id='+product.product_id);
$out+='> <div class="figure figure-img"><img src=';
$out+=$escape(product.img_url);
$out+=' alt=""></div> <h3 class="title">';
$out+=$escape(product.product_name);
$out+='</h3> <p class="desc">';
$out+=$escape(product.product_brief);
$out+='</p> <p class="price"> <span class="num">';
$out+=$escape(product.product_price);
$out+='</span> <span>';
$out+=$escape(product.product_org_price);
$out+='</span> </p> </a> </li> ';
});
return new String($out);
});/*v:1*/
template('promoItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,promoList=$data.promoList,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$each(promoList,function($value,$index){
$out+=' <li> <a href=';
$out+=$escape($value.link);
$out+='><img src=';
$out+=$escape($value.imgUrl);
$out+=' alt=""></a> </li> ';
});
return new String($out);
});/*v:1*/
template('swiper2Item',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,flashSlideList=$data.flashSlideList,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$each(flashSlideList,function($value,$index){
$out+=' <li class="swiper-slide swiper-no-swiping"> <a href="';
$out+=$escape($value.link);
$out+='"> <div class="content"> <div class="thumb"><img src=';
$out+=$escape($value.img);
$out+=' alt=';
$out+=$escape($value.desc);
$out+=' /></div> <h3 class="title">';
$out+=$escape($value.goods_name);
$out+='</h3> <p class="desc">';
$out+=$escape($value.desc);
$out+='</p> <p class="price"> <span>';
$out+=$escape($value.seckill_Price);
$out+='</span> <del>';
$out+=$escape($value.goods_price);
$out+='</del> </p> </div> </a> </li> ';
});
return new String($out);
});/*v:1*/
template('swiperItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,swiperList=$data.swiperList,swiperItem=$data.swiperItem,$index=$data.$index,$escape=$utils.$escape,$out='';$each(swiperList,function(swiperItem,$index){
$out+=' <div class="swiper-slide"><img src=';
$out+=$escape(swiperItem.imgUrl);
$out+=' /></div> ';
});
return new String($out);
});

}()