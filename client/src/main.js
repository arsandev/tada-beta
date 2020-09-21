import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'nprogress/nprogress.css'
import VueSignaturePad from 'vue-signature-pad';
import VueCookies from 'vue-cookies'
import swal from 'sweetalert'
import toastr from 'toastr'
import 'vue-search-select/dist/VueSearchSelect.css'

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

Vue.use(VueCookies)
Vue.use(VueSignaturePad);
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.toastr = toastr
Vue.prototype.swal = swal
Vue.prototype.api = '/api'
Vue.prototype.token = Vue.$cookies.get("ttdt")

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
