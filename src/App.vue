<template>
  <div id="app">
    <app-header />
    <router-view></router-view>
  </div>
</template>

<script>
	import Header from './components/header/header.vue'
		export default {
		name: 'app',
		components: {
			'app-header': Header
		},

		created () { // da prilikom kreiranja ove komponente automatski cekiramo da li je korisnik uloigovan, tj da li mu nije istegao token ukoliko se vec logovao ranije
			this.$store.dispatch('tryAutoLogin')
		}
	}
</script>

<style>
  body, html {
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
</style>