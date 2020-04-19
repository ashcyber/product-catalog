/* eslint-disable no-console */
import ProductService from '~/services/ProductService'
export const state = () => ({
  products: [],
  filters: {
    category: [],
    vendor: [],
    price: [],
    stock: 'all',
    search: ''
  }
})

export const mutations = {
  SET_PRODUCT_DATA (state, value) {
    state.products = value
  },
  SET_FILTER (state, value) {
    state.filters = { ...state.filters, ...value }
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
  }
}
