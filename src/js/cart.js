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
        return this.cartList
          .map(x => x.num)
          .reduce((acc, count) => acc + count, 0)
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

      // 获取购物车列表
      getCartList() {
        return api.cart.getCartList().then(res => {
          if (res.status === 0) {
            this.cartList = res.data
          }
        })
      },

      // 渲染列表
      render() {
        $('.cart-main-list').html(
          template('cartItem', { cartItems: this.cartList })
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
      // // 计算总数
      // getTotalCount(list) {
      //   return list.map(x => x.num).reduce((acc, count) => acc + count, 0)
      // },

      // // 计算选中商品数
      // getSelectedCount(list) {
      //   return list
      //     .filter(x => x.isChecked)
      //     .map(x => x.num)
      //     .reduce((acc, count) => acc + count, 0)
      // },

      // // 计算选中商品总价
      // getGrandTotal(list) {
      //   return list
      //     .filter(x => x.isChecked)
      //     .map(x => x.totalPrice)
      //     .reduce((acc, count) => acc + count, 0)
      // },

      // // 是否全选
      // ifCheckedAll(list) {
      //   return list.every(x => x.isChecked)
      // },

      // selectAll() {
      //   // 全选 / 反选
      //   $('.list-head')
      //     .find('.col-check i')
      //     .click(function () {
      //       $('#checkout').toggleClass('btn-disabled')
      //       c.updateGoods({
      //         update: {
      //           isCheckedAll: !$(this).hasClass('select')
      //         }
      //       }).then(res => {
      //         console.log(res)
      //         c.getCartList()
      //         // init()
      //       })
      //     })
      // },

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
      if (checkLogin()) {
        onLogin()
        cart.init()
      }
    })

    // if (checkLogin()) {
    //   onLogin()
    //   selectAll()
    //   init()
    // }

    // function init() {
    //   api.cart.getCartList().then(res => {
    //     console.log(res)
    //     render(res.data)
    //     boundEvent()
    //   })
    // }

    // function selectAll() {
    //   // 全选 / 反选
    //   $('.list-head')
    //     .find('.col-check i')
    //     .click(function () {
    //       $('#checkout').toggleClass('btn-disabled')
    //       api.cart
    //         .updateGoods({
    //           update: {
    //             isCheckedAll: !$(this).hasClass('select')
    //           }
    //         })
    //         .then(res => {
    //           console.log(res)
    //           init()
    //         })
    //     })
    // }

    // function boundEvent() {
    //   // 数量减少
    //   $('.change-num')
    //     .find('a:first')
    //     .click(function () {
    //       api.cart
    //         .updateGoods({
    //           goodsId: $(this).parents('.item-box').data().gid,
    //           update: {
    //             num: -1
    //           }
    //         })
    //         .then(res => {
    //           console.log(res)
    //           init()
    //         })
    //     })

    //   // 数量增加
    //   $('.change-num')
    //     .find('a:last')
    //     .click(function () {
    //       api.cart
    //         .updateGoods({
    //           goodsId: $(this).parents('.item-box').data().gid,
    //           update: {
    //             num: 1
    //           }
    //         })
    //         .then(res => {
    //           console.log(res)
    //           init()
    //         })
    //     })

    //   // 商品选中 / 反选
    //   $('.item-box')
    //     .find('.col-check i')
    //     .click(function () {
    //       api.cart
    //         .updateGoods({
    //           goodsId: $(this).parents('.item-box').data().gid,
    //           update: {
    //             isChecked: !$(this).hasClass('select')
    //           }
    //         })
    //         .then(res => {
    //           console.log(res)
    //           init()
    //         })
    //     })

    //   // 校验输入框数据
    //   $('.col-num input').blur(function (e) {
    //     if (e.target.value > 5 || e.target.value < 1) {
    //       modal({
    //         title: '提示',
    //         body: '<div class="alert-message">商品数量错误</div>'
    //       }).fadeIn()
    //     }
    //   })

    //   // 删除商品
    //   $('.col-action i').click(function () {
    //     console.log('删除')
    //     api.cart
    //       .deleteGoods($(this).parents('.item-box').data().gid)
    //       .then(res => {
    //         console.log(res)
    //         init()
    //       })
    //   })
    // }

    // // 结算
    // $('#checkout').click(function () {
    //   api.order.checkout().then(res => {
    //     console.log(res)
    //     go(`/checkout.html?pOid=${res.data.pOid}`)
    //   })
    // })

    // function render(cartList) {
    //   $('.list-body').html(template('cartItem', { cartItems: cartList }))

    //   const cart = {
    //     totalCount: getTotalCount(cartList),
    //     selectedCount: getSelectedCount(cartList),
    //     grandTotal: getGrandTotal(cartList),
    //     checkedAll: ifCheckedAll(cartList)
    //   }

    //   $('.total-num:first').text(cart.totalCount)
    //   $('.total-num:last').text(cart.selectedCount)
    //   $('.totalprice-num').text(cart.grandTotal)
    //   $('.list-head .icon-checkbox').addClass(cart.checkedAll ? 'select' : '')
    //   cart.checkedAll
    //     ? $('.list-head .icon-checkbox').addClass('select')
    //     : $('.list-head .icon-checkbox').removeClass('select')
    //   cart.selectedCount
    //     ? $('#checkout').removeClass('btn-disabled')
    //     : $('#checkout').addClass('btn-disabled')
    // }

    // function getTotalCount(list) {
    //   return list.map(x => x.num).reduce((acc, count) => acc + count, 0)
    // }

    // function getSelectedCount(list) {
    //   return list
    //     .filter(x => x.isChecked)
    //     .map(x => x.num)
    //     .reduce((acc, count) => acc + count, 0)
    // }

    // function getGrandTotal(list) {
    //   return list
    //     .filter(x => x.isChecked)
    //     .map(x => x.totalPrice)
    //     .reduce((acc, count) => acc + count, 0)
    // }

    // function ifCheckedAll(list) {
    //   return list.every(x => x.isChecked)
    // }
  })
})
