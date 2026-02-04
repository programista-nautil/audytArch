// // =========ZMIANA=========
// // Plik: services/SpeechRecognitionService.js
// import { PermissionsAndroid, Platform } from 'react-native'
// import AudioRecord from 'react-native-audio-record'
// import { GOOGLE_SPEECH_TO_TEXT_API_KEY } from '@env'
// import { File } from 'expo-file-system'

// const RECORDING_OPTIONS = {
// 	sampleRate: 16000,
// 	channels: 1,
// 	bitsPerSample: 16,
// 	audioSource: 6, // VOICE_RECOGNITION
// 	wavFile: 'temp_speech.wav',
// 	bufferSize: 8192, // Dodane dla lepszej jakości w produkcji
// }

// const API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_SPEECH_TO_TEXT_API_KEY}`

// class SpeechRecognitionService {
// 	constructor() {
// 		this.isListening = false
// 		this.callbacks = {}

// 		// Sprawdź czy klucz API jest dostępny
// 		if (!GOOGLE_SPEECH_TO_TEXT_API_KEY) {
// 			console.error('UWAGA: Brak klucza API Google Speech-to-Text!')
// 		} else {
// 			console.log('Klucz API Google Speech-to-Text jest skonfigurowany')
// 		}
// 	}

// 	async requestMicrophonePermission() {
// 		if (Platform.OS === 'android') {
// 			try {
// 				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
// 					title: 'Zgoda na użycie mikrofonu',
// 					message: 'Aplikacja potrzebuje dostępu do Twojego mikrofonu, aby włączyć funkcję dyktowania.',
// 					buttonPositive: 'Zezwól',
// 					buttonNegative: 'Odmów',
// 				})
// 				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// 					console.log('Masz uprawnienia do mikrofonu.')
// 					return true
// 				} else {
// 					console.log('Odmówiono uprawnień do mikrofonu.')
// 					return false
// 				}
// 			} catch (err) {
// 				console.warn(err)
// 				return false
// 			}
// 		}
// 		return true // Domyślnie zwracamy true dla innych platform (np. iOS, jeśli będzie dodany)
// 	}

// 	async startListening(locale = 'pl-PL', callbacks) {
// 		if (this.isListening) {
// 			console.warn('Nasłuchiwanie jest już aktywne.')
// 			return
// 		}

// 		// Sprawdź czy klucz API jest dostępny
// 		if (!GOOGLE_SPEECH_TO_TEXT_API_KEY) {
// 			console.error('Brak klucza API Google Speech-to-Text!')
// 			callbacks.onError({ error: { message: 'Błąd konfiguracji - brak klucza API.' } })
// 			return
// 		}

// 		const hasPermission = await this.requestMicrophonePermission()
// 		if (!hasPermission) {
// 			// Jeśli użytkownik odmówił, informujemy go i kończymy działanie
// 			callbacks.onError({ error: { message: 'Brak uprawnień do mikrofonu.' } })
// 			return
// 		}

// 		this.isListening = true
// 		this.callbacks = callbacks

// 		try {
// 			await AudioRecord.init(RECORDING_OPTIONS)
// 			AudioRecord.start()
// 			console.log('Rozpoczęto nagrywanie...')

// 			if (this.callbacks.onStart) {
// 				this.callbacks.onStart()
// 			}
// 		} catch (error) {
// 			console.error('Błąd podczas startu nasłuchiwania:', error)
// 			if (this.callbacks.onError) this.callbacks.onError(error)
// 			this.isListening = false
// 		}
// 	}

// 	async stopListening() {
// 		if (!this.isListening) return

// 		this.isListening = false

// 		try {
// 			console.log('Zatrzymywanie nagrywania...')
// 			const audioFilePath = await AudioRecord.stop()

// 			const fileUri = audioFilePath.startsWith('file://') ? audioFilePath : `file://${audioFilePath}`
// 			console.log('URI pliku audio:', fileUri)

// 			// 1. Tworzymy obiekt pliku
// 			const file = new File(fileUri)

// 			// 2. Sprawdzamy istnienie i rozmiar (Dostępne jako właściwości klasy)
// 			if (!file.exists) {
// 				console.error('Plik audio nie istnieje!')
// 				if (this.callbacks.onError) {
// 					this.callbacks.onError({ error: { message: 'Błąd: plik audio nie został utworzony.' } })
// 				}
// 				return
// 			}

// 			if (file.size === 0) {
// 				console.error('Plik audio jest pusty!')
// 				if (this.callbacks.onError) {
// 					this.callbacks.onError({ error: { message: 'Błąd: nie zarejestrowano żadnego dźwięku.' } })
// 				}
// 				return
// 			}

// 			// 3. Odczyt Base64
// 			const base64Audio = await file.base64()
// 			console.log('Długość base64 audio:', base64Audio.length)

// 			if (base64Audio.length === 0) {
// 				console.error('Base64 audio jest pusty!')
// 				if (this.callbacks.onError) {
// 					this.callbacks.onError({ error: { message: 'Błąd: nie udało się odczytać pliku audio.' } })
// 				}
// 				return
// 			}

