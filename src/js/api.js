define(['axios', 'utils', 'common'], function (axios, utils, { go, modal }) {
  const request = axios.create({
    baseURL: 'http://localhost:3030/api/mi-mall',
    timeout: 20000
  })

  request.interceptors.request.use(
    config => {
      // 请求前先判断本地是否有token，并加在请求头上
      const token = utils.storage.get('user')?.token
      token && (config.headers.Authorization = token)

      return config
    },
    error => {
      console.log('request error', error)
      return Promise.reject(error)
    }
  )

  request.interceptors.response.use(
    response => {
      console.log(response.data)
      if (response.data.status === 1) {
        modal({
          body: `<div class="alert-message">${response.data.message}</div>`
        })
      }
      return Promise.resolve(response.data)
    },
    err => {
      console.log(err)
      if (err.response.status === 401) {
        utils.storage.clear()
        return go('/')
      }

      if (err.response.status === 404) {
        return go('/notFound.html')
      }
      return Promise.reject(err)
    }
  )

  return {
    product: {
      getAll() {
        return request({
          url: '/product/all'
        })
      },

      getCatList() {
        return request({
          url: '/product/catList'
        })
      },

      getDetail(id = '') {
        return request({
          url: `/product/${id}`
        })
      }
    },
    cart: {
      addToCart({ goodsId, productId }) {
        return request({
          url: '/cart/add',
          method: 'post',
          data: { goodsId, productId }
        })
      },

      getCartList() {
        return request({
          url: '/cart/getList'
        })
      },

      updateGoods({ goodsId = 'all', update }) {
        return request({
          url: `/cart/update/${goodsId}`,
          method: 'post',
          data: update
        })
      },

      deleteGoods(gid = '') {
        return request({
          url: `/cart/delete/${gid}`,
          method: 'delete'
        })
      },

      getCartRec(cid = '') {
        return request({
          url: `/cart/recom/${cid}`
        })
      },

      getItem(gid = '') {
        return request({
          url: `/cart/getItem/${gid}`
        })
      },

      getCheckout(pOid = '') {
        return request({
          url: `/cart/getCheckout/${pOid}`
        })
      },

      searchAddress(keywords) {
        return request({
          url: '/cart/searchAddress',
          params: { keywords }
        })
      },

      getAreaInfo({ adcode, location }) {
        return request({
          url: '/cart/getAreaInfo',
          params: { adcode, location }
        })
      }
    },
    user: {
      signIn({ username, password }) {
        return request({
          url: '/user/signIn',
          method: 'post',
          data: {
            username,
            password
          }
        })
      },

      signUp({ username, password }) {
        return request({
          url: '/user/signUp',
          method: 'post',
          data: {
            username,
            password
          }
        })
      },

      signOut() {
        return Promise.resolve(utils.storage.clear())
      },

      addAddress(data) {
        return request({
          url: '/user/addAddress',
          method: 'post',
          data
        })
      },

      getAddressList() {
        return request({
          url: '/user/addressList'
        })
      },

      updateAddress({ addressId = '', update }) {
        return request({
          url: `/user/address/${addressId}`,
          method: 'post',
          data: update
        })
      },

      delAddress(addressId = '') {
        return request({
          url: `/user/address/${addressId}`,
          method: 'delete'
        })
      }
    },

    order: {
      checkout() {
        return request({
          url: '/order/checkout',
          method: 'post',
          data: { action: 'checkout' }
        })
      },

      setAddress({ pOid, addressId }) {
        return request({
          url: '/order/setAddress',
          method: 'post',
          data: { pOid, addressId }
        })
      },

      confirmOrder(pOid) {
        return request({
          url: '/order/confirm',
          method: 'post',
          data: { action: 'confirm', pOid }
        })
      },

      getOrderInfo(cOid = '') {
        return request({
          url: `/order/${cOid}`
        })
      }
    }
  }
})
