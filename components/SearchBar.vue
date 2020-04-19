<template>
  <v-container class="search-row">
    <div>
      <v-text-field
        v-model="search"
        solo
        class="search-box"
        label="Search"
      />
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  },
  watch: {
    search (newSearch) {
      this.$store.dispatch('setFilter', { search: newSearch })
    }
  }
}
</script>

<style scoped>
 .search-box {
     width: 500px;
 }
</style>
