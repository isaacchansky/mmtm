import Vue from 'vue';
import 'firebase/firestore';
import Vue2TouchEvents from 'vue2-touch-events';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vue2TouchEvents);

export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
