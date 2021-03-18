define(['axios', 'utils'], function (axios, utils) {
  const request = axios.create({
    baseURL: 'http://localhost:3030/api/mi-mall',
    timeout: 5000
  })
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
