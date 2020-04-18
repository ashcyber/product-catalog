<template>
  <v-app>
    <div class="filter-box">
      <div class="category-filter">
        <div class="filter-title">
          Category Filter
        </div>
        <v-container class="filter-control-container">
          <v-checkbox label="Party" />
          <v-checkbox label="Camera" />
          <v-checkbox label="Electronics" />
        </v-container>
      </div>
      <div class="vendor-filter">
        <div class="filter-title">
          Vendor Filter
        </div>
        <v-container class="filter-control-container">
          <v-checkbox label="GBR" />
          <v-checkbox label="AST" />
          <v-checkbox label="RPC" />
        </v-container>
      </div>
      <div class="price-filter">
        <div class="filter-title">
          Price Filter
        </div>
        <v-container class="filter-control-container">
          <v-range-slider
            v-model="value1"
            step="1000"
            min="0"
            max="10000"
            ticks="always"
          />
          Price range : ${{ value1[0] }} to ${{ value1[1] }}
        </v-container>
      </div>
      <div class="stock-filter">
        <div class="filter-title">
          In Stock
        </div>
        <v-container class="filter-control-container">
          <v-checkbox label="All" />
          <v-checkbox label="Yes" />
          <v-checkbox label="No" />
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      value1: [500, 6000]
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
  }
  .filter-box {
    margin: 20px;
  }
</style>
