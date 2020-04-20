/* eslint-disable no-console */
import ProductService from '~/services/ProductService'
const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  products: [],
  filters: {
    category: [],
    vendor: [],
    price: [],
    stock: 'all',
    search: ''
  },
  auth: null
})

export const mutations = {
  SET_PRODUCT_DATA (state, value) {
    state.products = value
  },
  SET_FILTER (state, value) {
    state.filters = { ...state.filters, ...value }
  },
  SET_AUTH (state, value) {
    state.auth = value
  }
}

export const actions = {
  fetchProducts ({ commit, state }) {
    return ProductService.getProductsES(state.filters)
      .then((result) => {
        commit('SET_PRODUCT_DATA', result.data)
      })
      .catch((e) => {
        console.log('Error getting data')
      })
  },
  setFilter ({ commit, dispatch, state }, value) {
    commit('SET_FILTER', value)
    if (state.filters.price.length !== 0) {
      dispatch('fetchProducts')
    }
  },
  nuxtServerInit ({ commit }, { req }) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = parsed.jwtAuthToken
      } catch (e) {
        console.log(e.message)
      }
    }
    commit('SET_AUTH', auth)
  }
}
