import { View, Text, StyleSheet, TouchableOpacity, Button, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'

const two = () => {
	const [isCameraVisible, setIsCameraVisible] = useState(false)
	const [hasCameraPermission, setHasCameraPermission] = useState(false)
	const [image, setImage] = useState(null)
	const [type, setType] = useState(Camera.Constants.Type.back)
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
	const cameraRef = useRef(null)

	useEffect(() => {
		;(async () => {
			MediaLibrary.requestPermissionsAsync()
			const cameraStatus = await Camera.requestCameraPermissionsAsync()
			setHasCameraPermission(cameraStatus.status === 'granted')
		})()
	}, [])

	const takePicture = async () => {
		if (cameraRef) {
			try {
				const data = await cameraRef.current.takePictureAsync()
				console.log(data)
				setImage(data.uri)

				// Prześlij zdjęcie na Google Drive
				if (token && data.uri) {
					const asset = await MediaLibrary.createAssetAsync(data.uri)
					console.log('saved successfully')
					const assetInfo = await MediaLibrary.getAssetInfoAsync(asset)
					console.log('Asset Info:', assetInfo)
					uploadToGoogleDrive(assetInfo, token)
				}
			} catch (e) {
				console.log(e)
			}
		}
	}

	const savePicture = async () => {
		if (image) {
			try {
				const asset = await MediaLibrary.createAssetAsync(image)
				alert('Picture saved! 🎉')
				setImage(null)
				console.log('saved successfully')
				const assetInfo = await MediaLibrary.getAssetInfoAsync(asset)
				console.log('Asset Info:', assetInfo)
				// uploadToGoogleDrive(assetInfo, token)
			} catch (error) {
				console.log(error)
			}
		}
	}

	const getCameraPermission = async () => {
		const permission = PermissionsAndroid.PERMISSIONS.CAMERA
		const hasPermission = await PermissionsAndroid.check(permission)
		if (hasPermission) {
			return true
		}

		const status = await PermissionsAndroid.request(permission)
		return status === 'granted'
	}

	const handleCameraButtonPress = () => {
		setIsCameraVisible(!isCameraVisible)
	}

	return (
		<View>
			<TouchableOpacity onPress={handleCameraButtonPress} style={styles.cameraButton}>
				<Text style={styles.cameraButtonText}>Open Camera</Text>
			</TouchableOpacity>
			{isCameraVisible && (
				<View style={styles.cameraContainer}>
					{!image ? (
						<Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flash}>
							<View style={styles.cameraButtons}>
								<Button
									title=''
									icon='retweet'
									onPress={() => {
										setType(type === CameraType.back ? CameraType.front : CameraType.back)
									}}
								/>
								<Button
									title=''
									onPress={() =>
										setFlash(
											flash === Camera.Constants.FlashMode.off
												? Camera.Constants.FlashMode.on
												: Camera.Constants.FlashMode.off
										)
									}
									icon='flash'
									color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
								/>
							</View>
						</Camera>
					) : (
						<Image source={{ uri: image }} style={styles.camera} />
					)}
					{!image ? (
						<Button title='Take a picture' onPress={takePicture} icon='camera' />
					) : (
						<View style={styles.cameraButtons}>
							<Button title='Re-take' onPress={() => setImage(null)} icon='retweet' />
							<Button title='Save' onPress={savePicture} icon='check' />
						</View>
					)}
				</View>
			)}
		</View>
	)
}

export default two

const styles = StyleSheet.create({
	pickerContainer: {
		width: '100%',
	},
	pickerItem: {
		width: '100%', // Dostosuj szerokość do swoich potrzeb
		paddingHorizontal: 10,

		textAlign: 'center',
		justifyContent: 'center',

		flexWrap: 'wrap',
	},
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	section: {
		marginBottom: 20,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	sectionHeaderText: {
		fontSize: 18,
		fontWeight: 'bold',
		marginRight: 10,
	},
	arrowIcon: {
		width: 20,
		height: 20,
	},
	sectionContent: {
		marginTop: 10,
	},
	sectionContentText: {
		fontSize: 16,
	},
	switchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	switchLabel: {
		fontSize: 16,
		marginRight: 10,
	},
	dropdownContainer: {
		marginBottom: 20,
	},
	dropdownLabel: {
		fontSize: 16,
		marginBottom: 10,
	},
	dropdownRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	dropdown: {
		flex: 1,
		height: 40,
		marginRight: 10,
		flexGrow: 1,
		flexWrap: 'wrap',
	},
	removeDropdownButton: {
		backgroundColor: 'red',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	removeDropdownButtonText: {
		color: 'white',
	},
	addDropdownButton: {
		backgroundColor: 'green',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	addDropdownButtonText: {
		color: 'white',
	},
	cameraContainer: {
		marginBottom: 20,
	},
	cameraButton: {
		backgroundColor: 'blue',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	cameraButtonText: {
		color: 'white',
	},
	camera: {
		height: 200,
		marginBottom: 10,
	},
	cameraControls: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
	},
	cameraControlsText: {
		color: 'white',
	},
	imagePreviewContainer: {
		alignItems: 'center',
		marginBottom: 10,
	},
	imagePreview: {
		width: 200,
		height: 200,
		marginBottom: 10,
	},
	savePictureButton: {
		backgroundColor: 'green',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	savePictureButtonText: {
		color: 'white',
	},
	choosePhotoButton: {
		backgroundColor: 'orange',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
		marginBottom: 20,
	},
	choosePhotoButtonText: {
		color: 'white',
	},
	userInfoContainer: {
		alignItems: 'center',
		marginBottom: 20,
	},
	userInfoText: {
		fontSize: 16,
		marginBottom: 10,
	},
})
