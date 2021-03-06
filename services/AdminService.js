/* eslint-disable */
import axios from 'axios'
const Cookie = process.client ? require('js-cookie') : undefined

const api = axios.create({
  // baseURL: 'https://catalog-app-st.herokuapp.com/api',
  baseURL: 'http://localhost:3000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export const loginAdmin = async (user) => {
  try {
    const res = await api.post('/admin-login', user)
    if (res) {
      api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`
      return res.data.token
    }
    return false
  } catch (err) {
    alert(err.response.data)
  }
}

export const logoutAdmin = async () => {
  api.defaults.headers.common.Authorization = ''
  Cookie.remove('jwtAuthToken')
}

export const postProduct = async (data) => {
 return await api.post('/admin-add-product', data)
}


export const downloadFile = async () => { 
  api.get('/product-stats', {
    responseType: 'blob'
  }).then((response) => {
      const url = URL.createObjectURL(new Blob([response.data], {
        type: 'application/vnd.ms-excel'
    }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'product.xlsx')
    document.body.appendChild(link)
    link.click()
  })
 
}