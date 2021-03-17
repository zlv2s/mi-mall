const header = `
<div class="site-topbar">
<div class="container">
  <div class="topbar-nav">
    <a href="#">小米商城</a>
    <span class="sep">|</span>
    <a href="#">MIUI</a>
    <span class="sep">|</span>
    <a href="#">IoT</a>
    <span class="sep">|</span>
    <a href="#">云服务</a>
    <span class="sep">|</span>
    <a href="#">天星数科</a>
    <span class="sep">|</span>
    <a href="#">有品</a>
    <span class="sep">|</span>
    <a href="#">小爱开放平台</a>
    <span class="sep">|</span>
    <a href="#">企业团购</a>
    <span class="sep">|</span>
    <a href="#">资质证照</a>
    <span class="sep">|</span>
    <a href="#">协议规则</a>
    <span class="sep">|</span>
    <a href="#" class="topbar-download">下载app
      <span class="appcode"><img src="http://i1.mifile.cn/f/i/17/appdownload/download.png?1" alt="小米商城" width="90"
          height="90">
        小米商城APP
      </span>
    </a>
    <span class="sep">|</span>
    <a href="#">智能生活</a>
    <span class="sep">|</span>
    <a href="#">Select Location</a>
  </div>
  <div class="topbar-cart ">
    <a href="#" class="cart-mini">
      <i class="iconfont-cart"></i>
      购物车
      <span class="cart-mini-num">（0）</span>
    </a>
  </div>
  <div class="topbar-info">
    <a href="/login.html" class="link">登录</a>
    <span class="sep">|</span>
    <a href="#" class="link">注册</a>
    <span class="sep">|</span>
    <a href="#" class="message">消息通知</a>
  </div>
</div>
</div>
<div class="site-header">
<div class="container">
  <div class="header-logo">
    <a href="#" class="logo ir">小米官网</a>
  </div>
  <div class="header-nav">
    <ul class="nav-list">
      <li class="nav-category">
        <a href="#" class="link-category">
          <span>全部商品分类</span>
        </a>
        <div class="site-category">
          <ul class="category-list ${
            window.location.href.includes('index.html') ||
            window.location.pathname === '/'
              ? 'home-category-list'
              : ''
          }">
            
          </ul>
        </div>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>小米手机</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>Redmi 红米</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>电视</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>笔记本</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>家电</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>路由器</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>智能硬件</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>服务</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="link">
          <span>社区</span>
        </a>
      </li>
    </ul>
  </div>
  <div class="header-search">
    <form class="search-form">
      <input type="search" name="keyword" class="search-text" placeholder="3.8女神节手机特惠专场">
      <input type="submit" value="&#xe616;" class="search-btn iconfont">
    </form>
  </div>
</div>
</div>
`

const renderCatItem = item => {
  return $(`
  <li class="category-item">
  <a href=${item.link} class="title">
    ${item.title}
    <i class="iconfont-arrow-right-big"></i>
  </a>
  <div class="children">
   
    ${item.children.length > 0 ? renderChildren(item.children) : ''}       
  
  </div>
  </li>`)
}

const renderChildren = children =>
  chunkArray(children, 6).flatMap(renderChild).join('')

const renderChild = child => {
  return `
  <ul class="children-list"> 
   ${child
     .map(
       x =>
         `<li><a class="link clearfix" href=${x.link}><img class="thumb" src=${x.imgUrl} alt=""><span class="text">${x.goodsName}</span></a></li>`
     )
     .join('')}
  </ul>`
}

const renderCategory = categoryList => categoryList.map(renderCatItem)

const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i + size)
  )

function renderHeader(categoryList) {
  $('body').prepend($(header))
  $('.category-list').append(renderCategory(categoryList))
}

$.ajax({
  url: 'http://localhost:3030/api/mi-mall/product/catList',
  success(res) {
    renderHeader(res.data)
  }
})
