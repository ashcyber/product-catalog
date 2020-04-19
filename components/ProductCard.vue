<template>
  <div class="product-card-container">
    <v-card width="250" default>
      <v-img
        class="white--text align-end"
        :src="product.image"
        height="250px"
      />
      <v-card-title class="card-title">
        {{ product.name }}
      </v-card-title>
      <v-card-subtitle class="subtitle">
        {{ product.description }}
      </v-card-subtitle>
      <div class="product-price">
        Price: ${{ product.price }}
      </div>
      <div class="tags">
        Tags:
        <span class="category-tag">
          {{ product.category }}
        </span>
        <span class="vendor-tag">
          {{ product.vendor }}
        </span>
      </div>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    product: Object
  }
}
</script>

<style lang="scss" scoped>
.product-card-container {
    display: flex;
    justify-content: center
}
.product-price {
  padding-top:0;
  padding-left: 16px;
  padding-bottom: 16px;
}

.subtitle {
    max-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.card-title {
  font-size: 14px;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tags {
  padding: 20px;
  span {
    border-radius: 10px;
    margin-right: 5px;
    padding: 5px;
    text-align: center; 
    color: #ffffff
  }

  .vendor-tag {
    background-color: #1867c0;  
  }
  .category-tag {
    background-color: #f44336;
  }

}

</style>
