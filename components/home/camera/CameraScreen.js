import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, Pressable, Image } from 'react-native'
import { Stack, useFocusEffect } from 'expo-router'
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera'
import { ActivityIndicator } from 'react-native-paper'
import { FontAwesome5 } from '@expo/vector-icons'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import RNFetchBlob from 'rn-fetch-blob'
import GDrive from 'react-native-google-drive-api-wrapper'

const CameraScreen = () => {
	const device = useCameraDevice('back')
	const cameraRef = useRef(null)

	const { hasPermission, requestPermission } = useCameraPermission()
	const [isActive, setIsActive] = useState(false)
	const [photo, setPhoto] = useState(null)

	useFocusEffect(
		useCallback(() => {
			setIsActive(true)

			return () => {
				setIsActive(false)
			}
		}, [])
	)

	useEffect(() => {
		requestPermission()
	}, [hasPermission])

	const onTakePicturePressed = async () => {
		if (cameraRef.current) {
			const photo = await cameraRef.current.takePhoto()
			// Zrób coś z obiektem photo, na przykład zapisz go lub wyświetl
			console.log(photo)
			uploadPhoto(photo)
			setPhoto(photo)
		}
	}

	//write function to upload photo to google drive

	const uploadPhoto = async photo => {
		console.log(photo.path)
		try {
			const token = (await GoogleSignin.getTokens()).accessToken
			GDrive.setAccessToken(token)
			GDrive.init()

			const base64 = await RNFetchBlob.fs.readFile(`file://${photo.path}`, 'base64')
			console.log(base64)
			const result = await GDrive.files.createFileMultipart(
				base64,
				'image/jpeg',
				{
					parents: ['1AF-FZqNgiIQAaBecq5Z8WBBp1vO8WkvS'],
					name: 'Uploaded_Photo.jpg',
				},
				true
			)

			if (result.ok) {
				console.log('Uploaded file with ID: ', result.id)
			} else {
				throw new Error('Failed to upload photo')
			}
		} catch (error) {
			console.error('Error uploading image to Google Drive: ', error)
		}

		// try {
		// 	const userInfo = await GoogleSignin.getCurrentUser()
		// 	if (!userInfo) {
		// 		console.log('User not logged in')
		// 		return
		// 	}

		// 	const accessToken = (await GoogleSignin.getTokens()).accessToken
		// 	if (!accessToken) {
		// 		console.log('Access token is not available')
		// 		return
		// 	}

		// 	console.log('User is logged in, accessToken is available')

		// 	// Dodatkowe sprawdzenie uprawnień (opcjonalne)
		// 	const permissionResponse = await fetch('https://www.googleapis.com/drive/v3/about?fields=*', {
		// 		headers: { Authorization: `Bearer ${accessToken}` },
		// 	})
		// 	const permissions = await permissionResponse.json()
		// 	console.log('Permissions: ', permissions)

		// 	const metadata = {
		// 		name: 'photo.jpg', // Nazwa pliku
		// 		mimeType: 'image/jpeg', // Typ MIME pliku
		// 		// Możesz dodać więcej metadanych, jeśli potrzebujesz
		// 	}

		// 	const formData = new FormData()
		// 	formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
		// 	formData.append('file', {
		// 		uri: `file://${photo.path}`,
		// 		type: 'image/jpeg',
		// 		name: 'photo.jpg',
		// 	})

		// 	const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
		// 		method: 'POST',
		// 		headers: {
		// 			Authorization: `Bearer ${accessToken}`,
		// 		},
		// 		body: formData,
		// 	})

		// 	const result = await response.json()
		// 	console.log('plik przesłany')
		// 	return result
		// } catch (error) {
		// 	console.error('Error uploading image to Google Drive: ', error)
		// 	console.log('Detailed error: ', error.message)
		// 	if (error.response) {
		// 		console.log('Error status: ', error.response.status)
		// 		console.log('Error status text: ', error.response.statusText)
		// 		console.log('Error body: ', await error.response.text())
		// 	}
		// }
	}

	if (!hasPermission) {
		return <ActivityIndicator size='large' />
	}

	return (
		<View style={{ flex: 1 }}>
			<Stack.Screen options={{ headerShown: false }} />

			<Camera
				ref={cameraRef}
				photo={true}
				style={StyleSheet.absoluteFill}
				device={device}
				isActive={isActive && !photo}
			/>

			{photo ? (
				<View style={{ flex: 1 }}>
					<Image source={{ uri: `file://${photo.path}` }} style={StyleSheet.absoluteFill} />
					<FontAwesome5
						onPress={() => setPhoto(undefined)}
						name='arrow-left'
						size={30}
						color='white'
						style={{ position: 'absolute', top: 30, left: 30 }}
					/>
				</View>
			) : (
				<>
					<Pressable
						onPress={onTakePicturePressed}
						style={{
							position: 'absolute',
							alignSelf: 'center',
							bottom: 50,
							width: 75,
							height: 65,
							backgroundColor: 'white',
							borderRadius: 75,
						}}
					/>
				</>
			)}
		</View>
	)
}

export default CameraScreen
