// CameraModule.js
import React, { useState, useEffect, useRef } from 'react'
import { View, Button, StyleSheet, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'
import axios from 'axios'
import * as MediaLibrary from 'expo-media-library'
import Icon from 'react-native-vector-icons/MaterialIcons' // Przykład użycia ikon z Material Icons

const CameraModule = ({ onPictureTaken, uploadUrl, elementName, onClose }) => {
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

		setIsCameraVisible(false)
		setTimeout(() => setIsCameraVisible(true), 100)

		onPictureTaken && onPictureTaken(photo.uri)
		savePhotoToGallery(photo.uri)
		uploadFile(photo.uri)
	}

	useEffect(() => {
		console.log('Prośba o uprawnienia do aparatu...')
		;(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync()
			console.log('Status uprawnień do aparatu:', status)
			setHasCameraPermission(status === 'granted')

			const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync()

			if (status === 'granted') {
				setIsCameraVisible(true) // Ustawienie widoczności aparatu na true
			}
		})()
	}, [])

	const savePhotoToGallery = async photoUri => {
		try {
			const asset = await MediaLibrary.createAssetAsync(photoUri)
			await MediaLibrary.createAlbumAsync('TwojaNazwaAlbumu', asset, false)
		} catch (error) {
			console.error('Błąd podczas zapisywania zdjęcia:', error)
		}
	}

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
	if (!isCameraVisible) {
		return null // lub renderuj inny komponent/menu, które ma być widoczne, gdy aparat jest zamknięty
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.closeButton} onPress={onClose}>
				<Icon name='close' size={30} color='white' />
			</TouchableOpacity>
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
		zIndex: 1, // Niższy indeks niż przycisk wstecz
	},
	buttonContainer: {
		position: 'absolute', // Pozycjonowanie absolutne, aby przycisk znajdował się nad widokiem aparatu
		bottom: 20, // Odstęp od dolnej krawędzi
		zIndex: 2,
	},
	button: {
		backgroundColor: '#fff', // Kolor tła przycisku
		borderRadius: 10, // Zaokrąglenie rogów przycisku
		padding: 10, // Wewnętrzny odstęp przycisku
		color: 'black', // Kolor tekstu przycisku
	},
	buttonText: {
		color: 'black', // Kolor tekstu przycisku
		fontWeight: 'bold', // Grubość czcionki
	},
	closeButton: {
		position: 'absolute',
		top: 20,
		right: 20,
		zIndex: 2,
		// Dalsze style dla przycisku (np. padding, backgroundColor itp.)
	},
})

export default CameraModule
