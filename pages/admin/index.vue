<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Product Catalog - Login form</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="email" label="Email" name="email" type="text" />

                  <v-text-field
                    id="password"
                    v-model="password"
                    label="Password"
                    name="password"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="handleSubmit">
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { loginAdmin } from '~/services/AdminService'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  middleware: 'notAuthenticated',
  methods: {
    handleSubmit () {
      loginAdmin({ email: this.email, password: this.password }).then((res) => {
        if (res) {
          const auth = {
            accessToken: res
          }
          Cookie.set('jwtAuthToken', auth)
          this.$store.commit('SET_AUTH', auth)
          this.$router.push('/admin/dashboard')
        }
      })
    }
  }
}
</script>
