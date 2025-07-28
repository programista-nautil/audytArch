// Plik: components/common/CommentInput.js
import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import SpeechRecognitionService from '../../../services/SpeechRecognitionService'

const CommentInput = ({ value, onChangeText, placeholder }) => {
	const [isListening, setIsListening] = useState(false)
	const [error, setError] = useState('')
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
	}

	const onSpeechEnd = () => {
		console.log('Zakończono nasłuchiwanie.')
		setIsListening(false)
	}

	const onSpeechError = e => {
		console.error('Błąd rozpoznawania mowy:', e)
		setError('Wystąpił błąd lub nic nie powiedziano.')
		setIsListening(false)
	}

	const onSpeechResults = e => {
		console.log('Otrzymano wyniki końcowe:', e.value)
		if (e.value && e.value.length > 0) {
			const recognizedText = e.value[0]
			const newText = initialTextRef.current ? `${initialTextRef.current} ${recognizedText}`.trim() : recognizedText
			onChangeText(newText)
		}
	}

	const onSpeechPartialResults = e => {
		console.log('Otrzymano wyniki częściowe:', e.value)
		if (e.value && e.value.length > 0) {
			const recognizedText = e.value[0]
			// Aktualizujemy tekst na bieżąco, dodając rozpoznaną frazę do tego, co było na początku.
			const newText = initialTextRef.current ? `${initialTextRef.current} ${recognizedText}`.trim() : recognizedText
			onChangeText(newText)
		}
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
				onPartialResult: onSpeechPartialResults, // <-- Przekazujemy nowy handler
				onError: onSpeechError,
				onEnd: onSpeechEnd,
			})
		}
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder || 'Wpisz komentarz...'}
				multiline
			/>
			<TouchableOpacity onPress={handleMicPress} style={styles.micButton}>
				{isListening ? (
					<ActivityIndicator size='small' color='#c40000' />
				) : (
					<MaterialIcons name='mic' size={24} color='#555' />
				)}
			</TouchableOpacity>
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
		paddingRight: 50, // Zostaw miejsce na ikonę mikrofonu
		minHeight: 80,
		textAlignVertical: 'top',
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
})

export default CommentInput
