// Przykład użycia ulepszonego SpeechRecognitionService
import SpeechRecognitionService from './SpeechRecognitionService'

class SpeechRecognitionUsageExample {
	async startSpeechRecognition() {
		// Najpierw sprawdź dostępność usługi
		const availability = await SpeechRecognitionService.checkServiceAvailability()

		if (!availability.available) {
			console.error('Usługa rozpoznawania mowy nie jest dostępna:', availability.reason)
			// Pokaż odpowiedni komunikat użytkownikowi
			return
		}

		console.log('Usługa rozpoznawania mowy jest dostępna:', availability.reason)

		// Rozpocznij nasłuchiwanie z callbacks
		await SpeechRecognitionService.startListening('pl-PL', {
			onStart: () => {
				console.log('🎤 Rozpoczęto nagrywanie...')
				// Aktualizuj UI - pokaż że nagrywanie jest aktywne
			},

			onEnd: () => {
				console.log('🔄 Przetwarzanie mowy...')
				// Aktualizuj UI - pokaż że trwa przetwarzanie
			},

			onResult: result => {
				console.log('✅ Rozpoznano mowę:', result.value[0])
				// Użyj rozpoznanego tekstu w aplikacji
				this.handleRecognizedText(result.value[0])
			},

			onError: error => {
				console.error('❌ Błąd rozpoznawania mowy:', error)
				// Pokaż odpowiedni komunikat błędu użytkownikowi
				this.handleSpeechError(error)
			},
		})
	}

	async stopSpeechRecognition() {
		await SpeechRecognitionService.stopListening()
	}

	handleRecognizedText(text) {
		// Implementuj logikę obsługi rozpoznanego tekstu
		console.log('Obsługuję rozpoznany tekst:', text)
		// Na przykład: wstaw tekst do pola tekstowego
	}

	handleSpeechError(error) {
		// Implementuj obsługę różnych typów błędów
		const errorMessage = error.error?.message || 'Nieznany błąd'

		if (errorMessage.includes('uprawnienia')) {
			// Pokaż dialog o uprawnieniach do mikrofonu
			console.log('Pokaż dialog uprawnień')
		} else if (errorMessage.includes('połączenia')) {
			// Pokaż komunikat o problemach z internetem
			console.log('Sprawdź połączenie internetowe')
		} else if (errorMessage.includes('API')) {
			// Pokaż komunikat o problemach z usługą
			console.log('Problem z usługą rozpoznawania mowy')
		} else {
			// Ogólny komunikat błędu
			console.log('Błąd rozpoznawania mowy:', errorMessage)
		}
	}

	async cleanup() {
		// Wywołaj przy zamykaniu komponentu
		await SpeechRecognitionService.destroy()
	}
}

export default SpeechRecognitionUsageExample
