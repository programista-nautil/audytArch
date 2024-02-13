import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, Pressable, Image } from 'react-native'
import { Stack, useFocusEffect } from 'expo-router'
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera'
import { ActivityIndicator } from 'react-native-paper'
import { FontAwesome5 } from '@expo/vector-icons'


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

	const uploadPhoto = async photo => {
		if (!photo) {
			return
		}
		const result = await fetch(`file://${photo.path}`)
		const data = await result.blob()

		console.log(data)
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
