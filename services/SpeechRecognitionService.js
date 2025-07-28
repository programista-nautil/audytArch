import Voice from '@react-native-voice/voice'

class SpeechRecognitionService {
	constructor() {
		Voice.destroy().then(Voice.removeAllListeners)
	}

	_registerEvents(onStart, onResult, onPartialResult, onError, onEnd) {
		// <-- DODAJ onPartialResult
		Voice.onSpeechStart = onStart
		Voice.onSpeechResults = onResult
		Voice.onSpeechPartialResults = onPartialResult // <-- DODAJ TĘ LINIĘ
		Voice.onSpeechError = onError
		Voice.onSpeechEnd = onEnd
	}

	_unregisterEvents() {
		Voice.onSpeechStart = null
		Voice.onSpeechResults = null
		Voice.onSpeechPartialResults = null // <-- DODAJ TĘ LINIĘ
		Voice.onSpeechError = null
		Voice.onSpeechEnd = null
	}

	/**
	 * Rozpoczyna proces nasłuchiwania mowy.
	 * @param {string} locale - Kod języka, np. 'pl-PL' dla polskiego.
	 * @param {object} callbacks - Obiekt z funkcjami zwrotnymi { onStart, onResult, onError, onEnd }.
	 */
	async startListening(locale = 'pl-PL', callbacks) {
		this._registerEvents(
			callbacks.onStart,
			callbacks.onResult,
			callbacks.onPartialResult,
			callbacks.onError,
			callbacks.onEnd
		)

		try {
			await Voice.start(locale)
		} catch (e) {
			console.error('Błąd podczas startu nasłuchiwania:', e)
			if (callbacks.onError) {
				callbacks.onError(e)
			}
		}
	}

	async stopListening() {
		try {
			await Voice.stop()
		} catch (e) {
			console.error('Błąd podczas zatrzymywania nasłuchiwania:', e)
		}
	}

	async destroy() {
		try {
			await Voice.destroy()
		} catch (e) {
			console.error('Błąd podczas niszczenia instancji Voice:', e)
		} finally {
			this._unregisterEvents()
		}
	}
}

export default new SpeechRecognitionService()
