import axios from 'axios'

const instanca = axios.create({
	baseURL: 'https://max-axios-auth.firebaseio.com',
})
 
instanca.defaults.headers.common['SOMETHING'] = 'something' // ovo defaults je global objects, ali ovaj defaults ce se odraziti samo na ovu ovde instancu, a ne global axios instancu, 

export default instanca // i sada mzoemo da importujemo instanca gde god nam u aplikaciji zatreba, i recimo idemo u signup i tamo obrisem onaj import global axios instance i stavljam import ove nase