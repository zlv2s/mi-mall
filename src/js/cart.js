require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common'
  ], function ($, api, template, utils, { checkLogin, onLogin, modal, go }) {
    $('body').prepend(template('subHeader', { title: '我的购物车' }))

    const cart = {
      _cartList: [],
      _isLogin: false,

      get isLogin() {
        return this._isLogin
      },
      set isLogin(v) {
        this._isLogin = v
        if (v) {
          onLogin()
          $('.empty-cart-wrapper').hide()
          $('.cart-wrapper').show()
        } else {
          $('.cart-wrapper').show()
          $('.empty-cart-wrapper').hide()
        }
      },

      get cartList() {
        return this._cartList
      },

      set cartList(list) {
        this._cartList = list
        this.render()
        this.bindEvent()
      },

      get selectedCount() {
        return this.cartList
          .filter(x => x.isChecked)
          .map(x => x.num)
          .reduce((acc, count) => acc + count, 0)
      },

      get isAllChecked() {
        return this.cartList.every(x => x.isChecked)
      },

      get totalCount() {
        const totalCount = this.cartList
          .map(x => x.num)
          .reduce((acc, count) => acc + count, 0)
        if (!totalCount) {
          this.renderEmptyPage()
        }
        return totalCount
      },

      get grandTotal() {
        return this.cartList
          .filter(x => x.isChecked)
          .map(x => x.totalPrice)
          .reduce((acc, count) => acc + count, 0)
      },

      init() {
        this.getCartList()
        this.onCheckout()
      },

      checkLogin() {
        this.isLogin = checkLogin()
      },

      renderEmptyPage() {
        $('.empty-cart-wrapper').show()
        $('.cart-wrapper').hide()
        $('.empty-cart-wrapper a:first').hide()
        $('.empty-cart-wrapper p').hide()
      },

      // 获取购物车列表
      getCartList() {
        $('.loading-wrapper').html(template('loading'))
        return api.cart.getCartList().then(res => {
          if (res.status === 0) {
            $('.loading-wrapper').remove()
            this.cartList = res.data
          }
        })
      },

      // 渲染列表
      render() {
        $('.cart-main-list').html(
          template('cartItem', { cartItems: this.cartList })
        )

        $('.empty-cart-wrapper').html(
          template('cartEmpty', { isLogin: this.isLogin })
        )

        $('.total-num:first').text(this.totalCount)
        $('.total-num:last').text(this.selectedCount)
        $('.totalprice-num').text(this.grandTotal)
        $('.list-head .icon-checkbox').addClass(
          this.isAllChecked ? 'select' : ''
        )
        this.isAllChecked
          ? $('.list-head .icon-checkbox').addClass('select')
          : $('.list-head .icon-checkbox').removeClass('select')
        this.selectedCount
          ? $('#checkout').removeClass('btn-disabled')
          : $('#checkout').addClass('btn-disabled')
      },

      // 结算
      onCheckout() {
        const c = this
        $('#checkout').click(function () {
          if (!c.selectedCount) {
            return modal({
              body: '<div class="alert-message">至少选中一件商品！</div>'
            })
          }
          c.checkout().then(res => {
            console.log(res)
            go(`/checkout.html?pOid=${res.data.pOid}`)
          })
        })
      },

      // 更新商品
      updateGoods({ goodsId, update }) {
        return api.cart.updateGoods({
          goodsId,
          update
        })
      },

      deleteGoods(gid) {
        return api.cart.deleteGoods(gid)
      },

      checkout() {
        return api.order.checkout()
      },

      bindEvent() {
        const c = this
        // 数量减少
        $('.change-num')
          .find('a:first')
          .click(function () {
            c.updateGoods({
              goodsId: $(this).parents('.item-box').data().gid,
              update: {
                num: -1
              }
            }).then(res => {
              console.log(res)
              c.getCartList()
            })
          })

        // 数量增加
        $('.change-num')
          .find('a:last')
          .click(function () {
            c.updateGoods({
              goodsId: $(this).parents('.item-box').data().gid,
              update: {
                num: 1
              }
            }).then(res => {
              console.log(res)
              c.getCartList()
            })
          })

        // 商品选中 / 反选
        $('.item-box')
          .find('.col-check i')
          .click(function () {
            c.updateGoods({
              goodsId: $(this).parents('.item-box').data().gid,
              update: {
                isChecked: !$(this).hasClass('select')
              }
            }).then(res => {
              console.log(res)
              c.getCartList()
            })
          })

        // 校验输入框数据
        $('.col-num input').blur(function (e) {
          if (e.target.value > 5 || e.target.value < 1) {
            modal({
              title: '提示',
              body: '<div class="alert-message">商品数量错误</div>'
            })
          }
        })

        // 删除商品
        $('.col-action i').click(function () {
          c.deleteGoods($(this).parents('.item-box').data().gid).then(res => {
            console.log(res)
            c.getCartList()
          })
        })

        // 全选/反选
        $('.list-head')
          .find('.col-check i')
          .on('click', function () {
            $('#checkout').toggleClass('btn-disabled')
            c.updateGoods({
              update: {
                isCheckedAll: !$(this).hasClass('select')
              }
            }).then(res => {
              console.log(res)
              c.getCartList()
            })
          })
      }
    }

    $(function () {
      cart.checkLogin()
      cart.init()
    })
  })
})
