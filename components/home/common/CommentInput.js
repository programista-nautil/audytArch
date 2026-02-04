// Plik: components/common/CommentInput.js
import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { File } from 'expo-file-system'
import { MaterialIcons } from '@expo/vector-icons'
// import SpeechRecognitionService from '../../../services/SpeechRecognitionService'
import AIService from '../../../services/AIService'

const CommentInput = ({ value, onChangeText, placeholder, aiContext, photo }) => {
	const [isListening, setIsListening] = useState(false)
	const [error, setError] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)

	const [isAiModalVisible, setIsAiModalVisible] = useState(false)
	const [aiPrompt, setAiPrompt] = useState('')
	const [isAiProcessing, setIsAiProcessing] = useState(false)

	const textInputRef = useRef(null)
	const initialTextRef = useRef('')

	// useEffect(() => {
	// 	return () => {
	// 		SpeechRecognitionService.destroy()
	// 	}
	// }, [])

	const onSpeechStart = () => {
		console.log('Rozpoczęto nasłuchiwanie...')
		setIsListening(true)
		setError('')
		setIsProcessing(false)
	}

	const onSpeechEnd = () => {
		console.log('Zakończono nasłuchiwanie, przetwarzanie...')
		setIsListening(false)

		setIsProcessing(true)
	}

	const onSpeechError = e => {
		console.error('Błąd rozpoznawania mowy:', e)
		setError('Wystąpił błąd lub nic nie powiedziano.')
		setIsListening(false)
		// Krok 3: Wyłączamy spinner w przypadku błędu.
		setIsProcessing(false)
	}

	const onSpeechResults = e => {
		console.log('Otrzymano wyniki końcowe:', e.value)
		if (e.value && e.value.length > 0) {
			const recognizedText = e.value[0]
			const newText = initialTextRef.current ? `${initialTextRef.current} ${recognizedText}`.trim() : recognizedText
			onChangeText(newText)
		}
		setIsProcessing(false)
		// Ustawiamy fokus na polu tekstowym po otrzymaniu wyniku
		textInputRef.current?.focus()
	}

	const handleMicPress = () => {
		// if (isListening) {
		// 	SpeechRecognitionService.stopListening()
		// } else {
		// 	// Zapisujemy aktualny tekst przed rozpoczęciem nasłuchiwania
		// 	initialTextRef.current = value
		// 	setError('') // Czyścimy ewentualne błędy
		// 	SpeechRecognitionService.startListening('pl-PL', {
		// 		onStart: onSpeechStart,
		// 		onResult: onSpeechResults,
		// 		onError: onSpeechError,
		// 		onEnd: onSpeechEnd,
		// 	})
		// }
	}

	const handleAiIconPress = () => {
		if (photo) {
			console.log('AI będzie analizować zdjęcie:', photo.path)
		} else {
			console.log('Brak zdjęcia do analizy AI dla tej sekcji.')
		}

		setAiPrompt('') // Resetuj prompt przy każdym otwarciu
		setIsAiModalVisible(true)
	}

	const handleGenerateAiResponse = async () => {
		if (!aiPrompt.trim()) return

		setIsAiModalVisible(false)
		setIsAiProcessing(true) // Pokaż spinner
		setError('')

		try {
			let base64Image = null

			if (photo && photo.path) {
				try {
					let imageUri = photo.path
					if (!imageUri.startsWith('file://')) {
						imageUri = `file://${imageUri}`
					}

					console.log(`Odczytywanie zdjęcia z URI: ${imageUri}`)

					const file = new File(imageUri)

					if (!file.exists) {
						throw new Error('Plik zdjęcia nie istnieje')
					}

					base64Image = await file.base64()

					console.log('Zdjęcie pomyślnie zakodowano.')
				} catch (readError) {
					console.error('Błąd odczytu pliku zdjęcia:', readError)
					Alert.alert('Błąd', 'Nie udało się odczytać pliku zdjęcia. Spróbuj zrobić je ponownie.')
					setIsAiProcessing(false)
					return
				}
			}

			const generatedText = await AIService.generateDescription(aiPrompt, aiContext, value, base64Image)

			const newText = value ? `${value}\n\n${generatedText}` : generatedText
			onChangeText(newText)
		} catch (err) {
			setError(err.message || 'Wystąpił nieznany błąd AI.')
		} finally {
			setIsAiProcessing(false)
		}
	}

	return (
		<View style={styles.container}>
			{/* Pole tekstowe z dynamicznymi stylami */}
			<TextInput
				ref={textInputRef}
				style={[styles.input, isListening && styles.listeningInput]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder || 'Wpisz komentarz...'}
				multiline
				editable={!isProcessing && !isAiProcessing}
			/>
			{/* Kontener na ikony */}
			<View style={styles.iconContainer}>
				{/* Ikona mikrofonu */}
				<TouchableOpacity onPress={handleMicPress} style={styles.iconButton} disabled={isProcessing || isAiProcessing}>
					{isListening ? (
						<MaterialIcons name='pause-circle-filled' size={24} color='#c40000' />
					) : (
						<MaterialIcons name='mic' size={24} color={isProcessing || isAiProcessing ? '#ccc' : '#555'} />
					)}
				</TouchableOpacity>

				{/* Ikona AI */}
				<TouchableOpacity
					onPress={handleAiIconPress}
					style={[styles.iconButton, styles.aiIcon]}
					disabled={isAiProcessing || isProcessing}>
					<MaterialIcons name='auto-awesome' size={24} color={isAiProcessing || isProcessing ? '#ccc' : '#555'} />
				</TouchableOpacity>
			</View>

			{/* Spinner na czas przetwarzania (zarówno mowy, jak i AI) */}
			{(isProcessing || isAiProcessing) && (
				<View style={styles.spinnerOverlay}>
					<ActivityIndicator size='small' color='#3B82F6' />
					<Text style={{ marginTop: 5, color: '#3B82F6', fontWeight: 'bold' }}>
						{isProcessing ? 'Przetwarzanie głosu...' : 'Generowanie AI...'}
					</Text>
				</View>
			)}

			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			{/* Modal do wpisywania promptu AI */}
			<Modal
				visible={isAiModalVisible}
				animationType='slide'
				transparent={true}
				onRequestClose={() => setIsAiModalVisible(false)}>
				<SafeAreaView style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Asystent AI</Text>
						<Text style={styles.modalSubtitle}>
							Wpisz polecenie, aby wygenerować opis. Możesz odnieść się do zdjęcia, jeśli zostało zrobione dla tej
							sekcji.
						</Text>

						<TextInput
							style={styles.modalInput}
							placeholder='np. Opisz pęknięcia widoczne na ścianie.'
							value={aiPrompt}
							onChangeText={setAiPrompt}
							multiline
						/>
						<View style={styles.modalButtonContainer}>
							<TouchableOpacity
								onPress={() => setIsAiModalVisible(false)}
								style={[styles.modalButton, styles.cancelButton]}>
								<Text style={styles.buttonText}>Anuluj</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={handleGenerateAiResponse} style={[styles.modalButton, styles.generateButton]}>
								<Text style={[styles.buttonText, { color: 'white' }]}>Generuj</Text>
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
		position: 'relative',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 12,
		paddingRight: 50,
		minHeight: 80,
		textAlignVertical: 'top',
		transition: 'border-color 0.3s',
	},
	iconContainer: {
		position: 'absolute',
		right: 8,
		top: 2,
		flexDirection: 'column',
		alignItems: 'center',
	},
	iconButton: {
		padding: 4,
		marginTop: 4,
	},

	aiIcon: {
		marginTop: 0,
		marginBottom: 4,
	},

	listeningInput: {
		borderColor: '#3B82F6',
		borderWidth: 2,
	},
	micButton: {
		position: 'absolute',
		right: 12,
		top: 12,
		padding: 4,
	},
	errorText: {
		color: 'red',
		marginTop: 4,
		fontSize: 12,
	},
	spinnerOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		borderRadius: 8,
	},
	modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
	modalContent: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
	modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
	modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
	modalInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 12,
		minHeight: 100,
		textAlignVertical: 'top',
		marginBottom: 16,
	},
	modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
	modalButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
	cancelButton: { backgroundColor: '#e5e7eb', marginRight: 8 },
	generateButton: { backgroundColor: '#3B82F6', marginLeft: 8 },
	buttonText: { fontWeight: 'bold', fontSize: 16 },
})

export default CommentInput
