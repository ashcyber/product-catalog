<template>
  <v-app>
    <div>
      <v-app-bar
        color="deep-black accent-4"
        dark
      >
        <v-spacer />
        <v-btn class="download-btn" color="primary" @click="handleDownloadFile">
          Download Stats
        </v-btn>
        <v-btn color="secondary" @click="handleLogout">
          Logout
        </v-btn>
      </v-app-bar>
      <div class="add-form-container">
        <h1 class="form-title">
          Add Product
        </h1>
        <v-text-field v-model="name" filled label="Product Name" />
        <v-text-field filled label="Url Slug" disabled :value="urlSlug" />
        <v-text-field v-model="price" filled label="Price" type="number" />
        <v-text-field v-model="image" filled label="Image url" />
        <v-radio-group v-model="category" label="Category: " row>
          <v-radio
            label="cameras"
            value="cameras"
          />
          <v-radio
            label="party"
            value="party"
          />
          <v-radio
            label="electronics"
            value="electronics"
          />
        </v-radio-group>
        <v-radio-group v-model="vendor" label="Vendor: " row>
          <v-radio label="AST" value="AST" />
          <v-radio label="GBR" value="GBR" />
          <v-radio label="RPC" value="RPC" />
        </v-radio-group>
        <v-textarea v-model="description" filled label="Description" />
        <div class="button-area">
          <v-btn @click="handleSubmit">
            Submit
          </v-btn>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>

import { postProduct, logoutAdmin, downloadFile } from '~/services/AdminService'
const values = {
  name: '',
  price: undefined,
  image: '',
  description: '',
  category: '',
  vendor: ''
}

export default {
  middleware: 'authenticated',
  data () {
    return {
      ...values
    }
  },
  computed: {
    urlSlug () {
      return this.name.split(' ').join('-')
    }

  },
  methods: {
    handleSubmit () {
      let isFormValid = true

      for (const key in values) {
        if (this[key] === undefined || this[key] === '') {
          isFormValid = false
          break
        }
      }

      if (isFormValid) {
        const data = {}
        Object.keys(values).map((key) => {
          data[key] = this[key]
        })
        data.slug = this.slug
        postProduct(data).then(() => {
          alert('Product Added Successfully')
        }).catch(() => {
          alert('Failed to add product')
        })
      } else {
        alert('Please enter all the values correctly')
      }
    },
    handleLogout () {
      logoutAdmin()
      this.$store.commit('SET_AUTH', null)
      this.$router.push('/')
    },
    handleDownloadFile () {
      downloadFile()
    }
  }
}
</script>

<style>
.add-form-container {
  padding: 10px;
  width: 500px;
  height: 750px;
  margin: 50px;
  margin-left: auto;
  margin-right: auto;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
}

.button-area {
  text-align: center;
}

.download-btn {
  margin-right: 10px;
}
</style>
