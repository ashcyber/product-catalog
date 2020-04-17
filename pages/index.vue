<template>
  <div>
    <p v-for="(product,idx) in products" :key="idx">
      {{ product.name }}
    </p>
  </div>
</template>

<script>
import ProductService from '~/services/ProductService.js'
export default {
  asyncData ({ error }) {
    return ProductService.getProducts().then((result) => {
      return {
        products: result.data
      }
    }).catch((e) => {
      error({
        statusCode: 500,
        message: 'Unable to get products'
      })
    })
  }
}
</script>

<style>

</style>
