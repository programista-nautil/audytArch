// Plik: components/common/CommentInput.js
import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import SpeechRecognitionService from '../../../services/SpeechRecognitionService'

const CommentInput = ({ value, onChangeText, placeholder }) => {
	const [isListening, setIsListening] = useState(false)
	const [error, setError] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)

	const textInputRef = useRef(null)
	const initialTextRef = useRef('')

	useEffect(() => {
		return () => {
			SpeechRecognitionService.destroy()
		}
	}, [])

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
		if (isListening) {
			SpeechRecognitionService.stopListening()
		} else {
			// Zapisujemy aktualny tekst przed rozpoczęciem nasłuchiwania
			initialTextRef.current = value
			setError('') // Czyścimy ewentualne błędy
			SpeechRecognitionService.startListening('pl-PL', {
				onStart: onSpeechStart,
				onResult: onSpeechResults,
				onError: onSpeechError,
				onEnd: onSpeechEnd,
			})
		}
	}

	return (
		<View style={styles.container}>
			<TextInput
				ref={textInputRef}
				style={[styles.input, isListening && styles.listeningInput]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder || 'Wpisz komentarz...'}
				multiline
				editable={!isProcessing}
			/>
			<TouchableOpacity onPress={handleMicPress} style={styles.micButton}>
				{isListening ? (
					<MaterialIcons name='pause-circle-filled' size={24} color='#c40000' />
				) : (
					<MaterialIcons name='mic' size={24} color='#555' />
				)}
			</TouchableOpacity>
			{isProcessing && (
				<View style={styles.spinnerOverlay}>
					<ActivityIndicator size='small' color='#3B82F6' />
				</View>
			)}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
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
})

export default CommentInput
