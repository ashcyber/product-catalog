import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import upperFirst from 'lodash/upperFirst'; 
import camelCase from 'lodash/camelCase'; 

Vue.config.productionTip = false;

const requireComponents = require.context(
  './components', 
  false, 
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponents.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponents(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
