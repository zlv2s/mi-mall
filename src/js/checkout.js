require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common'
  ], function ($, api, template, utils, { checkLogin, onLogin, go, modal }) {
    const checkout = {
      checkoutData: {},
      _addressList: [],
      _searchValue: '',

      get searchValue() {
        return this._searchValue
      },
      set searchValue(v) {
        this._searchValue = v

        if (v) {
          $('.clear').addClass('show')
        } else {
          $('.clear').removeClass('show')
          $('.result-list').hide()
        }
      },

      get addressList() {
        return this._addressList
      },

      set addressList(list) {
        this._addressList = list
        if (list.length) {
          this.renderAddressList()
          this.bindAddressClick()
        }
      },

      // 获取数据
      goCheckout() {
        return api.cart.checkout()
      },

      // 渲染页面
      render() {
        $('.goods-list').html(
          template('checkoutItem', {
            checkoutList: this.checkoutData.goodsList
          })
        )
        $('.checkout-count').html(
          template('countBox', { countData: this.checkoutData })
        )
      },

      renderAddressList() {
        console.log('render address item')
        $('.result-list')
          .show()
          .html(template('addressItem', { addressList: this.addressList }))
      },

      bindAddressClick() {
        const ck = this
        // 街道输入框点击
        $('.result-list li').click(function () {
          $('.result-list').hide()
          api.cart
            .getAreaInfo({
              adcode: $(this).data().adcode,
              location: $(this).data().location
            })
            .then(res => {
              const { province, city, district, area } = res.data.data

              $('input[name="address"]').val(
                `${province.name} ${city.name} ${district.name} ${area.name}`
              )
              $('.address-select-box').hide()
              $('input[name="search"]').val('')
            })
        })
      },

      bind() {
        const ck = this
        // 去结算
        $('#checkout').click(function () {
          console.log('结账')
          modal({
            body: '<div class="alert-message">有钱吗？你就敢结账？？</div>',
            onConfirm() {
              console.log('继续结账')
            }
          })
        })

        // 返回购物车
        $('#return').click(function () {
          go('/cart.html')
        })

        // 打开地址添加框
        $('.address-new').click(function () {
          modal(
            {
              title: '添加收货地址',
              body: template('formBody')
            },
            function () {
              console.log('22')
            }
          )

          // focus, blur 姓名、手机输入框，因为有 label 标签，所以当点击 mi-input 时，让输入框 focus
          $('.mi-input').click(function (e) {
            console.log(e)
            $(this).find('.input-text').focus()
            $(this).addClass('mi-input-active mi-input-focus')
          })

          $('.input-text').blur(function () {
            console.log('blur')
            $(this).parent().removeClass('mi-input-active mi-input-focus')
            if ($(this).val()) {
              $(this).parent().addClass('mi-input-active')
            }
          })

          $('.iconfont-arrow-down-small').click(function () {})

          $('.iconfont-close-small').click(function () {
            $('.address-select-box').fadeOut()
          })

          $('.clear').click(function () {
            $('input[name="search"]').val('')
            ck.addressList = []
          })

          $('.address-info-box input[name="address"]').focus(function () {
            $('.address-select-box').fadeIn()
          })

          // 对输入请求数据防抖处理
          const debouncedSearch = utils.debounce(ck.searchAddress, 800, ck)

          // search 输入框 input 事件
          $('input[name="search"]').on('input', function (e) {
            ck.searchValue = e.target.value
            // e.target.value
            //   ? $('.clear').addClass('show')
            //   : $('.clear').removeClass('show')
            if (e.target.value) {
              debouncedSearch(e.target.value)
            }
          })
        })
      },

      searchAddress(kw) {
        api.cart.searchAddress(kw).then(res => {
          this.addressList = res.data.data
        })
      },

      init() {
        // 渲染公共头部
        $('body').prepend(template('subHeader', { title: '确认订单' }))
        if (checkLogin()) {
          onLogin()
          this.goCheckout().then(res => {
            this.checkoutData = res.data
            this.render()
            this.bind()
          })
        } else {
          console.log('未登录')
          go('/')
        }
      }
    }

    $(function () {
      checkout.init()
    })
  })
})
