import React, { useState, useEffect, useRef } from 'react'
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Switch,
	Button,
	StyleSheet,
	Linking,
	Image,
	TextInput,
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import axios from 'axios'
import * as webBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { GDrive, MimeTypes, GoogleDriveApi, GoogleSignin } from '@robinbobin/react-native-google-drive-api-wrapper'
import styles from './1.style'
import { COLORS, SIZES, icons, images } from '../../constants'

webBrowser.maybeCompleteAuthSession()

const elements = [
	{
		name: 'CIĄGI KOMUNIKACYJNE',
		content: [
			'Brak nierównego chodnika, wysokich krawężników i przeszkód',
			'Kontrastowe i antypoślizgowe materiały wykończeniowe ułatwiające orientację i poruszanie się',
			'Wyposażenie, miejsca odpoczynku, siedzenia i elementy małej architektury znajdują się poza szerokością 1,8 m (główna trasa dojścia do budynku)',
			'Minimalna szerokość ciągi komunikacyjne: 150 cm (oddzielone od jezdni) 200 cm (przy jezdni)',
			'W ciągach pieszych o szerokości poniżej 180 cm i długości powyżej 50 m  miejsca mijania o długości 200 cm i szerokości 180 cm co 25 m',
			'Ścieżki rowerowe wyraźnie oddzielone od chodnika',
			'Podkreślenie głównych ciągów komunikacyjnych za pomocą faktury materiału, zastosowanie ścieżek dotykowych',
		],
	},
	{
		name: 'SCHODY ZEWNĘTRZNE',
		content: [
			'Ilość stopni w jednym biegu poniżej 10',
			'Szerokość: biegu 1,2 m, spocznika 1,5 m',
			'Głębokość stopni min. 35 cm, wysokość stopni max. 17,5 cm',
			'Powierzchnie spoczników schodów mają wykończenie wyróżniające je odcieniem, barwą bądź fakturą, min. w pasie 30 cm od krawędzi rozpoczynającej i kończącej bieg schodów',
		],
	},
	{
		name: 'WYPOSAŻENIE ZEWNĘTRZNE',
		content: [
			'Ławki wyposażone w oparcia i podłokietniki (przynajmniej 1/3 miejsc siedzących)',
			'Zapewniono miejsca postojowe dla rowerów',
		],
	},
	{
		name: 'OZNACZENIA I TABLICE INFORMACYJNE',
		content: [
			'Czytelne oznaczenia w języku symbolicznym lub obrazkowym',
			'Czytelne tablice informacyjne w języku symbolicznym lub obrazkowym',
		],
	},
	{
		name: 'OŚWIETLENIE ZEWNĘTRZNE',
		content: [
			'Trasa dojścia do budynku jest dobrze oświetlona',
			'Rozstaw opraw oświetleniowych umożliwia równomierną dystrybucję światła',
			'Nie występują miejsca niedoświetlone',
		],
	},
]

