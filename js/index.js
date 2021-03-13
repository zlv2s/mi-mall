function renderSwiper(swiperList) {
  $('#swiper>.swiper-wrapper').append(
    swiperList.map(
      item => `<div class="swiper-slide"><img src=${item.imgUrl} /></div>`
    )
  )

  const swiper = new Swiper('#swiper', {
    spaceBetween: 30,
    effect: 'fade',
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  })

  swiper.el.onmouseover = function () {
    swiper.autoplay.stop()
  }

  swiper.el.onmouseout = function () {
    swiper.autoplay.start()
  }
}

function renderPromo(promoList) {
  $('.home-promo-list').append(
    promoList
      .map(
        item =>
          `<li><a href=${item.link}><img src=${item.imgUrl} alt=""></a></li>`
      )
      .join('')
  )
}

function renderFlashSwiper(flashSlideList) {
  $('#swiper2>.swiper-wrapper').append(
    flashSlideList
      .map(item => {
        return `
  <li class="swiper-slide swiper-no-swiping">
              <a href="#">
                <div class="content">
                  <div class="thumb"><img src="${item.img}" alt="${item.desc}" /></div>
                  <h3 class="title">${item.goods_name}</h3>
                  <p class="desc">${item.desc}</p>
                  <p class="price">
                    <span>${item.goods_price}</span>
                    <del>${item.seckill_Price}</del>
                  </p>
                </div>
              </a>
            </li>
  `
      })
      .join('')
  )
  const swiper2 = new Swiper('#swiper2', {
    slidesPerView: 4,
    spaceBetween: 14,
    slidesPerGroup: 4,
    speed: 1000,
    noSwiping: true,
    navigation: {
      nextEl: '.btn-next',
      prevEl: '.btn-prev',
      disabledClass: 'navigation-disabled'
    }
  })
}

function renderBannerBox(item) {
  append(
    $(`<div class="home-banner-box">
  <a href=${item.body.items[0].action.path}><img
      src=${item.body.items[0].img_url}
      alt=""></a>
</div>`)
  )
}

function renderProductList(productList) {
  return productList
    .map(product => {
      return `<li class="brick-item brick-item-m brick-item-m-2">
            <a href=${product.action.path}>
              <div class="figure figure-img"><img src=${product.img_url} alt=""></div>
              <h3 class="title">${product.product_name}</h3>
              <p class="desc">${product.product_brief}</p>
              <p class="price">
                <span class="num">${product.product_price}</span>
                <span>${product.product_org_price}</span>
              </p>
            </a>
          </li>`
    })
    .join('')
}

function renderProductItem(item) {
  const brickBox = $(`<div class="home-brick-box home-brick-row-2-box">
  <div class="box-hd">
    <h2 class="title">${item.body.floor_name}</h2>
    <div class="more">
      <a href=${item.body.action.path} class="more-link">
        ${item.body.more_text}
        <i class="iconfont iconfont-arrow-right-big"></i>
      </a>
    </div>
  </div>
  <div class="box-bd">
    <div class="row">
      <div class="span4">
        <ul class="brick-promo-list">
          <li class="brick-item brick-item-l">
            <a href=${item.body.left_ad.items[0].action.path}><img
                src=${item.body.left_ad.items[0].img_url}
                alt=""></a>
          </li>
        </ul>
      </div>
      <div class="span16">
        <ul class="brick-list">
        ${renderProductList(item.body.product_list)}
      </ul>           
      </div>
    </div>
  </div>
</div>`)

  append(brickBox)
}

function renderProductItemTabs(item) {
  const brickBox = $(`<div class="home-brick-box home-brick-row-2-box">
  <div class="box-hd">
    <h2 class="title">${item.body.floor_name}</h2>
    <div class="more">
      <ul class="tab-list">
        ${item.body.tab_content.map(tab => `<li>${tab.tab_name}</li>`).join('')}
        </ul>         
    </div>
  </div>
  <div class="box-bd">
    <div class="row">
      <div class="span4">
        <ul class="brick-promo-list">
          ${item.body.left_ad.items
            .map(
              l => `<li class="brick-item brick-item-m">
            <a href=${l.action.path}><img
                src=${l.img_url}
                alt=""></a>
          </li>`
            )
            .join('')}
        </ul>
      </div>
      <div class="span16">
       ${renderUl(item.body.tab_content)}
      </div>
    </div>
  </div>
</div>`)

  function renderLi(productList) {
    return productList
      .slice(0, -1)
      .map(product => {
        return `<li class="brick-item brick-item-m brick-item-m-2">
            <a href=${product.action.path}>
              <div class="figure figure-img"><img src=${product.img_url} alt=""></div>
              <h3 class="title">${product.product_name}</h3>
              <p class="desc">${product.product_brief}</p>
              <p class="price">
                <span class="num">${product.product_price}</span>
                <span>${product.product_org_price}</span>
              </p>
            </a>
          </li>`
      })
      .join('')
  }

  function renderUl(tabContent) {
    return tabContent
      .map((tab, i) => {
        return `<ul class="brick-list ${i !== 0 ? 'hide' : ''}">
         ${renderLi(tab.product_list)}
      </ul>`
      })
      .join('')
  }

  append(brickBox)
}

function renderFloor(goodsFloorData) {
  goodsFloorData.forEach(item => {
    if (item.view_type === 'cells_auto_fill') {
      renderBannerBox(item)
    } else if (item.view_type === 'list_eight_product') {
      renderProductItem(item)
    } else if (item.view_type === 'list_eight_product_tab') {
      renderProductItemTabs(item)
    }
  })
}

function append($ele) {
  $('.page-main .container').append($ele)
}
