<template>
  <div>
    <v-container class="grey " fluid>
      <v-row
        class="mb-6"
        no-gutters
      >
        <SearchBar />
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
          <div class="product-container">
            <ProductCard v-for="(product,index) in products" :key="index" :product="product" class="product-card" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ProductCard from '~/components/ProductCard.vue'
import FilterBar from '~/components/FilterBar.vue'
import SearchBar from '~/components/SearchBar.vue'

export default {
  components: {
    ProductCard,
    FilterBar,
    SearchBar
  },
  async fetch ({ store }) {
    await store.dispatch('fetchProducts')
  },
  data () {
    return {
      searchStyle: {
        width: '500px'
      }
    }
  },
  computed: mapState(['products', 'filters'])
}
</script>
<style>
.product-container {
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

.search-row {
  display: flex;
  justify-content: center;
}
</style>
