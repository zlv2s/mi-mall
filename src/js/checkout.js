require(['./config'], function () {
  require([
    'jquery',
    'api',
    './js/template/template',
    'utils',
    'common',
    'footer'
  ], function ($, api, template, utils, { checkLogin, onLogin, go, modal }) {
    const checkout = {
      checkoutData: {},
      _addressList: [], // 街道信息地址列表
      _searchValue: '',
      _userAddressList: [], // 用户收货地址列表
      currentAddress: null,
      pOid: utils.getUrlKey(location.href)['pOid'],

      get userAddressList() {
        return this._userAddressList
      },
      set userAddressList(list) {
        this._userAddressList = list
        this.renderUserAddress()
        this.bindUserAddressClick()
      },

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
      getCheckout(pOid) {
        return api.cart.getCheckout(pOid)
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
      // 渲染地址列表
      renderAddressList() {
        console.log('render address item')
        $('.result-list')
          .show()
          .html(template('addressItem', { addressList: this.addressList }))
      },

      // 获取街道信息输入框事件绑定
      bindAddressClick() {
        const ck = this

        $('.result-list li').click(function () {
          $('.result-list').hide()
          api.cart
            .getAreaInfo({
              adcode: $(this).data().adcode,
              location: $(this).data().location
            })
            .then(res => {
              const { province, city, district, area } = res.data.data

              utils.storage.set('address', { province, city, district, area })

              $('input[name="address"]').val(
                `${province.name} ${city.name} ${district.name} ${area.name}`
              )
              $('.address-select-box').hide()
              $('input[name="search"]').val('')
            })
        })
      },

      // 弹出框事件绑定
      formBind() {
        // focus, 姓名、手机输入框，因为有 label 标签，所以当点击 mi-input 时，让输入框 focus
        $('.mi-input').click(function (e) {
          $(this).find('.input-text').focus()
          $(this).addClass('mi-input-active mi-input-focus')
        })

        // blur
        $('.input-text').blur(function () {
          console.log('blur')
          $(this).parent().removeClass('mi-input-active mi-input-focus')
          if ($(this).val()) {
            $(this).parent().addClass('mi-input-active')
          }
        })

        // 显示
        $('.address-info-box input[name="address"]').focus(function () {
          $('.address-select-box').fadeIn()
        })

        // 隐藏
        $('.iconfont-close-small').click(function () {
          $('.address-select-box').fadeOut()
        })

        $('.clear').click(function () {
          $('input[name="search"]').val('')
          ck.addressList = []
        })

        // 对输入请求数据防抖处理
        const debouncedSearch = utils.debounce(this.searchAddress, 800, this)

        // search 输入框 input 事件
        $('input[name="search"]').on('input', function (e) {
          this.searchValue = e.target.value
          if (e.target.value) {
            debouncedSearch(e.target.value)
          }
        })
      },

      // 收货地址绑定事件
      bindUserAddressClick() {
        console.log('bind user address click')
        const ck = this
        // 打开地址添加框
        $('.address-new').click(function () {
          modal({
            title: '添加收货地址',
            body: template('formBody', {}),
            onConfirm() {
              ck.sendFormData(ck.getFormData())
            }
          })

          ck.formBind()
        })

        // 点击收货地址
        $('.address-item:not(:last-of-type)').click(function (e) {
          const item = this
          $(this).addClass('active').siblings().removeClass('active')

          ck.setAddress({ pOid: ck.pOid, addressId: $(this).data().aid }).then(
            res => {
              console.log('setAddress', res)
            }
          )

          // 删除按钮
          if (e.target.id === 'del') {
            modal({
              body: '<h3 class="alert-message">确定删除该地址吗？</h3>',
              onConfirm() {
                ck.deleteAddress($(item).data().aid).then(res => {
                  if (res.status === 0) {
                    ck.userAddressList = res.data.addressList
                  }
                })
              }
            })
          }

          // 编辑按钮
          if (e.target.id === 'edit') {
            const address = ck.userAddressList.find(
              x => x.addressId === $(this).data().aid
            )
            // 将选中地址信息，先转换数据形式再存入 localStorage，以便于 getFormData 使用
            utils.storage.set('address', ck.transformObj(address))

            modal({
              title: '修改收货地址',
              body: template('formBody', { address }),
              onConfirm() {
                ck.updateAddress({
                  addressId: address.addressId,
                  update: { ...ck.getFormData() }
                }).then(res => {
                  ck.userAddressList = res.data.addressList
                })
              }
            })

            ck.formBind()
            // 手动触发输入框 blur 事件，防止 label 遮盖住内容
            $('.input-text').each(function (idx, ele) {
              $(ele).trigger('blur')
            })
          }
        })
      },

      transformObj(obj) {
        const filters = ['province', 'area', 'city', 'district']
        const keys = Object.entries(obj).filter(([k, v]) =>
          /(province|area|city|district)_\w+/g.test(k)
        )

        const o = {}

        while (filters.length) {
          const name = filters.pop()
          for (const [k, v] of keys) {
            if (k.includes(name)) {
              const [newK, newV] = k.split('_')
              o[name] = { ...o[name], [newV]: v }
            }
          }
        }

        return o
      },

      bind() {
        const ck = this
        // 去结算
        $('#checkout').click(function () {
          modal({
            body: '<div class="alert-message">有钱吗？你就敢结账？？</div>',
            onConfirm() {
              ck.confirmOrder(ck.checkoutData.pOid).then(res => {
                console.log('confirmOrder', res)
                if (res.status === 0) {
                  go(`/order.html?cOid=${res.data.cOid}`)
                } else {
                  setTimeout(() => {
                    modal({
                      title: '提示',
                      body: `<div class="alert-message">${res.message}</div>`
                    })
                  }, 1000)
                }
              })
            }
          })
        })

        // 返回购物车
        $('#return').click(function () {
          go('/cart.html')
        })
      },

      // 删除收货地址
      deleteAddress(addressId) {
        return api.user.delAddress(addressId)
      },

      // 更新地址信息
      updateAddress({ addressId, update }) {
        return api.user.updateAddress({ addressId, update })
      },

      setAddress({ pOid, addressId }) {
        return api.order.setAddress({ pOid, addressId })
      },

      confirmOrder(pOid) {
        return api.order.confirmOrder(pOid)
      },

      getFormData() {
        // 获取输入框值
        function getInputVal(inputName) {
          return (
            $(`input[name=${inputName}]`).val() ||
            $(`textarea[name=${inputName}]`).val()
          )
        }
        console.log(utils.storage.get('address'))
        const { province, city, district, area } = utils.storage.get('address')
        console.log({ province, city, district, area })
        return {
          consignee: getInputVal('name'),
          telephone: getInputVal('telephone'),
          tag_name: getInputVal('addresstag'),
          address: getInputVal('addressInfo'),
          province_name: province.name,
          city_name: city.name,
          district_name: district.name,
          area_name: area.name,
          province_id: province.id,
          city_id: city.id,
          district_id: district.id,
          area_id: area.id
        }
      },
      // 提交表单数据
      sendFormData(formData) {
        api.user.addAddress(formData).then(res => {
          console.log(res)
          this.getUserAddressList()
        })
      },

      searchAddress(kw) {
        api.cart.searchAddress(kw).then(res => {
          this.addressList = res.data.data
        })
      },

      // 获取用户收货地址列表
      getUserAddressList() {
        api.user.getAddressList().then(res => {
          this.userAddressList = res.data[0].addressList
        })
      },

      // 渲染收货地址列表
      renderUserAddress() {
        $('.address-body').html(
          template('userAddressItem', { userAddressList: this.userAddressList })
        )
      },

      init() {
        // 渲染公共头部
        $('body').prepend(template('subHeader', { title: '确认订单' }))
        // const { pOid } = utils.getUrlKey(location.href)
        console.log(utils.getUrlKey(location.href))
        if (checkLogin()) {
          onLogin()
          this.getCheckout(this.pOid).then(res => {
            console.log('getCheckoutData', res)
            this.checkoutData = res.data.pOrderList[0]
            this.render()
            this.bind()
          })

          this.getUserAddressList()
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