// 			console.log('Wysyłanie żądania do Google Speech API...')
// 			const response = await fetch(API_URL, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					config: {
// 						encoding: 'LINEAR16',
// 						sampleRateHertz: RECORDING_OPTIONS.sampleRate,
// 						languageCode: 'pl-PL',
// 						enableAutomaticPunctuation: true,
// 						maxAlternatives: 1,
// 						profanityFilter: false,
// 					},
// 					audio: {
// 						content: base64Audio,
// 					},
// 				}),
// 			})

// 			console.log('Status odpowiedzi Google API:', response.status)
// 			console.log('Headers odpowiedzi:', response.headers)

// 			if (!response.ok) {
// 				const errorText = await response.text()
// 				console.error('Błąd HTTP od Google API:', response.status, errorText)
// 				if (this.callbacks.onError) {
// 					this.callbacks.onError({ error: { message: `Błąd API: ${response.status} - ${errorText}` } })
// 				}
// 				return
// 			}

// 			const responseData = await response.json()
// 			console.log('Pełna odpowiedź z Google API:', JSON.stringify(responseData, null, 2))

// 			if (responseData.results && responseData.results.length > 0) {
// 				const transcript = responseData.results[0].alternatives[0].transcript
// 				console.log('Otrzymano transkrypcję z Google:', transcript)
// 				if (this.callbacks.onResult) {
// 					this.callbacks.onResult({ value: [transcript] })
// 				}
// 			} else {
// 				console.log('Google nie zwróciło żadnych wyników.')
// 				console.log('Szczegóły odpowiedzi:', JSON.stringify(responseData, null, 2))

// 				// Sprawdź czy to problem z API key
// 				if (responseData.error) {
// 					console.error('Błąd API:', responseData.error)
// 					if (this.callbacks.onError) {
// 						this.callbacks.onError({ error: { message: `Błąd API: ${responseData.error.message}` } })
// 					}
// 				} else {
// 					if (this.callbacks.onError) {
// 						this.callbacks.onError({ error: { message: 'Nie rozpoznano mowy - spróbuj mówić głośniej i wyraźniej.' } })
// 					}
// 				}
// 			}

// 			// Czyszczenie pliku tymczasowego
// 			try {
// 				file.delete()
// 				console.log('Usunięto plik tymczasowy:', fileUri)
// 			} catch (cleanupError) {
// 				console.warn('Nie udało się usunąć pliku:', cleanupError)
// 			}
// 		} catch (error) {
// 			console.error('Błąd podczas zatrzymywania i przetwarzania audio:', error)
// 			console.error('Stack trace:', error.stack)

// 			// Sprawdź typ błędu i dostarcz bardziej szczegółowe informacje
// 			let errorMessage = 'Wystąpił nieoczekiwany błąd podczas przetwarzania mowy.'

// 			if (error.message) {
// 				if (error.message.includes('Network')) {
// 					errorMessage = 'Błąd połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.'
// 				} else if (error.message.includes('timeout')) {
// 					errorMessage = 'Przekroczono limit czasu. Spróbuj ponownie.'
// 				} else if (error.message.includes('API')) {
// 					errorMessage = 'Błąd usługi rozpoznawania mowy. Spróbuj ponownie później.'
// 				} else {
// 					errorMessage = `Błąd: ${error.message}`
// 				}
// 			}

// 			if (this.callbacks.onError) {
// 				this.callbacks.onError({ error: { message: errorMessage, originalError: error } })
// 			}
// 		}
// 	}

// 	// Metoda sprawdzająca dostępność usługi
// 	async checkServiceAvailability() {
// 		try {
// 			if (!GOOGLE_SPEECH_TO_TEXT_API_KEY) {
// 				return { available: false, reason: 'Brak klucza API' }
// 			}

// 			// Sprawdź uprawnienia do mikrofonu
// 			const hasPermission = await this.requestMicrophonePermission()
// 			if (!hasPermission) {
// 				return { available: false, reason: 'Brak uprawnień do mikrofonu' }
// 			}

// 			// Sprawdź połączenie z API (prosty test)
// 			try {
// 				const testResponse = await fetch(
// 					`https://speech.googleapis.com/v1/operations?key=${GOOGLE_SPEECH_TO_TEXT_API_KEY}`,
// 					{
// 						method: 'GET',
// 						timeout: 5000,
// 					},
// 				)

// 				if (!testResponse.ok && testResponse.status !== 404) {
// 					return { available: false, reason: `Błąd API: ${testResponse.status}` }
// 				}
// 			} catch (networkError) {
// 				return { available: false, reason: 'Brak połączenia z internetem' }
// 			}

// 			return { available: true, reason: 'Usługa dostępna' }
// 		} catch (error) {
// 			console.error('Błąd podczas sprawdzania dostępności usługi:', error)
// 			return { available: false, reason: `Błąd sprawdzania: ${error.message}` }
// 		}
// 	}

// 	// Metoda niszcząca - zatrzymuje nasłuchiwanie, jeśli jest aktywne
// 	async destroy() {
// 		if (this.isListening) {
// 			this.stopListening()
// 		}
// 	}
// }

// export default new SpeechRecognitionService()
