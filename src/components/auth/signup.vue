<template>
<div id="signup">
	<div class="signup-form">
		<form @submit.prevent="onSubmit">
			<div class="input" :class="{invalid: $v.email.$error}">
				<!-- bajndovaacu klasu koja ce se zvati invalid. Ako ovo $error bude true, ovaj div ce dobiti i klasu invalid koja, zasto $error a ne $invalid , posto ima i $invalid, jer $error se menja cim je forma touched ili ne, ono, korisnik moze da promeni vrednost inputa i u zavisnosti od toga error se menja, wtfff  -->
				<label for="email">Mail</label>
				<input
						type="email"
						id="email"
						@blur="$v.email.$touch()"
						v-model="email">
						<!-- kako sad da registrujemo negde vuelidate? sa @input="$v" dajemo do znanja da zelimo da koristimo vuelidate, $v je nesto poput $event, potom mozemo pozvati metod koji smo napravili, dakle email, i obavezno potom da stavimo vuelidate metod $touch() i ovo informise  vuelidate da treba da proveri da li je input gde smo registrovali ovaj kod sa @input eventom, da li ispunjava zahteve email validation pravila. A kako da vidimo da li ovo fnise? Hajmo da dodamo div ispod ovog inputa i outputujemo $v -->
				<!-- <div>{{ $v }}</div> -->
				<!-- { "email": { "required": false, "email": true, "$model": "", "$invalid": true, "$dirty": true, "$anyDirty": true, "$error": true, "$anyError": true, "$pending": false, "$params": { "required": { "type": "required" }, "email": { "type": "email" } } }, "$model": null, "$invalid": true, "$dirty": true, "$anyDirty": true, "$error": true, "$anyError": true, "$pending": false, "$params": { "email": null } } -->
				<p v-if="!$v.email.email">Please provide a valid email address.</p>
				<p v-if="!$v.email.required">This field must not be empty</p>
			</div>
			<div class="input" :class="{invalid: $v.age.$error}">
				<label for="age">Your Age</label>
				<input
						type="number"
						id="age"
						@blur="$v.age.$touch()"
						v-model.number="age">
				<p v-if="!$v.age.minVal">You have to be at least {{ $v.age.$params.minVal.min }} years old</p>
				<!-- mozmeo pristupiti agrumentu u onom minValue() metodu koji smo stavili (18) sa $v.age.$params.minVal.min -->
			</div>
			<div class="input" :class="{invalid: $v.password.$error}">
				<label for="password">Password</label>
				<input
						type="password"
						id="password"
						@blur="$v.password.$touch()"
						v-model="password">
				<p v-if="!$v.password.minLen">Your password must contains {{ $v.password.$params.minLen.min }} or more characters</p>
			</div>

			<div class="input" :class="{invalid: $v.confirmPassword.$error}">
				<label for="confirm-password">Confirm Password</label>
				<input
						type="password"
						id="confirm-password"
						@blur="$v.confirmPassword.$touch()"
						v-model="confirmPassword">
				<p v-if="!$v.confirmPassword.$sameAs">Your passwords doesn't match</p>
			</div>

			<div class="input">
				<label for="country">Country</label>
				<select id="country" v-model="country">
				<option value="usa">USA</option>
				<option value="india">India</option>
				<option value="uk">UK</option>
				<option value="germany">Germany</option>
				</select>
			</div>


			<div class="hobbies">
				<h3>Add some Hobbies</h3>
				<button @click="onAddHobby" type="button">Add Hobby</button>
				<div class="hobby-list">
					<div
							class="input"
							v-for="(hobbyInput, index) in hobbyInputs"
							:key="hobbyInput.id"
							:class="{invalid: $v.hobbyInputs.$each[index].$error}">

						<label :for="hobbyInput.id">Hobby #{{ index }}</label>

						<input
								type="text"
								:id="hobbyInput.id"
								@blur="$v.hobbyInputs.$each[index].value.$touch()"
								v-model="hobbyInput.value">
								<!-- za $each[index] prosledjujemo index elementa na kom smo trenutno, a ovo index je gore iz v-fora, i to je element koji zelimo da $touchujemo, al zapravo zelimo da touchujemo VALUE tog elementa -->
						<button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
					</div>
					<p v-if="!$v.hobbyInputs.minLen">You have to specify at least {{ $v.hobbyInputs.$params.minLen.min }} hobbies</p> <!-- ovo sad ne radi jer minLen: minLength(1) nikad nije invalidno, dakle ako dodamo hobi ispunili smo kriterijum, ako ga uklonimo vratili smo se na untouched fazu, i promenimo to na 2 -->
					<p v-if="!$v.hobbyInputs.required">Please add hobbies.</p>
					
				</div>
			</div>


			<div class="input inline" :class="{invalid: $v.terms.$invalid}"><!-- za checkbox ipak da stavimo $invalid a ne $error jer za error nece da radi odmah po ucitavanju stranice i to da li smo touch checkbox, radi na change -->
				<input 
						type="checkbox"
						id="terms"
						@change="$v.terms.$touch()"
						v-model="terms">
				<label for="terms">Accept Terms of Use</label>
			</div>
			
			<div class="submit">
				<button type="submit" :disabled="$v.$invalid">Submit</button>
				<!-- za ovo :disabled bi po nekoj nasoj staroj logivi stavljali $v.email.$error || $v.age.$error || ...... itd itd, ali je ustvari mng lakse i logicnije staviti $v.$error, da osluskujemo ovim da li je ijedan od nasih vuelidations fejlovao, i ako je ta $error vrednost true, onda je dugme submit disejblovano, a jos je mudie ako stavimo $v.$invalid da btn disejblujemo od samog starta, a ne samo nakon sto korisnik krene nesto da kuca -->
			</div>
		</form>
	</div>
