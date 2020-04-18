<template>
  <div>
    <v-container class="grey " fluid>
      <v-row
        class="mb-6"
        no-gutters
      >
        <v-container class="search-row">
          <div>
            <v-text-field
              solo
              :style="searchStyle"
              label="Search"
            />
          </div>
        </v-container>
      </v-row>

      <v-row
        class="mb-6"
        no-gutters
      >
        <v-col
          cols="2"
        >
          <FilterBar />
        </v-col>
        <v-col
          cols="10"
        >
          <v-card
            class="pa-2"
            outlined
            tile
          >
            <div class="container">
              <ProductCard v-for="(product,index) in products" :key="index" :product="product" class="product-card" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import ProductService from '~/services/ProductService.js'
import ProductCard from '~/components/ProductCard.vue'
import FilterBar from '~/components/FilterBar.vue'

export default {
  components: {
    ProductCard,
    FilterBar
  },
  asyncData ({ error }) {
    return ProductService.getProductsES()
      .then((result) => {
        return {
          products: result.data
        }
      })
      .catch((e) => {
        error({
          statusCode: 500,
          message: 'Unable to get products'
        })
      })
  },
  data () {
    return {
      searchStyle: {
        width: '500px'
      }
    }
  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: left;
  margin:auto;
}

.product-card {
  margin: 10px;
  flex:0 1 calc(20%)
}
.filter-container {
  height: 100px;
  width: 200px;
  border: 1px solid black;
}
.search-row {
  justify-content: center;
}
</style>
