<template>
  <nav class="navbar is-transparent is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <h1 class="title">Loop Line Viewer</h1>
        </a>

        <div class="navbar-burger" v-on:click="toggleBurger" :class="{ 'is-active': burgerActive }" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navMenu" class="navbar-menu" :class="{ 'is-active': burgerActive }">
         <div class="navbar-start">
           <div class="navbar-item has-dropdown is-hoverable">
             <a class="navbar-link" href="/">
               Lines
             </a>
             <div class="navbar-dropdown is-boxed">
              <ul>
                 <router-link tag="li" class="navbar-item" v-for="line in lines" :key="line.name" :to="{ name: 'Products', params: {line_id: line.name} }">
                   <a v-on:click="toggleBurger">{{ line.name }}</a>
                 </router-link>
               </ul>
             </div>
           </div>
         </div>

         <div class="navbar-end"></div>
       </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'
import config from '@/config'

export default {
  name: 'Navbar',
  data () {
    return {
      msg: 'Navbar',
      burgerActive: false,
      lines: []
    }
  },
  methods: {
    loadLines () {
      axios.get(`${config.API_HOST}/api/all`)
        .then((response, err) => {
          this.lines = response.data
        }, (err) => {
          console.log(err)
        })
    },
    toggleBurger () {
      this.burgerActive = !this.burgerActive
    },
    hideBurger () {
      this.burgerActive = false
    }
  },
  watch: {
    // Call the method again if the route changes
    '$route': 'hideBurger'
  },
  mounted () {
    this.loadLines()
  }
}
</script>

<style lang="scss">
</style>