const One = () => {
	const gdrive = new GDrive()

	const [openSections, setOpenSections] = useState({})
	const [switchValues, setSwitchValues] = useState(Array(elements.length).fill(false))
	const [switchValuesContent, setSwitchValuesContent] = useState(
		Array(elements.length)
			.fill(null)
			.map(_ => Array(3).fill(false))
	)
	const [commentIndex, setCommentIndex] = useState(null) // New state variable for comment index
	const [comment, setComment] = useState('') // New state variable for comment

	const handleToggle = index => {
		setOpenSections(prevState => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	const handleSwitch = (index, value) => {
		setSwitchValues(prevState => prevState.map((val, i) => (i === index ? value : val)))
	}

	const handleSwitchContent = (index, contentIndex, value) => {
		setSwitchValuesContent(prevState => {
			const newState = [...prevState]
			newState[index][contentIndex] = value
			return newState
		})
		setCommentIndex(contentIndex) // Store the current content index for comments
	}

	const handleCommentChange = (index, contentIndex, text) => {
		setComments(prevState => {
			const updatedComments = [...prevState]
			updatedComments[index] = {
				...updatedComments[index],
				[contentIndex]: text,
			}
			return updatedComments
		})
	}

	const handleSubmit = () => {
		const updatedElements = elements.map((element, index) => {
			const updatedContent = element.content.map((text, contentIndex) => {
				const state = switchValuesContent[index][contentIndex]
				let updatedText = text

				if (state === 'Tak' || state === 'Nie' || state === 'Nie dotyczy' || state === '') {
					const lowercaseState = state.toLowerCase()
					const pattern = new RegExp(`\\b${state}\\b`, 'gi')
					updatedText = updatedText.replace(pattern, lowercaseState)
				}

				return {
					text: updatedText,
					state: state !== undefined ? state : 'Nie dotyczy',
					comment: comments[index]?.[contentIndex] || '', // Include the corresponding comment from the state
				}
			})

			return {
				...element,
				isOpen: !!openSections[index],
				content: updatedContent,
			}
		})

		const switchValuesFormatted = switchValues.map(value => (value ? 'Tak' : 'Nie'))

		const data = {
			switchValues: switchValuesFormatted,
			elements: updatedElements,
			comment: comment,
		}

		console.log('Dane do wysłania:', JSON.stringify(data, null, 2))

		axios
			.post(
				'https://script.google.com/macros/s/AKfycbw4w8NIpmIbreIvYhVIM20VVNHaJP3RlJIQHSGIu-fDS4Ib60tRIELpxxHPAxAAXTFhxg/exec',
				data
			)
			.then(response => {
				console.log('Odpowiedź:', response.data)
			})
			.catch(error => {
				console.log('Błąd:', error)
			})
	}

	const [isCameraVisible, setIsCameraVisible] = useState({})
	const [hasCameraPermission, setHasCameraPermission] = useState(false)
	const [image, setImage] = useState(null)
	const [type, setType] = useState(Camera.Constants.Type.back)
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
	const [imageUri, setImageUri] = useState(null)
	const [comments, setComments] = useState(Array(elements.length).fill('')) // New state for comments

	const cameraRef = useRef(null)

	const scopes = ['https://www.googleapis.com/auth/drive']

	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId: '399573477414-ndn9kb11avof808qb2fstj1r5feoo456.apps.googleusercontent.com',
		androidClientId: '399573477414-bchnbbu5sdp3uv2o6euneq9jeui11oej.apps.googleusercontent.com',
		expoClientId: '399573477414-ndn9kb11avof808qb2fstj1r5feoo456.apps.googleusercontent.com',
		scopes: scopes,
	})

	const [userInfo, setUserInfo] = useState(null)
	const [auth, setAuth] = useState(null)

	const [accessToken, setAccessToken] = React.useState(null)
	const [user, setUser] = React.useState(null)

	useEffect(() => {
		;(async () => {
			MediaLibrary.requestPermissionsAsync()
			const cameraStatus = await Camera.requestCameraPermissionsAsync()
			setHasCameraPermission(cameraStatus.status === 'granted')
		})()
	}, [])

	useEffect(() => {
		if (response?.type === 'success') {
			setAccessToken(response.authentication.accessToken)
			accessToken && fetchUserInfo()
			gdrive.accessToken = response.authentication.accessToken
			console.log({ responseToken: response.authentication.accessToken })
			console.log(gdrive.files.list())
		}
	}, [response, accessToken])

	const accessTokenImage = accessToken

	const folderId = '1AF-FZqNgiIQAaBecq5Z8WBBp1vO8WkvS'

	const ShowUserInfo = () => {
		if (user) {
			return (
				<View style={styles.userInfoContainer}>
					<Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
					<Text style={styles.userInfoText}>Imię: {userInfo.given_name}</Text>
					<Text style={styles.userInfoText}>Nazwisko: {userInfo.family_name}</Text>
					<Text style={styles.userInfoText}>ID: {userInfo.id}</Text>
					<Text style={styles.userInfoText}>Link do zdjęcia: {userInfo.picture}</Text>
				</View>
			)
		}
	}

	const fetchUserInfo = async () => {
		let response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		let user = await response.json()
		setUserInfo(user)
		console.log({ user: user })
	}

	const test = async fileUri => {
		try {
			console.log({ accessToken: accessTokenImage })

			const apiUrl = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`
			const folderId = '1AF-FZqNgiIQAaBecq5Z8WBBp1vO8WkvS'
			const fileName = 'testowy_plik.jpg'
			const mimeType = 'image/jpeg'

			const formData = new FormData()
			formData.append('metadata', JSON.stringify({ name: 'testowy_plik.jpg', mimeType }))
			formData.append('file', { uri: fileUri, type: mimeType, name: 'testowy_plik.jpg' })

			const response = await gdrive.files.createFile({
				name: fileName,
				mimeType: mimeType,
				parents: [folderId],
				media: {
					mimeType: mimeType,
					body: {
						fileUri: fileUri,
					},
				},
			})

			console.log('Plik wysłany na Dysk Google:', response)
		} catch (error) {
			console.log('Błąd:', error.response.data)
		}
	}

	const takePicture = async () => {
		if (cameraRef) {
			try {
				const data = await cameraRef.current.takePictureAsync()
				setImage(data.uri)

				if (token && data.uri) {
					const asset = await MediaLibrary.createAssetAsync(data.uri)
					console.log('saved successfully')
					const assetInfo = await MediaLibrary.getAssetInfoAsync(asset)
					console.log('Asset Info:', assetInfo)
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

				console.log('Przesyłam zdjęcie na Dysk Google - assetInfo.uri:', assetInfo.uri)
				await _initGoogleDrive()
				console.log(await _initGoogleDrive())
				test(assetInfo.uri)
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

	const handleCameraButtonPress = index => {
		setIsCameraVisible(prevState => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.lightWhite, marginHorizontal: 10 }}>
			<ScrollView style={styles.container}>
				{elements.map((element, index) => (
					<TouchableOpacity key={index} onPress={() => handleToggle(index)}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Text
								style={{
									flex: 1,
									fontSize: 16,
									color: COLORS.tertiary,
								}}>
								{element.name}
							</Text>
							<Switch value={openSections[index]} onValueChange={() => handleToggle(index)} />
						</View>
						{openSections[index] && (
							<View style={{ backgroundColor: COLORS.gray2 }}>
								{element.content.map((content, contentIndex) => (
									<View
										key={contentIndex}
										style={{
											backgroundColor: contentIndex % 2 === 1 ? COLORS.lightGray : COLORS.white,
										}}>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}>
											<Text style={[styles.tabText, { flex: 1 }]}>{content}</Text>
											<View style={styles.stateButtonContainer}>
												<TouchableOpacity
													style={[
														styles.stateButton,
														switchValuesContent[index][contentIndex] === 'Tak' && { backgroundColor: COLORS.primary },
													]}
													onPress={() => handleSwitchContent(index, contentIndex, 'Tak')}>
													<Text
														style={[
															styles.stateButtonText,
															switchValuesContent[index][contentIndex] === 'Tak' && { color: COLORS.white },
														]}>
														Tak
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={[
														styles.stateButton,
														switchValuesContent[index][contentIndex] === 'Nie' && { backgroundColor: COLORS.primary },
													]}
													onPress={() => handleSwitchContent(index, contentIndex, 'Nie')}>
													<Text
														style={[
															styles.stateButtonText,
															switchValuesContent[index][contentIndex] === 'Nie' && { color: COLORS.white },
														]}>
														Nie
													</Text>
												</TouchableOpacity>
											</View>
										</View>
										<View style={{ width: '100%' }}>
											<TextInput
												style={{
													height: 40,
													borderColor: 'gray',
													borderWidth: 1,
													width: '100%',
													marginBottom: 10,
												}}
												placeholder='Wpisz uwagi'
												value={comments[index]?.[contentIndex] || ''} // Update this line
												onChangeText={text => handleCommentChange(index, contentIndex, text)} // Pass the contentIndex parameter
											/>
										</View>
									</View>
								))}
								<View>
									<TouchableOpacity onPress={() => handleCameraButtonPress(index)} style={styles.cameraButton}>
										<Text style={styles.cameraButtonText}>Open Camera</Text>
									</TouchableOpacity>

									{isCameraVisible[index] && (
										<View style={styles.cameraContainer}>
											{!image ? (
												<Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flash}>
													<View style={styles.cameraButtons}>
														<Button
															title=''
															icon='retweet'
															onPress={() => {
																setType(
																	type === Camera.Constants.Type.back
																		? Camera.Constants.Type.front
																		: Camera.Constants.Type.back
																)
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
												<Button title='Take a picture' onPress={() => takePicture(index)} icon='camera' />
											) : (
												<View style={styles.cameraButtons}>
													<Button title='Re-take' onPress={() => setImage(null)} icon='retweet' />
													<Button title='Save' onPress={savePicture} icon='check' />
												</View>
											)}
										</View>
									)}
								</View>
							</View>
						)}
					</TouchableOpacity>
				))}
			</ScrollView>
			<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
				<Text style={styles.submitButtonText}>WYŚLIJ</Text>
			</TouchableOpacity>
		</View>
	)
}

export default One
