// CameraModule.js
import React, { useState, useEffect, useRef } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import axios from 'axios'

const CameraModule = ({ onPictureTaken, uploadUrl, elementName }) => {
	const [hasCameraPermission, setHasCameraPermission] = useState(false)
	const [isCameraVisible, setIsCameraVisible] = useState(false)
	const cameraRef = useRef(null)

	const takePicture = async () => {
		if (!cameraRef.current) {
			console.log('Brak referencji do aparatu')
			return
		}
		console.log('Robienie zdjęcia...')
		const photo = await cameraRef.current.takePictureAsync()
		console.log('Zdjęcie zrobione:', photo.uri)
		setIsCameraVisible(false) // Czy to jest potrzebne?
		onPictureTaken && onPictureTaken(photo.uri)
		uploadFile(photo.uri)
	}

	useEffect(() => {
		console.log('Prośba o uprawnienia do aparatu...')
		;(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync()
			console.log('Status uprawnień do aparatu:', status)
			setHasCameraPermission(status === 'granted')
			if (status === 'granted') {
				setIsCameraVisible(true) // Ustawienie widoczności aparatu na true
			}
		})()
	}, [])

	const uploadFile = async uri => {
		const formData = new FormData()
		const filename = uri.split('/').pop()
		const type = 'image/jpeg'

		formData.append('sampleFile', { uri, name: filename, type })

		try {
			const response = await axios.post(uploadUrl, formData, {
			
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			console.log('Odpowiedź serwera:', response.data)
		} catch (error) {
			console.error('Błąd podczas wysyłania pliku:', error)
		}
	}

	if (!hasCameraPermission) {
		return <View />
	}

	return (
		<View style={styles.container}>
			{isCameraVisible && (
				<Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
					{/* Opcjonalnie przyciski do zmiany typu aparatu, lampy błyskowej itp. */}
				</Camera>
			)}
			<View style={styles.buttonContainer}>
				<Button title='Zrób zdjęcie' onPress={takePicture} color={styles.button.backgroundColor} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	camera: {
		width: '100%',
		height: '100%',
	},
	buttonContainer: {
		position: 'absolute', // Pozycjonowanie absolutne, aby przycisk znajdował się nad widokiem aparatu
		bottom: 20, // Odstęp od dolnej krawędzi
	},
	button: {
		backgroundColor: '#fff', // Kolor tła przycisku
		borderRadius: 10, // Zaokrąglenie rogów przycisku
		padding: 10, // Wewnętrzny odstęp przycisku
	},
	buttonText: {
		color: 'black', // Kolor tekstu przycisku
		fontWeight: 'bold', // Grubość czcionki
	},
})

export default CameraModule
