<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <img :src="logo_img">
          </h1>
        </div>
      </div>
    </section>

    <div class="container is-widescreen">
      <section class="section" v-for="item in line">
        <h2 class="subtitle">
          {{ item.title }}
        </h2>
        <div class="tile is-ancestor">
          <div class="tile is-4 is-vertical is-parent" v-for="collection in item.collections">
            <div class="tile is-child box">
              <a :href="collection.link" target="_blank">
                <p>{{ collection.title }}</p>
                <img :src="collection.image">
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'

export default {
  name: 'Products',
  data () {
    return {
      msg: '',
      logo_img: '',
      line: {}
    }
  },
  methods: {
    loadLine () {
      axios.get(`${config.API_HOST}/api/${this.$router.currentRoute.params.line_id}`)
        .then((response, err) => {
          this.line = response.data
          this.msg = this.$router.currentRoute.params.line_id
          this.logo_img = `/static/img/logos/${this.$router.currentRoute.params.line_id}.png`
        }, (err) => {
          console.log(err)
        })
    }
  },
  watch: {
    // Call the method again if the route changes
    '$route': 'loadLine'
  },
  mounted () {
    this.loadLine()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
