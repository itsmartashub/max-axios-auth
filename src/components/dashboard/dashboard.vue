<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
	<p v-if="email">Your email address: {{ email }}</p>
	<!--  greska: Error in render: "TypeError: Cannot read property 'email' of null" se javlja jer pokusavamo da pristupamo emailu odmah po renderovbanju komponente, a nemamo odmah pristup tome, vec tek kad se autorizujemo/signinujemo/signupujemo. To cemo popraviti sa: return !this.$store.getters.user ? false : this.$store.getters.user.email  -->
  </div>
</template>

<script>
// import axios from 'axios'

export default {

	// data() {
	// 	return {
	// 		email: '' // treba da setujemo ovaj mail sa podacima koje smo dobili od servera, dakle u then() bloku jer tu pristupamo podacima. BTW da se zna, ne mozemo van tog then bloka, recimo posle opnog catch-a da napisemo this.email = resp.email, jer logicno, pristup responsu imamo samo unutar then() bloka jer je to ASINHRONI KOD, taj kod unutar then bloka se pokrene negde tamo u buducnosti, a kod nakon axios.get se opali momentalno nakon sto je ovo gotovo, bez da se ceka na taj future response
	// 	}
	// },

	computed: {
		email () {
			// return this.$store.getters.user.email
			return !this.$store.getters.korisnik ? false : this.$store.getters.korisnik.email
		}
	},

	created() { // zelimo da ucitamo nesto kada se UCITA ova stranica/komponenta
			// axios.get('/korisnici.json') // za get() nam treba minimalno jedan argument, to je URL sa kojeg zelimo da dohvatimo nesto
			// 		.then(resp => {
			// 			console.log(resp)
			// 			// nas resp sadrzi js objekat u kom imamo pristup propertiju data, koji sadrzi unikatne cryptic keys oznake, kao neki id, gde su onda podaci o korisniku vrednost ovih kljuceva. Tako da ono sto bi trebalo da uradimo jeste da lupujemo kroz sve ove keys da dodjemo do email adresa 
			// 			// prvo hajde da objekat pretvorimo u niz da mzoemo da lupujemo kroz njega:
			// 			const podaci = resp.data
			// 			const arrKorisnici = [] // niz u koji cu sacuvati ovaj objekat tj prorpertije or whatever
			// 			for (let key in podaci) { // ovo key ce biti value of the cryptic keys
			// 				// arrKorisnici.push(podaci[key])
			// 				const korisnik = podaci[key] // da svaki taj key oznacava nekog korisnika
			// 				korisnik.id = key // dodelili smo svakom korisniku onaj cryptic key da bude id
			// 				arrKorisnici.push(korisnik)
			// 			}

			// 			console.log(arrKorisnici)
			// 			this.email = arrKorisnici[0].email
			// 		})
			// 		.catch(err => console.log(err))

			// 		// this.email = resp.email // NE VALJA OVDE POGLEDAJ GORE KOMENTAR ZASTO
			this.$store.dispatch('fetchUser')
	}
}
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>