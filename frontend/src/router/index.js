import Vue from 'vue'
import Router from 'vue-router'
import Lines from '@/components/Lines'
import Products from '@/components/Products'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Lines',
      component: Lines
    },
    {
      path: '/products/:line_id',
      name: 'Products',
      component: Products
    }
  ]
})
