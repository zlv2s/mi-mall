define(['axios', 'utils'], function (axios, utils) {
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
      return Promise.resolve(response.data)
    },
    err => {
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
      getDetail(id) {
        return request({
          url: `/product/${id}`
        })
      }
    },
    cart: {
      addToCart(data) {
        return request({
          url: '/cart/add',
          method: 'post',
          data
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
      deleteGoods(gid) {
        return request({
          url: `/cart/delete/${gid}`,
          method: 'delete'
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
      }
    }
  }
})
