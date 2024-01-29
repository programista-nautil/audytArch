// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
	apiKey: 'AIzaSyDWAyz8CKcvpL_aUZNdN8Z-BViSYJxOLXU',
	authDomain: 'auditarch.firebaseapp.com',
	projectId: 'auditarch',
	storageBucket: 'auditarch.appspot.com',
	messagingSenderId: '818784925145',
	appId: '1:818784925145:web:a4824a46d12905e3e255c8',
	measurementId: 'G-10073CQ9TF',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
//iso: 399573477414-3bs3vp39t0p44krv30rondbevarlonej.apps.googleusercontent.com
//android: 399573477414-89j5rcupms2n6qdvciij6jnsu39cdrvs.apps.googleusercontent.com
