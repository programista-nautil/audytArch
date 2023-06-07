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
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import axios from 'axios'
import * as webBrowser from 'expo-web-browser'
import { GDrive, MimeTypes, GoogleDriveApi } from '@robinbobin/react-native-google-drive-api-wrapper'
import styles from './1.style'
import { COLORS, SIZES, icons, images } from '../../constants'
import CameraAltIcon from '../../assets/icons/camera.png'
import * as Google from 'expo-auth-session/providers/google'
import * as FileSystem from 'expo-file-system'
import { elementsData12 } from '../dataElements.js'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'


webBrowser.maybeCompleteAuthSession()

let elements = elementsData12
const STORAGE_KEY = 'authToken'
const Twelve = () => {
	const route = useRoute()
	const { title } = route.params
	const navigation = useNavigation()
	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: title,
		})
	}, [title])
	/*moduł dotyczący logowania do google*/
	const [accessToken, setAccessToken] = React.useState(null)

	const getAuthToken = async () => {
		try {
			const token = await SecureStore.getItemAsync(STORAGE_KEY)
			console.log('Zapisany token uwierzytelniający:', token)
			return token
		} catch (error) {
			console.log('Błąd podczas odczytywania tokenu uwierzytelniającego:', error)
			return null
		}
	}

	const gdrive = new GDrive()

	gdrive.accessToken = accessToken

	useEffect(() => {
		const fetchData = async () => {
			const token = await getAuthToken()
			setAccessToken(token)
		}
		fetchData()
	}, [])

	useEffect(() => {
		if (accessToken) {
			axios
				.get('https://www.googleapis.com/drive/v3/files', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					params: {
						q: "'1AF-FZqNgiIQAaBecq5Z8WBBp1vO8WkvS' in parents",
						fields: 'files(id, name)',
					},
				})
				.then(res => {
					setDriveFiles(res.data.files)
					console.log('Files:', res.data.files)
					console.log('accessToken', accessToken)
				})
				.catch(err => {
					console.error('Error fetching files:', err)
					console.log('accessToken', accessToken)
				})
		}
	}, [accessToken])

	/*moduł dotyczący zapisywania zdjęcia do google*/
	const parentId = '1AF-FZqNgiIQAaBecq5Z8WBBp1vO8WkvS'

	const uploadFile = async (token, parentId, uri, base64, filename) => {
		const fileUri = uri
		const fileInfo = await FileSystem.getInfoAsync(fileUri)
		const file = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' })
		const mimeType = 'image/jpeg'

		console.log({ token: token, parentId: parentId, uri: uri, filename: filename })

		const boundary = 'foo_bar_baz'
		const delimiter = '\r\n--' + boundary + '\r\n'
		const close_delim = '\r\n--' + boundary + '--'

		const body =
			delimiter +
			'Content-Type: application/json\r\n\r\n' +
			JSON.stringify({
				name: filename,
				mimeType: 'image/jpeg',
				parents: [parentId],
			}) +
			'\r\n' +
			delimiter +
			'Content-Type: ' +
			mimeType +
			'\r\n' +
			'Content-Transfer-Encoding: base64\r\n' +
			'\r\n' +
			base64 +
			close_delim

		try {
			const res = await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', body, {
				headers: {
					'Content-Type': 'multipart/related; boundary=' + boundary,
					Authorization: 'Bearer ' + token,
				},
			})

			return res.data
		} catch (error) {
			console.error('Error during file upload:', error.response.status, error.response.data)
			throw error
		}
	}

	const [userInfo, setUserInfo] = useState(null)
	const [user, setUser] = React.useState(null)
	const [isCameraVisible, setIsCameraVisible] = useState({})
	const [hasCameraPermission, setHasCameraPermission] = useState(false)
	const [image, setImage] = useState(null)
	const [type, setType] = useState(Camera.Constants.Type.back)
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
	const [comments, setComments] = useState(Array(elements.length).fill('')) // New state for comments
	const [isFullScreenCameraVisible, setIsFullScreenCameraVisible] = useState(false)
	const [elementName, setElementName] = useState('')
	const cameraRef = useRef(null)
	const [openSections, setOpenSections] = useState({})
	const [switchValues, setSwitchValues] = useState(Array(elements.length).fill(false))
	const [switchValuesContent, setSwitchValuesContent] = useState(
		Array(elements.length)
			.fill(null)
			.map(_ => Array(3).fill(false))
	)
	const [commentIndex, setCommentIndex] = useState(null) // New state variable for comment index
	const [comment, setComment] = useState('') // New state variable for comment
	const [driveFiles, setDriveFiles] = useState([])

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

	useEffect(() => {
		;(async () => { 
			MediaLibrary.requestPermissionsAsync()
			const cameraStatus = await Camera.requestCameraPermissionsAsync()
			setHasCameraPermission(cameraStatus.status === 'granted')
		})()
	}, [])

	useEffect(() => {
		if (accessToken) {
			fetchUserInfo()
			ShowUserInfo()
		}
	}, [accessToken])

	const accessTokenImage = accessToken

	const ShowUserInfo = async () => {
		try {
			const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
				headers: { Authorization: `Bearer ${accessToken}` },
			})

			const user = await response.json()
			setUserInfo(user)
		} catch (error) {
			// Add your own error handler here
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

	const savePicture = async (uri, elementName, base64Data) => {
		// Przyjmuj uri jako argument
		console.log('Zapisuję zdjęcie na telefonie', uri) // Wydrukuj uri
		if (uri) {
			try {
				const asset = await MediaLibrary.createAssetAsync(uri)
				alert('Picture saved! 🎉')
				const assetInfo = await MediaLibrary.getAssetInfoAsync(asset)

				// Limit the contentName to the first 6 characters and use it as the file name.
				const fileName = `${elementName}.jpg`
				console.log({ uri })

				uploadFile(accessToken, parentId, uri, base64Data, elementName)
					.then(res => {
						console.log('File uploaded:', res)
					})
					.catch(err => {
						console.log('Error uploading file:', err)
					})

				setImage(null)
			} catch (error) {
				console.log(error)
			}
		} else {
			console.log('Błąd: uri jest null podczas zapisywania zdjęcia.')
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

	const handleCameraButtonPress = async (index, contentName) => {
		console.log('handleCameraButtonPress', index, contentName.substring(0, 6))
		setElementName(contentName.substring(0, 6))
		setIsFullScreenCameraVisible(true)
	}
	const handleFullScreenCameraButtonPress = () => {
		setIsFullScreenCameraVisible(true)
	}
	const closeFullScreenCamera = () => {
		setIsFullScreenCameraVisible(false)
	}

	const takeFullScreenPicture = async () => {
		if (cameraRef.current) {
			try {
				const { uri } = await cameraRef.current.takePictureAsync()
				const options = { quality: 0.5, base64: true }
				const data = await cameraRef.current.takePictureAsync(options)
				const base64Data = data.base64

				console.log('Zdjęcie zrobione. URI:', uri) // Debug: wydrukuj uri

				if (typeof uri === 'string') {
					// Sprawdź, czy uri jest stringiem
					await savePicture(uri, elementName, base64Data)
				} else {
					console.log('Błąd: uri nie jest stringiem, jest typu ', typeof uri) // Jeśli uri nie jest stringiem, wydrukuj jego typ
				}

				closeFullScreenCamera()
			} catch (error) {
				console.log('Błąd podczas robienia zdjęcia:', error)
			}
		}
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
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<TouchableOpacity
													style={styles.cameraIconContainer}
													onPress={() => handleCameraButtonPress(index, content)}>
													<Image
														source={icons.camera}
														style={[styles.cameraIcon, isCameraVisible[index] && styles.cameraIconActive]}
													/>
												</TouchableOpacity>
												<TouchableOpacity onPress={() => handleCameraButtonPress(index, content)}>
													<Image source={CameraAltIcon} style={styles.cameraAltIcon} />
												</TouchableOpacity>
											</View>
										</View>
										<View style={styles.commentContainer}>
											<TextInput
												style={styles.commentInput}
												placeholder='Wpisz uwagi'
												value={comments[index]?.[contentIndex] || ''}
												onChangeText={text => handleCommentChange(index, contentIndex, text)}
											/>
										</View>
									</View>
								))}
							</View>
						)}
					</TouchableOpacity>
				))}
			</ScrollView>

			{isFullScreenCameraVisible && (
				<View style={StyleSheet.absoluteFill}>
					<Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flash}>
						<View style={styles.cameraButtons}>
							{/* ... Dodaj przyciski i funkcje obsługujące zmianę typu aparatu i lampy błyskowej ... */}
						</View>
					</Camera>
					<View style={styles.fullScreenCameraButtons}>
						{/* Dodaj przyciski zrobienia zdjęcia, zamknięcia aparatu na pełny ekran i anulowania */}
						<Button title='Zrób zdjęcie' onPress={takeFullScreenPicture} />
						<Button title='Zamknij' onPress={closeFullScreenCamera} />
					</View>
				</View>
			)}
			{!isFullScreenCameraVisible && ( // Dodaj warunek renderowania przycisku "Wyślij"
				<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
					<Text style={styles.submitButtonText}>WYŚLIJ</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

export default Twelve
