// =========ZMIANA=========
// Plik: services/SpeechRecognitionService.js
import { PermissionsAndroid, Platform } from 'react-native'
import AudioRecord from 'react-native-audio-record'
import { GOOGLE_SPEECH_TO_TEXT_API_KEY } from '@env'
import RNFetchBlob from 'rn-fetch-blob'

const RECORDING_OPTIONS = {
	sampleRate: 16000,
	channels: 1,
	bitsPerSample: 16,
	audioSource: 6, // VOICE_RECOGNITION
	wavFile: 'temp_speech.wav',
}

const API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_SPEECH_TO_TEXT_API_KEY}`

class SpeechRecognitionService {
	constructor() {
		this.isListening = false
		this.callbacks = {}
	}

	async requestMicrophonePermission() {
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
					title: 'Zgoda na użycie mikrofonu',
					message: 'Aplikacja potrzebuje dostępu do Twojego mikrofonu, aby włączyć funkcję dyktowania.',
					buttonPositive: 'Zezwól',
					buttonNegative: 'Odmów',
				})
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					console.log('Masz uprawnienia do mikrofonu.')
					return true
				} else {
					console.log('Odmówiono uprawnień do mikrofonu.')
					return false
				}
			} catch (err) {
				console.warn(err)
				return false
			}
		}
		return true // Domyślnie zwracamy true dla innych platform (np. iOS, jeśli będzie dodany)
	}

	async startListening(locale = 'pl-PL', callbacks) {
		if (this.isListening) {
			console.warn('Nasłuchiwanie jest już aktywne.')
			return
		}

		const hasPermission = await this.requestMicrophonePermission()
		if (!hasPermission) {
			// Jeśli użytkownik odmówił, informujemy go i kończymy działanie
			callbacks.onError({ error: { message: 'Brak uprawnień do mikrofonu.' } })
			return
		}

		this.isListening = true
		this.callbacks = callbacks

		try {
			await AudioRecord.init(RECORDING_OPTIONS)
			AudioRecord.start()
			console.log('Rozpoczęto nagrywanie...')

			if (this.callbacks.onStart) {
				this.callbacks.onStart()
			}
		} catch (error) {
			console.error('Błąd podczas startu nasłuchiwania:', error)
			if (this.callbacks.onError) this.callbacks.onError(error)
			this.isListening = false
		}
	}

	async stopListening() {
		if (!this.isListening) return

		this.isListening = false

		try {
			console.log('Zatrzymywanie nagrywania i przetwarzanie...')
			const audioFilePath = await AudioRecord.stop()

			if (this.callbacks.onEnd) {
				this.callbacks.onEnd()
			}

			const base64Audio = await RNFetchBlob.fs.readFile(audioFilePath, 'base64')

			const response = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					config: {
						encoding: 'LINEAR16',
						sampleRateHertz: RECORDING_OPTIONS.sampleRate,
						languageCode: 'pl-PL',
						enableAutomaticPunctuation: true,
					},
					audio: {
						content: base64Audio,
					},
				}),
			})

			const responseData = await response.json()

			if (responseData.results && responseData.results.length > 0) {
				const transcript = responseData.results[0].alternatives[0].transcript
				console.log('Otrzymano transkrypcję z Google:', transcript)
				if (this.callbacks.onResult) {
					this.callbacks.onResult({ value: [transcript] })
				}
			} else {
				console.log('Google nie zwróciło żadnych wyników.', responseData)
				if (this.callbacks.onError) {
					this.callbacks.onError({ error: { message: 'Nie rozpoznano mowy.' } })
				}
			}
		} catch (error) {
			console.error('Błąd podczas zatrzymywania i przetwarzania audio:', error)
			if (this.callbacks.onError) this.callbacks.onError(error)
		}
	}

	// Metoda niszcząca - zatrzymuje nasłuchiwanie, jeśli jest aktywne
	async destroy() {
		if (this.isListening) {
			this.stopListening()
		}
	}
}

export default new SpeechRecognitionService()
