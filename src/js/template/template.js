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
template('addressItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,addressList=$data.addressList,item=$data.item,$index=$data.$index,$escape=$utils.$escape,$out='';$out+='<ul> ';
$each(addressList,function(item,$index){
$out+=' <li data-adcode="';
$out+=$escape(item.adcode);
$out+='" data-location="';
$out+=$escape(item.location);
$out+='"> <div class="item-info"> <div class="address-name">';
$out+=$escape(item.name);
$out+='</div> <div class="address-desc">';
$out+=$escape(item.pname);
$out+=' ';
$out+=$escape(item.cityname);
$out+=' ';
$out+=$escape(item.adname);
$out+='</div> </div> <a class="btn btn-primary btn-small">选择</a> </li> ';
});
$out+=' </ul>';
return new String($out);
});/*v:1*/
template('cartItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,cartItems=$data.cartItems,item=$data.item,$index=$data.$index,$escape=$utils.$escape,$out='';$each(cartItems,function(item,$index){
$out+=' <div class="item-box clearfix" data-gid="';
$out+=$escape(item.goods_id);
$out+='"> <div class="col col-check"><i class="iconfont icon-checkbox iconfont-check ';
$out+=$escape(item.isChecked ? 'select' : '');
$out+='"></i> </div> <div class="col col-img"><a href="/detail.html?product_id=';
$out+=$escape(item.product_id);
$out+='"><img src="';
$out+=$escape(item.img_url);
$out+='" alt=""></a> </div> <div class="col col-name ellipsis">';
$out+=$escape(item.name);
$out+='</div> <div class="col col-price"><span class="price">';
$out+=$escape(item.price);
$out+='</span>元</div> <div class="col col-num"> <div class="change-num clearfix"> <a data-change="-1" href="javascript:void(0)"><i class="iconfont">&#xe60b;</i></a> <input type="text" value="';
$out+=$escape(item.num);
$out+='"> <a data-change="1" href="javascript:void(0)"><i class="iconfont">&#xe609;</i></a> </div> </div> <div class="col col-total"><span class="price">';
$out+=$escape(item.totalPrice);
$out+='</span>元</div> <div class="col col-action"><a href="javascript:void(0)"><i class="iconfont">&#xe602;</i></a> </div> </div> ';
});
return new String($out);
});/*v:1*/
template('cartRecItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,recomList=$data.recomList,recom=$data.recom,$index=$data.$index,$escape=$utils.$escape,$out='';$each(recomList,function(recom,$index){
$out+=' <li class="recommend-item" data-gid="';
$out+=$escape(recom.goods_list[0]);
$out+='" data-pid="';
$out+=$escape(recom.product_id);
$out+='"> <a href="/detail.html?product_id=';
$out+=$escape(recom.product_id);
$out+='"> <img src="';
$out+=$escape(recom.image);
$out+='" alt=""> <p class="recommend-name">';
$out+=$escape(recom.name);
$out+='</p> <p class="recommend-price">';
$out+=$escape(recom.price);
$out+='元</p> <p class="recommend-tips">';
$out+=$escape(recom.comments);
$out+='人好评</p> </a> <div class="recommend-action"> <a href="javascript:void(0);" class="btn btn-small btn-line-primary">加入购物车</a> </div> <div class="recommend-notice"><a class="btn btn-block btn-green btn-notice">成功加入购物车</a></div> </li> ';
});
return new String($out);
});/*v:1*/
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
template('checkoutItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,checkoutList=$data.checkoutList,checkoutItem=$data.checkoutItem,$index=$data.$index,$escape=$utils.$escape,$out='';$each(checkoutList,function(checkoutItem,$index){
$out+=' <li class="clearfix"> <div class="goods-img"><img src="';
$out+=$escape(checkoutItem.img_url);
$out+='" alt=""></div> <div class="goods-name"><a href="#">';
$out+=$escape(checkoutItem.name);
$out+='</a></div> <div class="goods-price">';
$out+=$escape(checkoutItem.price);
$out+='元 x ';
$out+=$escape(checkoutItem.num);
$out+='</div> <div class="goods-total">';
$out+=$escape(checkoutItem.totalPrice);
$out+='元</div> </li> ';
});
return new String($out);
});/*v:1*/
template('countBox',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,countData=$data.countData,$out='';$out+='<div class="count-box"> <ul> <li> <label>商品件数：</label> <span><span class="total-quantity">';
$out+=$escape(countData.totalCount);
$out+='</span>件</span> </li> <li> <label>商品总价：</label> <span class="total-price"><span class="price">';
$out+=$escape(countData.goodsTotal);
$out+='</span>元</span> </li> <li> <label>活动优惠：</label> <span>-';
$out+=$escape(countData.discount);
$out+='元</span> </li> <li> <label>优惠券抵扣：</label> <span>-';
$out+=$escape(countData.coupon);
$out+='元</span> </li> <li> <label>运费：</label> <span>';
$out+=$escape(countData.shipFee);
$out+='元</span> </li> <li class="total-price"> <label>应付总额：</label> <span><em class="price">';
$out+=$escape(countData.grandTotalPrice);
$out+='</em>元</span> </li> </ul> </div>';
return new String($out);
});/*v:1*/
template('detail',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,product=$data.product,$each=$utils.$each,l=$data.l,$index=$data.$index,r=$data.r,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},imgList=$data.imgList,$string=$utils.$string,option=$data.option,item=$data.item,i=$data.i,$out='';$out+='<div class="nav-bar"> <div class="container"> <h2>';
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
$out+=' <a href="https://www.mi.com/comment/12511.html">用户评价</a> </div> </div> </div> </div> <div class="mi-detail"> <div class="page-box"> <div class="product-box container"> <div class="img-left"> <div class="product-img-list"> <div class="swiper-container"> <div class="swiper-wrapper"> ';
include('./detailSwiper',{imgList:product.detailItem.goods_list[0].goods_info.imgs},);
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
$out+=' <div class="buy-box-child"> <div class="option-box" data-oid="';
$out+=$escape(option.prop_cfg_id);
$out+='"> <div class="title">选择';
$out+=$escape(option.name);
$out+='</div> <ul class="clearfix"> ';
$each(option.list,function(item,i){
$out+=' <li class="';
$out+=$escape(i===0 ? 'active' : '');
$out+='" data-pid="';
$out+=$escape(item.prop_value_id);
$out+='"> <a href="#">';
$out+=$escape(item.name);
$out+='</a> </li> ';
});
$out+=' </ul> </div> </div> ';
});
$out+='  </div> <div class="selected-list"> <ul> <li>';
$out+=$escape(product.detailItem.goods_list[0].goods_info.name);
$out+=' <span>';
$out+=$escape(product.detailItem.goods_list[0].goods_info.price);
$out+='元</span> </li> </ul> <div class="total-price">总计：';
$out+=$escape(product.detailItem.goods_list[0].goods_info.price);
$out+='元</div> </div> <div class="btn-box"> <div class="sale-btn"> <a href="#" class="btn btn-primary">加入购物车</a> </div> <div class="favorite-btn"> <a class="btn-gray btn-like"> <i class="iconfont iconfont-heart-outline default"></i> <i class="iconfont iconfont-heart-outline red"> <i class="iconfont redsd"></i> </i>喜欢 </a> </div> </div> </div> </div> </div> </div>';
return new String($out);
});/*v:1*/
template('detailSwiper',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,imgList=$data.imgList,item=$data.item,$index=$data.$index,$escape=$utils.$escape,$out='';$each(imgList,function(item,$index){
$out+=' <div class="swiper-slide"> <img src="';
$out+=$escape(item);
$out+='" alt=""> </div> ';
});
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
$out+='</span> <del>';
$out+=$escape(product.product_org_price);
$out+='</del> </p> </a> </li> ';
});
$out+=' </ul> ';
});
$out+=' </div> </div> </div> </div> ';
}
$out+=' ';
});
return new String($out);
});/*v:1*/
template('formBody',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,address=$data.address,$out='';$out+='<div class="form-body"> <div class="item"> <div class="col mr mi-input"> <label class="input-label" for="name">姓名</label> <input name="name" type="text" class="input-text" value="';
$out+=$escape(address ? address.consignee : '');
$out+='"> <p class="msg msg-error" style="display: none;"></p> <span class="iconfont-circle-close icon-error" style="display: none;"></span> </div> <div class="col mi-input"> <label for="telephone" class="input-label">手机号</label> <input name="telephone" type="text" class="input-text" value="';
$out+=$escape(address ? address.telephone : '');
$out+='"> <p class="msg msg-error" style="display: none;"></p> <span class="iconfont-circle-close icon-error" style="display: none;"></span> </div> </div> <div class="item address-info-box"> <div class="col mi-input"> <label class="input-label" for="address"></label> <input type="text" name="address" placeholder="选择省 / 市 / 区 / 街道" readonly="readonly" maxlength="" autocomplete="off" class="input-text show-placeholder" value="';
$out+=$escape(address ? address.province_name + ' ' + address.city_name + ' ' + address.district_name + ' ' + address.area_name : '');
$out+='"> <p class="msg msg-error" style="display: none;"></p> <span class="iconfont-circle-close icon-error" style="display: none;"></span> </div> <i class="iconfont iconfont-arrow-down-small"></i> <div class="address-select-box"> <div class="con"> <i class="iconfont iconfont-close-small"></i> <div class="search-address"> <i class="iconfont iconfont-search"></i> <div class="col search-input mi-input "> <label for="search" class="input-label"></label> <input type="text" name="search" placeholder="输入街道、乡镇、小区或商圈名称" maxlength="" autocomplete="off" class="input-text show-placeholder" style="height: 44px; padding-left: 45px;"> <i class="iconfont iconfont-circle-close clear"></i> <p class="msg msg-error" style="display: none;"></p> <span class="iconfont-circle-close icon-error" style="display: none;"></span> </div> <div class="search-example">例如：北京 华润五彩城</div> <div class="result-box"> <div class="result-list"> </div> </div> </div> </div> </div> </div> <div class="item"> <div class="col mi-input"> <label class="input-label" for="addressInfo">详细地址</label> <textarea name="addressInfo" placeholder="详细地址，路名或街道名称，门牌号" maxlength="" autocomplete="off" class="input-text">';
$out+=$escape(address ? address.address : '');
$out+='</textarea> <p class="msg msg-error" style="display: none;"></p> <span class="iconfont-circle-close icon-error" style="display: none;"></span> </div> </div> <div class="item"> <div class="col mi-input"> <label class="input-label" for="addresstag">地址标签</label> <input type="text" name="addresstag" placeholder="如&quot;家&quot;、&quot;公司&quot;。限5个字内" maxlength="" autocomplete="off" class="input-text" value="';
$out+=$escape(address ? address.tag_name : '');
$out+='"> <p class="msg msg-error" style="display: none;"></p> <span class="iconfont-circle-close icon-error" style="display: none;"></span> </div> </div> </div>';
return new String($out);
});/*v:1*/
template('mi-popup',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,title=$data.title,$string=$utils.$string,body=$data.body,$out='';$out+='<div class="mi-popup__mask"> </div> <div class="mi-popup__box"> <div class="mi-popup__header"> <span class="title">';
$out+=$escape(title);
$out+='</span> </div> <div class="header-btn"> <i class="mi-close iconfont iconfont-close"></i> </div> <div class="mi-popup__body">';
$out+=$string(body);
$out+='</div> <div class="mi-popup__footer"> <button class="btn btn-primary">确定</button> <button class="btn btn-gray">取消</button> </div> </div>';
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
$out+='</span> <del>';
$out+=$escape(product.product_org_price);
$out+='</del> </p> </a> </li> ';
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
template('subHeader',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,title=$data.title,$out='';$out+='<div class="sub-header"> <div class="container"> <div class="header-logo"> <a href="/" class="logo ir">小米官网</a> </div> <div class="header-title"> <h2>';
$out+=$escape(title);
$out+='</h2> <p>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</p> </div> <div class="header-info"> <span class="c-user"> <span class="user"> <a class="user-name" href=""> <span class="name"></span> <i class="iconfont-arrow-down-mini"></i> </a> <div class="user-menu-wrapper"> <ul class="user-menu"> <li><a href="#">个人中心</a></li> <li><a href="#">评价晒单</a></li> <li><a href="#">我的喜欢</a></li> <li><a href="#">小米账户</a></li> <li><a id="signOut" href="javascript:void(0);">退出登录</a></li> </ul> </div> </span> <span class="sep">|</span> <a href="#" class="link link-order">我的订单</a> </span> <span class="c-login"><a class="link" href="/login.html">登录</a> <span class="sep">|</span> <a class="link" href="/login.html#register">注册</a></span> </div> </div> </div>';
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
});/*v:1*/
template('userAddressItem',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,userAddressList=$data.userAddressList,addressItem=$data.addressItem,$index=$data.$index,$escape=$utils.$escape,$out='';$each(userAddressList,function(addressItem,$index){
$out+=' <div class="address-item" data-aid="';
$out+=$escape(addressItem.addressId);
$out+='"> <div class="address-info"> <div class="name">';
$out+=$escape(addressItem.consignee);
$out+='<span style="color: rgb(176, 176, 176);">';
$out+=$escape(addressItem.tag_name);
$out+='</span> </div> <div class="tel">';
$out+=$escape(addressItem.telephone);
$out+='</div> <div class="address-con"> <span>';
$out+=$escape(addressItem.province_name);
$out+='</span> <span>';
$out+=$escape(addressItem.city_name);
$out+='</span> <span>';
$out+=$escape(addressItem.district_name);
$out+='</span> <span>';
$out+=$escape(addressItem.area_name);
$out+='</span> <span class="info">';
$out+=$escape(addressItem.address);
$out+='</span> </div> <div class="address-action"> <span id="edit">修改</span> <span id="del">删除</span> </div> </div> <div class="address-info-solt" style="display: none;"></div> </div> ';
});
$out+=' <div class="address-item address-new"> <i class="iconfont">&#xe609;</i> 添加新地址 </div>';
return new String($out);
});

}()