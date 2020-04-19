<template>
  <v-app>
    <div class="filter-box">
      <div class="category-filter">
        <div class="filter-title">
          Category Filter
        </div>
        <v-container class="filter-control-container">
          <v-checkbox v-model="category" label="Party" value="party" />
          <v-checkbox v-model="category" label="Camera" value="cameras" />
          <v-checkbox v-model="category" label="Electronics" value="electronics" />
        </v-container>
      </div>
      <div class="vendor-filter">
        <div class="filter-title">
          Vendor Filter
        </div>
        <v-container class="filter-control-container">
          <v-checkbox v-model="vendor" label="GBR" value="GBR" />
          <v-checkbox v-model="vendor" label="AST" value="AST" />
          <v-checkbox v-model="vendor" label="RPC" value="RPC" />
        </v-container>
      </div>
      <div class="price-filter">
        <div class="filter-title">
          Price Filter
        </div>
        <v-container class="filter-control-container">
          <v-range-slider
            v-model="price"
            step="1000"
            min="0"
            max="10000"
            ticks="always"
          />
          Price range : ${{ price[0] }} to ${{ price[1] }}
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      price: [500, 6000],
      category: [],
      vendor: [],
      stock: []
    }
  },
  watch: {
    category (value) {
      this.$store.dispatch('setFilter', { category: value })
    },
    vendor (value) {
      this.$store.dispatch('setFilter', { vendor: value })
    },
    price (value) {
      this.$store.dispatch('setFilter', { price: value })
    }
  }
}
</script>

<style scoped>
  .filter-title{
    font-size: 18px;
    font-weight: bold;
  }
  .filter-control-container {
    padding: 10px;
    flex: none
  }
  .filter-box {
    margin: 20px;
  }

</style>
