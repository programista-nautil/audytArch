// Plik: services/AIService.js

import { GOOGLE_SPEECH_TO_TEXT_API_KEY } from '@env' // Używamy tego samego, bezpiecznego klucza API

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_SPEECH_TO_TEXT_API_KEY}`

class AIService {
	/**
	 * Generuje opis na podstawie polecenia tekstowego i zdjęcia.
	 * @param {string} prompt - Polecenie tekstowe od użytkownika.
	 * @param {string} base64Image - Obraz zakodowany w base64.
	 * @returns {Promise<string>} - Wygenerowany tekst przez AI.
	 */
	async generateDescription(prompt, base64Image = null) {
		if (!prompt) {
			throw new Error('Prompt nie może być pusty.')
		}

		console.log('Wysyłanie zapytania do Gemini API...')

		try {
			const parts = [
				{
					text: 'Jesteś ekspertem od audytów architektonicznych. Na podstawie polecenia użytkownika oraz załączonego zdjęcia (jeśli istnieje), wygeneruj zwięzły, profesjonalny i obiektywny opis w języku polskim, który zostanie umieszczony w raporcie z audytu. Skup się na faktach.',
				},
				{ text: `Polecenie użytkownika: "${prompt}"` },
			]

			if (base64Image) {
				parts.push({
					inline_data: {
						mime_type: 'image/jpeg',
						data: base64Image,
					},
				})
			}

			const body = {
				contents: [{ parts }],
			}

			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})

			if (!response.ok) {
				const errorBody = await response.json()
				console.error('Błąd API Gemini:', errorBody)
				throw new Error('Błąd odpowiedzi z serwera AI. Sprawdź, czy Twoje API jest poprawnie skonfigurowane.')
			}

			const responseData = await response.json()

			// Przetwarzanie odpowiedzi z Gemini
			if (responseData.candidates && responseData.candidates.length > 0) {
				const generatedText = responseData.candidates[0].content.parts[0].text
				console.log('Otrzymano odpowiedź od Gemini:', generatedText)
				return generatedText.trim()
			} else {
				console.warn('Gemini nie zwróciło żadnych kandydatów w odpowiedzi.', responseData)
				throw new Error('AI nie wygenerowało odpowiedzi.')
			}
		} catch (error) {
			console.error('Błąd w trakcie komunikacji z AIService:', error)
			// Przekazujemy błąd dalej, aby UI mógł go obsłużyć
			throw error
		}
	}
}

export default new AIService()
