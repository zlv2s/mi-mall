require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common'
  ], function ($, api, template, utils, { checkLogin, onLogin, modal, go }) {
    $('body').prepend(template('subHeader', { title: '我的购物车' }))

    if (checkLogin()) {
      onLogin()
      selectAll()
      init()
    }

    function init() {
      api.cart.getCartList().then(res => {
        console.log(res)
        render(res.data)
        boundEvent()
      })
    }

    function selectAll() {
      // 全选 / 反选
      $('.list-head')
        .find('.col-check i')
        .click(function () {
          console.log('全选/反选')
          $('#checkout').toggleClass('btn-disabled')
          api.cart
            .updateGoods({
              update: {
                isCheckedAll: !$(this).hasClass('select')
              }
            })
            .then(res => {
              console.log(res)
              init()
            })
        })
    }

    function boundEvent() {
      // 数量减少
      $('.change-num')
        .find('a:first')
        .click(function () {
          console.log('-1')
          api.cart
            .updateGoods({
              goodsId: $(this).parents('.item-box').data().gid,
              update: {
                num: -1
              }
            })
            .then(res => {
              console.log(res)
              init()
            })
        })

      // 数量增加
      $('.change-num')
        .find('a:last')
        .click(function () {
          console.log('+1')
          api.cart
            .updateGoods({
              goodsId: $(this).parents('.item-box').data().gid,
              update: {
                num: 1
              }
            })
            .then(res => {
              console.log(res)
              init()
            })
        })

      // 商品选中 / 反选
      $('.item-box')
        .find('.col-check i')
        .click(function () {
          console.log('商品选中 / 反选')
          api.cart
            .updateGoods({
              goodsId: $(this).parents('.item-box').data().gid,
              update: {
                isChecked: !$(this).hasClass('select')
              }
            })
            .then(res => {
              console.log(res)
              init()
            })
        })

      // 校验输入框数据
      $('.col-num input').blur(function (e) {
        if (e.target.value > 5 || e.target.value < 1) {
          modal({
            title: '提示',
            body: '<div class="alert-message">商品数量错误</div>'
          }).fadeIn()
        }
      })

      // 删除商品
      $('.col-action i').click(function () {
        console.log('删除')
        api.cart
          .deleteGoods($(this).parents('.item-box').data().gid)
          .then(res => {
            console.log(res)
            init()
          })
      })
    }

    // 结算
    $('#checkout').click(function () {
      api.order.checkout().then(res => {
        console.log(res)
        go(`/checkout.html?pOid=${res.data.pOid}`)
      })
    })

    function render(cartList) {
      $('.list-body').html(template('cartItem', { cartItems: cartList }))

      const cart = {
        totalCount: getTotalCount(cartList),
        selectedCount: getSelectedCount(cartList),
        grandTotal: getGrandTotal(cartList),
        checkedAll: ifCheckedAll(cartList)
      }

      $('.total-num:first').text(cart.totalCount)
      $('.total-num:last').text(cart.selectedCount)
      $('.totalprice-num').text(cart.grandTotal)
      $('.list-head .icon-checkbox').addClass(cart.checkedAll ? 'select' : '')
      cart.checkedAll
        ? $('.list-head .icon-checkbox').addClass('select')
        : $('.list-head .icon-checkbox').removeClass('select')
      cart.selectedCount
        ? $('#checkout').removeClass('btn-disabled')
        : $('#checkout').addClass('btn-disabled')
    }

    function getTotalCount(list) {
      return list.map(x => x.num).reduce((acc, count) => acc + count, 0)
    }

    function getSelectedCount(list) {
      return list
        .filter(x => x.isChecked)
        .map(x => x.num)
        .reduce((acc, count) => acc + count, 0)
    }

    function getGrandTotal(list) {
      return list
        .filter(x => x.isChecked)
        .map(x => x.totalPrice)
        .reduce((acc, count) => acc + count, 0)
    }

    function ifCheckedAll(list) {
      return list.every(x => x.isChecked)
    }
  })
})
