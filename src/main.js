import Vue from 'vue'
import App from './App.vue'
import axios from 'axios' // ovde smo importovali axios da bi mogli da setujemo kao neki global url, tj url nase baze koja se ne menja jelte, i na vise mesta u projektu se koristi, pa da se tamo ne ponavljamo, mozemo ovde da setujemo kao neki global, kao sto je recimo sa vue-resources islo sa http.options.root

import Vuelidate from 'vuelidate'

import router from './router'
import store from './store'

Vue.use(Vuelidate)

axios.defaults.baseURL = 'https://max-axios-authorization.firebaseio.com' // base url, setovanje base url-a mozemo sa defaults objektom. Ovo je objekat sa kojim axios radi, i on nam omogucava da setujemo neka difoltna podesavanja i ta podesavanja koja setujemo ovde, mogu takodje biti setovana i tamo za recimo neki odredjen rikvest kao drugi/treci argument, ako zelimo da setujemo neko specificno podesavanje
	// a ovde setujemo za global sto znaci da ce biti setovano za svaki rikvest. A ono sto zelimo za svaki rikvest je da se pristupoa istoj url adresi

// axios.defaults.headers.common['Authorization'] = 'neko setovanje za authorzation' // takodje mozemo da konfigurisemo headers. Elem, axios ce uvek staviti bar neki difoltni header, ali ako mi zelimo neki drugi, mozemo ovde da setujemo. Potom u headers imamonekoliko razlicitih targets: mozemo staviti common da setujemo headers sto ce se odraziti na svaki rikvest, bez obzira kog je tipa, potom mozemo da stavim onas licni header daodavajuci property u ['nas-licni-header'], recimo Authorization header i onda da ga setujemo u nesto, ovo je dobar nacin da se recimo posalje neki genericki token na backend za svaki rikvest

axios.defaults.headers.get['Accepts'] = 'application/json' // ako zelimo da setujem oehgader za specijalni rikvest to mozemo ovako 
// i sada mozemo da vidimo ovo u Network delu u web developer toolsu

const reqInterceptor = axios.interceptors.request.use(config => {
	console.log('Request interceptor: ', config)
	// config.headers.common['Authorization'] = 'neko setovanje za authorzation' // recimo, al mozemo staviti cime god zelimo da manipulisemo rikvest konfiguracijom. Recimo da proverimo da li je nesto slucaj, i onda usput poresimo konfiguraciju, za slucajeve gde bi neki genericki setovi kao recimo ovi gore (axios.defaults...) bili too much, too generic, gde god je neki rikvest targetivan
	return config
}) // interceptors (presretaci, prekidaci) su funkcije u kojima mozemo da definisemo koji podatak treba da executujemo za svaki rikvest koji napusta app??? ili koji god response da je postignut. Kada pristupimo interceptors objektu onda mozemo da biramo izmedju rikvesta i repsonsa u zavisnosti koji interceptors zelimo da kreiramo, i onda dodajemo novi interceptor koristeci use() metod. On sada prihvata f-ju, ta f-ja prima rikvest konfiguraciju kao argument, a unutar te f-je mi bar moramo da returnisemo ovu konfiguraciju, u suprotnom cemo BLOKIRATI RIKVEST

const resInterceptor = axios.interceptors.response.use(res => {
	console.log('Response interceptor: ', res)
	return res //! i dakle obavezno moram da vratim res jer, u suprotnom nas kod u aplikaciji koji ceka res nikad ga nece primiti, dakle interceptors su uvek kao neki middleware (posrednik), radi izmedju, jer oni retko treba da blokiraju neki rispons ili rikvest
})

// ponekad nam treba to da uklonimo interceptor:
axios.interceptors.request.eject(reqInterceptor) // sa eject() brisemo neki interceptor, konkretno ovde request interceptor, eject()-u treba ID interceptora, a ID je cesto vracen iz baze iz use()metoda, samo treba da ga sacuvamo u neke const
axios.interceptors.response.eject(resInterceptor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


//! stgo se tice axiosa, on je third party paket, i on se ne integrise sa vue kao ostali (vue) paketi sa Vue.use(imeImportaPaketa) vec ono, tamo gde zelimo da naopravimo rikvest, tamo importujemo axios from axios i pravimo rikvestove. Pa tako recimo zelimo da sabmitujemo podatke iz forme u signup.vue page i posle zelimo da mozemo da dohvatimo i potom pristupimo tim podacima sa dashboard.vue stranice