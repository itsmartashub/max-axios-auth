import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store.js'

import WelcomePage from './components/welcome/welcome.vue'
import DashboardPage from './components/dashboard/dashboard.vue'
import SignupPage from './components/auth/signup.vue'
import SigninPage from './components/auth/signin.vue'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: WelcomePage },
	{ path: '/signup', component: SignupPage },
	{ path: '/signin', component: SigninPage },

	{
		path: '/dashboard',
		component: DashboardPage,
		beforeEnter (to, from, next) {
			// samo ako je user auth tj autorizovan onda mozemo da nasatvimo do sadrzaja ove dashboard putanje. A da bi uzeli informacije iz store-a, moramo da importujemo store
			if (store.state.IDtoken) {
				next()
			} else {
				next('/signin') // a ako je IDtoken false, null, ako ga nema, onda zelimo da redirektujemo do /signin stranice. Meni nece da redirektuje, samo error u konzoli: TypeError: Cannot read property 'IDtoken' of null
			}
		}
	}
]

export default new VueRouter({mode: 'history', base: process.env.BASE_URL, routes})