define(['jquery', 'api', 'utils', 'common'], function (
  $,
  api,
  utils,
  { checkLogin, onLogin, onLogout }
) {
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
    <a href="/cart.html" class="cart-mini">
      <i class="iconfont-cart"></i>
      购物车
      <span class="cart-mini-num">（0）</span>
    </a>
  </div>
  <div class="topbar-info">
    <span class="user">
      <a class="user-name" href="">
        <span class="name"></span>
        <i class="iconfont-arrow-down-mini"></i>
      </a>
      <div class="user-menu-wrapper">
        <ul class="user-menu">
          <li><a href="#">个人中心</a></li>
          <li><a href="#">评价晒单</a></li>
          <li><a href="#">我的喜欢</a></li>
          <li><a href="#">小米账户</a></li>
          <li><a id="signOut" href="#">退出登录</a></li>
        </ul>
      </div>
    </span>
    <a href="/login.html" class="link">登录</a>
    <span class="sep">|</span>
    <a href="/login.html#register" class="link">注册</a>
    <span class="sep">|</span>
    <a href="#" class="message">消息通知</a>
    <span class="sep">|</span>
    <a href="#" class="link">我的订单</a>
  </div>
</div>
</div>
<div class="site-header">
<div class="container">
  <div class="header-logo">
    <a href="/" class="logo ir">小米官网</a>
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

  // 获取全部分类数据
  api.product.getCatList().then(res => {
    renderHeader(res.data)
    console.log(checkLogin())
    if (checkLogin()) {
      onLogin()
      renderCartCount()
    } else {
      onLogout()
    }

    // 用户名悬停下拉显示
    $('.user').hover(
      function () {
        $(this).addClass('user-active')
      },
      function () {
        $(this).removeClass('user-active')
      }
    )

    // // 点击退出
    // $('#signOut').click(function () {
    //   console.log(api)
    //   api.user.signOut().then(() => {
    //     location.reload()
    //   })
    // })
  })

  // 更新购物车数量显示
  function renderCartCount() {
    api.cart.getCartList().then(res => {
      console.log('头部组件获取购物车信息', res)
      $('.cart-mini-num').text(
        `(${res.data.map(x => x.num).reduce((acc, cur) => acc + cur, 0)})`
      )
    })
  }

  // 渲染分类列表
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
    utils.chunkArray(children, 6).flatMap(renderChild).join('')

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

  function renderHeader(categoryList) {
    $('body').prepend($(header))
    $('.category-list').append(renderCategory(categoryList))
  }
})
