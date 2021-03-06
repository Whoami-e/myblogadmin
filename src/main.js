import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'
import {checkToken} from "@/api/api";
import constants from "@/utils/constants";
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false
Vue.prototype.blog_constants = constants;

Vue.component('leftMenu',leftMenu);
Vue.component('topHeader',topHeader);
Vue.use(ElementUI);
// Vue.use(mavonEditor)

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    checkToken().then(result => {
      // console.log(result)
      if (result.code === 20000) {
        window.localStorage.setItem('avatar',result.data.avatar);
        //登录成功，判断角色
        if (result.data.roles === 'admin') {
          next();
        } else {
          location.href = 'https://pro-monkey.club/';
        }
      } else {
        //跳转到登录
        next({
          path: '/login'
        })
      }
    });
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