</div>
</template>

<script>
// import axios from 'axios'
// import axiosInstanca from '../../axios-auth' // importovali smo kao axiosInstanca al ovo ime moze koje god, mogli smo i kao axios, bitno je ovo from, i sta iz rog fajla koji gadjamo sa from exportujemo (instanca)
import { required, email, numeric, minValue, minLength, sameAs, requiredUnless } from 'vuelidate/lib/validators' // vidi dokumentaciju https://vuelidate.netlify.com/#sub-builtin-validators
import axios from 'axios'

export default {
data () {
	return {
		email: '',
		age: null,
		password: '',
		confirmPassword: '',
		country: 'usa',
		hobbyInputs: [],
		terms: false
	}
},

validations: { // vuelidate property
	email: { // ovo ime MORA biti isto kao promenljiva koju zelimo da cekiramo jer ga tako vuelidate prepoznaje sta treba da proverava
		// req: required,
		// mail: email

		required, // required: required. da li je polje empty
		email, // email: email. Da li je email validan
		unikatno: val => { //* sada je vreme za async validaciju, tj validaciju u koju moramo da umesamo i server tj bazu, tj da cekiramo da imejl koju je korisnik uneo vec postoji u bazi. Za to pravimo nas custom validator, ovo ime moze biti bilo koje. Ovde pravmo f-ju koja ce za argument da ima val i ta fja ce vracati true ili false, ili sta god da mi stavimo za ovu validaciju. Recimo da stavimo return false, sta goood da korisnik ukucau email input field, nece biti validno, nema veze ako je ispunioo ova vuelidate provere koje smo dali, nije ispunio custom 
			// return false
			// return val !== 'authtoken3@authtoken3.com' // ako vrednost koju je umeo korisnik nije ista kao ova, ovaj upit ce biti true, i bice return true, dakle validno
			//? e sad kako ovo da napravimo async? Jednostavno treba da vratimo Promise i vuelidate je onda sposoban sam da preuzme radnju
			if (val === '') return true // prvo cemo proveriti da li je uopste val prazan string, ako jeste, dakle ako korisnik nista nije uneo, onda vracamo true, dakle ova nasa fja bude true, i onda ne marimo da li je unikatno ili ne jer je polje prazno, da se bzvz ne odradi ova ASINHRONA f-ja a polje prazno. Ova nasa unikatno f-ja ne mari da li je polje prazno ili ne, on ne tretira prazno kao lose, to nije njegov posao i to je vazno, to je posao onog iznad required. Ovim se brinemo da bzvz ne pokrenemo asihnroni kod koji se konektuje sa serverom sto utice na performanse je l
			// return new Promise((resolve, reject) => {
			// 	setTimeout(() => { // simuliramo server s ovim
			// 		resolve(val !== 'authtoken@authtoken.com')
			// 	}, 1000)
			// })
			// ok ovo smo simulirali kao server, a sad cemo stv da konektujemo firebase. Medjutim, koristimo realtime database a ona nema indexovanje valjda, tako da idemo u rules da dodamo kod indexovanja: "korisnici": { ".indexOn": ["email"]}, i ovako srcujem po email-u

			//? sada vracam real konekciju sa serverom tj axios request, za to moramo prvo da importujemo
			return axios.get(`/korisnici.json?orderBy="email"&equalTo="${val}"`) // dakle ako je email iz baze jednako vrednosti koju je korisnik uneo onda vrati false (dole ovo u then bloku) i ovo polje ce biti invalid
				.then(res => {
					console.log(res)
					// return false
					return Object.keys(res.data).length === 0 //! da li je res.data prazan objekat (to znaci da nema podudaranja u email-u). Kako se vraca prazan objekat? Mozemo koristiti js objekat Object koji ima keys metod koji mozemo da koristimo na response data i on ce nam vratiti niz svih keys-a koje ovaj res.data  objekat ima, i ako je length toga jednako 0, znaci da je res.data obj prazan i tada mozemo vratiti true jer to znaci da je korisnik izabrao email adresu koja se ne podudara sa nekom iz baze

					//! BITNO. Ovo email input bolje validiramo tj cekiramo na @BLUR dogadjaj, sto znaci da ne hitujemo request do servera na svaki uneseni karakter u input (kao recimo sa @input i sl) vec samo na blur, dakle bolje za performanse
					//! ako bas hocemo da proveravamo na @input onda bolje da kor bounce() metod iz lowdash biblioteke koji grupise rikvestove, a ne salje jedan po jedan za svaki rikvest, vec dodaje nek delay izmedju, tako da nece hitovati server sa previse rikvestova
				})
				// elem sad cemo dobiti i Unathorized error jer u rules smo za read stavili da neautorizovani ne mogu ni da citaju, idemo to u true da stvimo, a dohvatanje email adrese je samo citanje
		} 
	},// sada mozemo ovo validate email rule da metnemo gore negde u template

	age: { // ovoage mora biti ime age jer je tako ime i u data() metodu! Tj tako vuelidate sinhronizuje ono age iz v-modela sa ovim
		required, //da nije prazno
		numeric,// da je broj
		minVal: minValue(18) // minimalna vrednost za godine. minValie() je f-ja koja da bi se konfigurisala mora da ima argument koji ce ofc da predstavlja minimalnu vrednost, iliti nas kriterijum. Sada mozemo da konektujemo ovo sa nasim age inputom, radicemo na event blur
	},

	password: {
		required,
		minLen: minLength(6)
	},

	confirmPassword: { // mogu ad kado opet da pisem pravila kao a password required i minLen ali posto on treba da bude isti kao password. bolje idemo da poredimo da li je isti sa vuelidate metodom sameAs()
		// sameAs: sameAs('password') // jedan nacin da za argument prosledimo properti iz data() kao string
		sameAs: sameAs(vm => { // drugi nacin je da sameAs() metodu za argument metnemo callback f-ju koja za argument ima Vue instancu ovoe komponent koju cemo nazvati vm, i u toj f-ji mozemo returnisemo properti koji zelimo da poredimo sa vrednosci confirmPassword, recimo return vm.email. Trenutno nam izgleda da prvi nacin ima vise smisla i da je lakse, ali sta ako recimo zelimo da poredimo tu neku vrednost i data() pa plus nesto itd, recimo return vm.password + 'b'
			return vm.password
		}) 
	},

	terms: { // recimo zelimo da checkbox bude zavisan od onog sta smo selektovali za country, i recimo ako smo selektovali Germany, zelimo da terms tj taj checkbox vise ne bude obavezan! U tome ce nam pomoci vuelidate metod requiredUnless()
		required: requiredUnless(vm => { // vracamo true ili false
			return vm.country === 'germany'
		})
	},

	hobbyInputs: {
		required,
		minLen: minLength(2), // bar jedan element u nizu
		$each: { // $ oznacava da je neki property iz vue ili vue paketa. $eachje kao neki placeholder za sve ove potencionalne elemente u nizu koje cemo dinamicki dodati (konkretno hobije) jer ne znamo koliko ce korisnik elemenata tj hobija da doda. Uvde mozemo dodati referencu za svaki nas hobi input. Inace element u niz se cuva onim gore onAddHobby() metodom kojim se kreira novi objekat newHobby u kom se nalazi izmedju ostalog i properti value koji ce biti bajdovan sa v-model u nasem nizu gore u templejtu (v-model="hoobyInput.value"), ovaj hobbyInput je promenljiva iz v-fora gde lupujemo kroz ovaj hobbyInputs niz
			value: { // i tek ovde mecemo validation rules
				required,
				minLen: minLength(5) // min kolicina karaktera u ovom polju. Toeto, sada idemo da konektujemo ovo sa poljem
			}
		}
	}
},

methods: {
	onAddHobby () {
		const newHobby = {
			id: Math.random() * Math.random() * 1000,
			value: ''
		}
		this.hobbyInputs.push(newHobby)
	},
	onDeleteHobby (id) {
		this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
	},
	onSubmit () {
		const formData = {
			email: this.email,
			age: this.age,
			password: this.password,
			confirmPassword: this.confirmPassword,
			country: this.country,
			hobbies: this.hobbyInputs.map(hobby => hobby.value),
			terms: this.terms
		}
		console.log(formData)
		//? premestili smo u store.js u mutations
		// axiosInstanca.post('/accounts:signUp?key=AIzaSyBCjeuhPUHsb_uhbYwU4wzDbDkoZXgk0CQ', {
		// 	//? FIREBASE Request Body Payload
		// 	email: formData.email,
		// 	password: formData.password,
		// 	returnSecureToken: true
		// }) // firebaseu mozemo slati sa post ili put metodom. Izabracemo post(). On zahteva bar dva argumenta: 1. URL kao string, url ka kome saljemo rikvest, a 2. argument jke sta saljemo tim rikvestom, podatke. za podatke ssaljemo ovaj objekat formData, a axios ce automatski da stringifuje ovo i poslace kao validan komad podataka na backend. Post metodom mozemo staviti i 3.argument: to je js objekat kojim mozemo da prosledimo dodatnu/naknadnu konfiguraciju za rikvest ,ako te zanima p;ogledaj u axios dokumentaciju na githubu. Axioos potom vraca Promise kao odgovor jer je asinhrona radnja, stoga idemo sa chainovanjem i then fazonima, dakle mozemo da cejnujemo then da uradimo nesto kada Promise posalje resolve
		// // i sad nam je izasao error sa ovim authorization jer smo stavljali gluposti za to: axios.defaults.headers.common['Authorization'] = "something" itd, idemo u main.js i axios-auth.js da zakomentarisemo taj deo
		// 	.then(resp => {
		// 		console.log(resp);
		// 	})
		// 	.catch(err => console.log(err))

		// this.$store.dispatch('signup', {email: formData.email, password: formData.password})
		this.$store.dispatch('signup', formData) // treba nam citav objekat sa podacima o korisniku, a ne samo email i password, jer zelimo i da authentifikujemo i da upisemo posle te sve podatke u firebase database
	}
}
}
</script>

