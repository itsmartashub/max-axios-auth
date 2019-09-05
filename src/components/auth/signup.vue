<template>
<div id="signup">
	<div class="signup-form">
		<form @submit.prevent="onSubmit">
			<div class="input">
				<label for="email">Mail</label>
				<input
						type="email"
						id="email"
						v-model="email">
			</div>
			<div class="input">
				<label for="age">Your Age</label>
				<input
						type="number"
						id="age"
						v-model.number="age">
			</div>
			<div class="input">
				<label for="password">Password</label>
				<input
						type="password"
						id="password"
						v-model="password">
			</div>
			<div class="input">
				<label for="confirm-password">Confirm Password</label>
				<input
						type="password"
						id="confirm-password"
						v-model="confirmPassword">
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
						:key="hobbyInput.id">
					<label :for="hobbyInput.id">Hobby #{{ index }}</label>
					<input
							type="text"
							:id="hobbyInput.id"
							v-model="hobbyInput.value">
					<button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
				</div>
				</div>
			</div>
			<div class="input inline">
				<input type="checkbox" id="terms" v-model="terms">
				<label for="terms">Accept Terms of Use</label>
			</div>
			<div class="submit">
				<button type="submit">Submit</button>
			</div>
		</form>
	</div>
</div>
</template>

<script>
// import axios from 'axios'
import axiosInstanca from '../../axios-auth' // importovali smo kao axiosInstanca al ovo ime moze koje god, mogli smo i kao axios, bitno je ovo from, i sta iz rog fajla koji gadjamo sa from exportujemo (instanca)

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
		
		axiosInstanca.post('/korisnici.json', formData) // firebaseu mozemo slati sa post ili put metodom. Izabracemo post(). On zahteva bar dva argumenta: 1. URL kao string, url ka kome saljemo rikvest, a 2. argument jke sta saljemo tim rikvestom, podatke. za podatke ssaljemo ovaj objekat formData, a axios ce automatski da stringifuje ovo i poslace kao validan komad podataka na backend. Post metodom mozemo staviti i 3.argument: to je js objekat kojim mozemo da prosledimo dodatnu/naknadnu konfiguraciju za rikvest ,ako te zanima p;ogledaj u axios dokumentaciju na githubu. Axioos potom vraca Promise kao odgovor jer je asinhrona radnja, stoga idemo sa chainovanjem i then fazonima, dakle mozemo da cejnujemo then da uradimo nesto kada Promise posalje resolve
			.then(resp => {
				console.log(resp);
			})
			.catch(err => console.log(err))

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