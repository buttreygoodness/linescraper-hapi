<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ msg }}
          </h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container lines">
        <div class="tile is-ancestor">
          <div class="tile is-3 is-parent" v-for="line in lines">
            <div class="tile is-child has-text-centered">
              <router-link :to="{ name: 'Products', params: {line_id: line.name} }">
                <img :src="logoPath(line.name)">
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'

export default {
  name: 'Lines',
  data () {
    return {
      msg: 'Lines',
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
    logoPath (name) {
      return `/static/img/logos/${name}.png`
    }
  },
  mounted () {
    this.loadLines()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