<style scoped>
.signup-form {
width: 400px;
margin: 30px auto;
border: 1px solid #eee;
padding: 20px;
box-shadow: 0 2px 3px #ccc;
}

.input {
margin: 10px auto;
}

.input label {
display: block;
color: #4e4e4e;
margin-bottom: 6px;
}

.input.inline label {
display: inline;
}

.input input {
font: inherit;
width: 100%;
padding: 6px 12px;
box-sizing: border-box;
border: 1px solid #ccc;
}

.input.inline input {
width: auto;
}

.input input:focus {
outline: none;
border: 1px solid #521751;
background-color: #eee;
}

.input.invalid input {
	border: 1px solid red;
	background-color: #ffc9aa;
}
.input.invalid label {
	color: red;
}

.input select {
border: 1px solid #ccc;
font: inherit;
}

.hobbies button {
border: 1px solid #521751;
background: #521751;
color: white;
padding: 6px;
font: inherit;
cursor: pointer;
}

.hobbies button:hover,
.hobbies button:active {
background-color: #8d4288;
}

.hobbies input {
width: 90%;
}

.submit button {
border: 1px solid #521751;
color: #521751;
padding: 10px 20px;
font: inherit;
cursor: pointer;
}

.submit button:hover,
.submit button:active {
background-color: #521751;
color: white;
}

.submit button[disabled],
.submit button[disabled]:hover,
.submit button[disabled]:active {
border: 1px solid #ccc;
background-color: transparent;
color: #ccc;
cursor: not-allowed;
}
</style>