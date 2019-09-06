/* eslint-disable */ 
import Vue from 'vue'
import Vuex from 'vuex'

import axiosInstanca from '@/axios-auth.js'
// import axiosInstanca from './axios-auth.js'
import globalAxios from 'axios'
import router from '@/router.js'
Vue.use(Vuex)

export default new Vuex.Store({
// * ============== STATE ==============
  state: {
	  IDtoken: null,
	  userID: null,
	  user: null

  },


// * ============== MUTATIONS ==============
  mutations: { // tu mozemo da skladistimo nas token koji cemo koristiti za rikvestove. Logovanje nasih korisnika
	authUser (state, userData) {
		state.IDtoken = userData.token
		state.userID = userData.userId // dakle ocekujemo ova dva propertija u ovom  userData objektu, pa hajde da ih napravimo i prosledimo (ovo token, userId u userData). A prosledjujemo ih kada komitujemo ovo authUser u .then() bloku, i za sign up i sa sign in
	}, //! Cannot set property 'IDtoken' of null

	storeUser (state, user) {
		state.user = user
	},

	clearAuthData (state) { // za logout
		state.IDtoken = null,
		state.userID = null
	}

  },



// * ============== ACTIONS ==============
  actions: {
	  setLogoutTimer ({commit}, expirationTime) { //  svaki x kad rifresujemo nasu app, gubi se token, a to naravno ne zelimo. Elem, postoji u firebase response data refreshToken properti u kom se nalazi token zauvek takoreci, medjutim, on je manje siguran/bezbedan. Zato cemo mi ovaj token klasican, koji inace firebase namestio da traje 3600s iliti 1h, da produzeimo nekako:
			setTimeout(() => {
				commit('clearAuthData') // samim tim ce se desiti logout')
				// elem, ovde smo umesto ovog commita mogli da uradimo dispatch('logout'), kao neka alternativa
				// dispatch('logout')
			}, expirationTime * 1000) // ovo ce automatski konvertovati ovaj expirationTime string broj "3600" u realni broj, a potom, nakon 1000  minuta (jer ovo u setTimeoout su milisekunde, a 3600 * 1000 je 3.600.000ms iliti 3600s iliti 1h) zelimo da se opali ova callback f-ja tj clearAuthData, samim tim ce se desiti logout. Sada naravno moramo da dispatchujemo ovaj setLogoutTimer a to cemo uraditi IZ LOGOUT metoda, i takodje cemo uradtii i za signup. Da proverimo da li ovo radi obrisacemo ovo * 1000 da ne bi cekali sat vremena da se automatski izloguje vec 3.6s
	  },

	  signup ({commit, dispatch}, authData) {
		  axiosInstanca.post('/accounts:signUp?key=AIzaSyBCjeuhPUHsb_uhbYwU4wzDbDkoZXgk0CQ', {
			  email: authData.email,
			  password: authData.password,
			  returnSecureToken: true
		  }).then(res => {
				// console.log(res)
				commit('authUser', {
					token: res.data.idToken, // pravimo sad taj userData objekat, token ce imati vrednost tokena iz responsa, koji se nalazi u data.idToken (ovo je u firebase)
					userId: res.data.localId
				})

				// elem, kada se stranica reloaduje gubi se token, jer token se cuva kao js (jer vue je js app) a sve sto se cuva kao js prilikom reloada se gubi, ali zato mozemo koristiti browser API tj localStorage za cuvanje podataka da bi mogli da idemo kroz app autorizovani ako se smo se vec ulogovali, dakle u localstorage cemo da sacuvamo token
				const now = new Date()
				const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000) // posto je res.data.expiresIn izrazeno u milisekundama, na promenljivu now pozivamo metod getTime() da konvertujemo u milisekunde. I onda sve ovo moramo da konvertujemo u neki datum sa new Date
				localStorage.setItem('LStoken', res.data.idToken)
				// localStorage.setItem('LSexpiresIn', res.data.expiresIn) // ovo bas i nije pametno, jer je mudrije da sacuvamo VREME kada se korisnik ulogovao, tj kada je token oformljen, a ne vreme koliko traje iliti za koliko sekundi istice (3600s). Zato pravimo varijablu sa new Date() u vreme registrovanaj, i onda za vreme isticanja tokena stavljamo taj datum kad smo napravili token + sekudni iliti vreme koliko traje token (tj firebase expiresIn puta 1000)
				localStorage.setItem('LSuserId', res.data.userId)
				localStorage.setItem('LSexpirationDate', expirationDate) 

				dispatch('storeUser', authData) // a ovo ovde authData su podaci koje primam iz signup.vue fajla kada dispatchujemo signup i passujemo objekat onaj, koji cemo sad opet staviti da bude formData

				dispatch('setLogoutTimer', res.data.expiresIn)
			})
		  	.catch(err => console.log(err))
	  },

	  login ({commit, dispatch}, authData) {
		  axiosInstanca.post('/accounts:signInWithPassword?key=AIzaSyBCjeuhPUHsb_uhbYwU4wzDbDkoZXgk0CQ', {
			  email: authData.email,
			  password: authData.password,
			  returnSecureToken: true
		  }).then(res => {
			  console.log('login res: ', res)

			const now = new Date()
			const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
			localStorage.setItem('LStoken', res.data.idToken)
			localStorage.setItem('LSuserId', res.data.userId)
			localStorage.setItem('LSexpirationDate', expirationDate) 

			  commit('authUser', {
				  token: res.data.idToken,
				  userId: res.data.localId
			  })

			  dispatch('setLogoutTimer', res.data.expiresIn)
		  })
		  	.catch(err => console.log(err))
	  },
	  // sada mozemo ove radnje/actions da dispatchujemo u signup.vue i signin.vue

		tryAutoLogin ({commit}) { // automatski cekiramo da li je korisnik uloigovan, tj da li mu nije istegao token ukoliko se vec logovao ranije
			// ako nema token u ls
			const LStoken = localStorage.getItem('LStoken')
			if (!LStoken) {
				return
			}

			// ako ima token u ls
			const LSexpirationDate = localStorage.getItem('LSexpirationDate')
			const now = new Date() // pravimo now promenljivu  u kojoj je datum u trenutku ucitavanja App.vue komponente,  iporedimo potom taj datum sa onim kad token u ls-u istice, ako je jednak ili veci od tog datuma isteka tokena u ls-u, znaci da je istekao token
			// ako je istekao token
			if (now >= LSexpirationDate) {
				return 
			}
			// ako nije istekao token, onda zelim da se loginujem tj da komitujem authUser mutation, on zahteva za argument userData iliti objekat u kom su idToken i userId, tako da moram i to da sejvujem u LS
			const LSuserId = localStorage.getItem('LSuserId')
			commit('authUser', {
				token: LStoken, //! token mora da ima ime token jer smo to ime pozivali gore u authUser za onaj obj userData, isto vazi i za ovo dole userId
				userId: LSuserId
			})
		}, // idemo ovaj action da pozovemo tj dispatchujemo u App.vue u created () lifecycle hook

		logout ({commit}) {
			commit('clearAuthData') // medjutim, kada se izlogujemo recimo dok smo na dashboard stranici, i dalje ostajemo na ovoj stranici ako smo izlogovani, treba oo da promenimo. Treba da importujemo router from router, i potom ovde da za router pushujemo ili jos bolje da replace-ujemo na neku putanju

			//takodje zelimo da prilikom logout-a obrisemo LSexpirationDate, LStoken i LSuserId
			localStorage.removeItem('LSexpirationDate')
			localStorage.removeItem('LStoken')
			localStorage.removeItem('LSuserId')

			router.replace('/signin') //! bolje je REPLACE nego PUSH jer sa push mozemo da se vratimo nazad sa mouse back buttom ili u browseru ona strelica za back, dok sa replace ne moze!!! MADA, evo probala sam, ne moze nazad ni sa push
		},

		storeUser ({commit, state}, userData) { // ovo state je current state of context object, a state je naravno mesto gde cuvamo/store token
			if(!state.IDtoken) { // ako je IDtoken null, tj nema ga, onda samo zelimo da se okine return i ostatak koda nakon ovog ifa se nece ni odraditi, jer ni ne treba ako nemamo token korisnika, a ako imamo token, onda treba da appendujemo nesto url-u ovom gde dodajemo /korisnici.json, a to je ?auth= i + state.IDtoken neke baze to rade preko headera u athorization, sa firebase moze ovaj query auth 
				return console.log('NEMA TOKENA storeUser')
			}
			 globalAxios.post('/korisnici.json' + '?auth=' + state.IDtoken, userData) //a podaci koje zelim da postujem su ovi koje cu dobiti kao argument u storeUser action, koje cemo proslediti u storeUser kada budemo dispatchovali ovaj metod, nazvacemo ga userData
			 	.then(res => {
					 console.log('storeUser res: ',  res)
				 })
				 .catch(err => console.log(err))
		}, // ovaj metod storeUser dispatchujemo kada dohvatimo user podatke dakle kada odradimo authentifikaciju. Dobra stvar je sto tamo u signup gde imamo pristup commitu takodje mozemo da imamo pristup dispatchu {commit, dispatch}
		
		fetchUser ({commit, state}) { // e sad ovde moramo biti pazljivi, za signin i signup koristili smo custom axios modal tj axios instancu koju smo mi napravili, a za ovo, tj fetchUser nam treba onaj general pravi axios modal
			if(!state.IDtoken) {
				return
			}
			globalAxios.get('/korisnici.json' + '?auth=' + state.IDtoken)
				.then(res => {
					console.log('fetchUser res: ', res.data)
					const podaci = res.data
					const arrKorisnici = []
					for(let key in podaci) {
						const korisnik = podaci[key]
						korisnik.id = key
						arrKorisnici.push(korisnik)
					}
					// this.email = arrKorisnici[0].email

					// const arrKorisnici = Object.keys(podaci).map(key => {
					// 	const korisnik = podaci[key]
					// 	korisnik.id = key

					// 	return {
					// 		key: key,
					// 		value: podaci[key]
					// 	};
					// })

					console.log(arrKorisnici)
					commit('storeUser', arrKorisnici[0])
					
				})
				.catch(err => console.log(err))

				// sa signupom mi ustvari ne cuvamo nikakve podatke u database, mi samo upisujemo korisnika i onda ga cuvamo u nekoj drugoj bazi (auth firebase bazi). Tako da su tu dve stvari koje zelimo da uradimo pre nego sto krenemo da koristimo token: 1. kada se korisnik signupuje, dakle kada je uspesan onaj sign up u bloku, zelimo da dispatchujemo DRUGU action, i takodje da sacuvamo korisnikove podatke u firebase DATABASE, a ne samo u firebase AUTHENTIFICATION kojoj nemamo pristup. A 2.stvar koju zelimo da uradimo je da fetchujemo data, a za oboje, dakle i za store data i za fetch dana van ove firebase AUTHENTIFICATION sveta, treba da setujemo razlicite url adrese tj razl bazeURL, i zato treba za ovo da importujemo i koristimo globalAxios. Pocnimo sa storeDUser, kada ovo zelim da uradim? kada  se korisnik signupuje. Idemo iznad ovog fetch data da napravimo storeData
		}
	},



// * ============== GETTERS ==============
	getters: {
		korisnik (state) {
			return state.user
		},

		isAuthenticated (state) { // sta korisnik vidi ako je authentificovat, a sta ne vidi
			return state.IDtoken !== null // dakle ako token nije jednako null, znaci da imamo token i da je korisnik autentifikovan. I sada mozemo ovaj metod da koristimo u header.vue
		}
	}
	
})
