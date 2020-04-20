import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.BASE_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getProducts () {
    return api.get('/products')
  },
  getProductById (id) {
    return api.get(`/product/${id}`)
  },
  getProductBySlug (slug) {
    return api.get(`/product/${slug}`)
  },
  getProductsES (filters) {
    return api.post('/products-es', filters)
  }
}
