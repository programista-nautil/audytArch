import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, Pressable, Image } from 'react-native'
import { Stack, useFocusEffect } from 'expo-router'
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera'
import { ActivityIndicator } from 'react-native-paper'
import { FontAwesome5 } from '@expo/vector-icons'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import RNFetchBlob from 'rn-fetch-blob'
import GDrive from 'react-native-google-drive-api-wrapper'
import { useNavigation } from '@react-navigation/native'

const CameraScreen = ({ route }) => {
	const { title } = route.params // Destructuring title from route.params
	console.log(title) // Logowanie tytułu
	const device = useCameraDevice('back')
	const cameraRef = useRef(null)

	const navigation = useNavigation()

	const { hasPermission, requestPermission } = useCameraPermission()
	const [isActive, setIsActive] = useState(false)
	const [photo, setPhoto] = useState(null)
	const [isFullScreenCameraVisible, setIsFullScreenCameraVisible] = useState(false)

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
					name: title,
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
	}

	if (!hasPermission) {
		return <ActivityIndicator size='large' />
	}

	const handleCloseCamera = () => {
		setIsFullScreenCameraVisible(false)
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
						onPress={() => setPhoto(null)}
						name='arrow-left'
						size={30}
						color='white'
						style={{ position: 'absolute', top: 30, left: 30 }}
					/>
				</View>
			) : (
				<>
					<FontAwesome5
						onPress={() => navigation.goBack()}
						name='arrow-left'
						size={30}
						color='white'
						style={{ position: 'absolute', top: 30, left: 30 }}
					/>
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
