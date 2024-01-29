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
	Alert,
} from 'react-native'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import axios from 'axios'
import * as webBrowser from 'expo-web-browser'
import { GDrive, MimeTypes, GoogleDriveApi } from '@robinbobin/react-native-google-drive-api-wrapper'
import styles from './2.style'
import { COLORS, SIZES, icons, images } from '../../constants'
import CameraAltIcon from '../../assets/icons/camera.png'
import * as Google from 'expo-auth-session/providers/google'
import * as FileSystem from 'expo-file-system'
import { elementsData8 } from '../dataElements.js'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'

webBrowser.maybeCompleteAuthSession()

let elements = elementsData8
const STORAGE_KEY = 'authToken'
const Seven = () => {
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

	const [pictureCount, setPictureCount] = useState(0)
	const [userInfo, setUserInfo] = useState(null)
	const [user, setUser] = React.useState(null)
	const [isCameraVisible, setIsCameraVisible] = useState({})
	const [hasCameraPermission, setHasCameraPermission] = useState(false)
	const [image, setImage] = useState(null)
	const [type, setType] = useState(Camera.Constants.Type.back)
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
	const [comments, setComments] = useState(Array(elementsData8.length - 2).fill(''))
	const [switchValues, setSwitchValues] = useState(Array(elementsData8.length).fill(false))
	const [selectedStates, setSelectedStates] = useState(elementsData8.map(element => element.content.map(() => '')))
	const [isFullScreenCameraVisible, setIsFullScreenCameraVisible] = useState(false)
	const [elementName, setElementName] = useState('')
	const cameraRef = useRef(null)
	const [openSections, setOpenSections] = useState({})
	const [switchValuesContent, setSwitchValuesContent] = useState(
		Array(elements.length)
			.fill(null)
			.map(_ => Array(3).fill(false))
	)
	const [commentIndex, setCommentIndex] = useState(null) // New state variable for comment index
	const [comment, setComment] = useState('') // New state variable for comment
	const [driveFiles, setDriveFiles] = useState([])
	const numberOfInputs = elementsData8.reduce((count, elem) => (elem.type === 'input' ? count + 1 : count), 0)
	const [inputValues, setInputValues] = useState(Array(numberOfInputs).fill({ name: '', value: '' }))

	const handleToggle = index => {
		setOpenSections(prevState => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	const handleSwitchContent = (index, contentIndex, value) => {
		setSwitchValuesContent(prevState => {
			const newState = [...prevState]
			newState[index][contentIndex] = value
			return newState
		})
		setCommentIndex(contentIndex) // Store the current content index for comments
	}

	const handleCommentChange = (index, text) => {
		setComments(prevState => {
			const updatedComments = [...prevState]
			updatedComments[index] = text
			return updatedComments
		})
	}

	const handleSwitch = (index, value) => {
		setSwitchValues(prevState => {
			const updatedSwitchValues = [...prevState]
			updatedSwitchValues[index] = value
			return updatedSwitchValues
		})
	}

	const handleStateSelection = (parentIndex, index, state) => {
		setSelectedStates(prevState => {
			const updatedSelectedStates = [...prevState]
			updatedSelectedStates[parentIndex][index] = state
			return updatedSelectedStates
		})

		console.log(`Updated selectedStates: ${JSON.stringify(selectedStates)}`)
	}

	const handleSubmit = () => {
		const data = {
			inputValues: inputValues,
			selectedStates: selectedStates,
			comments: comments,
		}

		const transformedData = transformData(data)
		console.log('Dane do wysłania:', JSON.stringify(transformedData, null, 2))

		axios
			.post(
				'https://script.google.com/macros/s/AKfycbw4w8NIpmIbreIvYhVIM20VVNHaJP3RlJIQHSGIu-fDS4Ib60tRIELpxxHPAxAAXTFhxg/exec',
				transformedData
			)
			.then(response => {
				console.log('Odpowiedź:', response.data)
				Alert.alert('Sukces', 'Dane zostały poprawnie wysłane.')
			})
			.catch(error => {
				console.log('Błąd:', error)
				Alert.alert('Błąd', 'Wystąpił problem podczas wysyłania danych.')
			})
	}

	const transformData = data => {
		const inputValuesCopy = data.inputValues.map(input => input.value)

		// Dołącz skopiowane wartości na początku `data.selectedStates[1]`
		data.selectedStates[1] = [...inputValuesCopy, ...data.selectedStates[1]]

		// Usuń pierwsze 3 elementy z `data.selectedStates[1]`
		data.selectedStates[1].splice(3, 3)

		const elements = []

		// Przyjmujemy, że indeks w `selectedStates` odpowiada indeksowi w `elementsData8`.
		data.selectedStates.forEach((states, index) => {
			console.log(`-----states-----: ${JSON.stringify(states)}`)
			const elementContent = states.map((state, contentIndex) => {
				return {
					text: elementsData8[index].content[contentIndex].name, // Użyj pola `name` jako `text`.
					state: state === '' ? false : state, // Jeżeli `state` jest pusty, ustawiamy `false`. W przeciwnym przypadku `true`.
					comment: data.comments[contentIndex] || '', // Dodajemy komentarz lub pusty string, jeżeli nie ma komentarza.
				}
			})

			elements.push({
				name: elementsData8[index].name,
				content: elementContent,
				isOpen: true,
			})
		})

		// Tworzymy ostateczną strukturę danych.
		const finalData = {
			switchValues: data.inputValues.map(input => input.value), // Przypuszczamy, że `inputValues` odpowiada `switchValues`.
			elements: elements,
			comment: '', // Dodajemy pusty string jako komentarz, jeżeli nie jest dostarczony inny.
		}

		return finalData
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
				setPictureCount(prevCount => prevCount + 1)
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

	const handleCameraButtonPress = async () => {
		const nextPictureNumber = pictureCount + 1
		setElementName(`7.${nextPictureNumber}`)
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

	const renderElement = (element, index, parentIndex) => {
		if (element.type === 'input') {
			return (
				<View key={index}>
					<Text>{element.name}</Text>
					<TextInput
						value={inputValues[index]?.value}
						onChangeText={text => {
							const newInputValues = [...inputValues]
							newInputValues[index] = { ...newInputValues[index], value: text }
							setInputValues(newInputValues)
						}}
						placeholder='Wpisz wartość...'
					/>
				</View>
			)
		} else if (element.type === 'choice') {
			return (
				<View
					key={index}
					style={{
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						marginVertical: 5,
					}}>
					<Text style={{ backgroundColor: COLORS.secondary }}>{element.name}</Text>
					<View style={[styles.stateButtonContainer, { flexDirection: 'row', alignItems: 'center' }]}>
						<TouchableOpacity
							onPress={() => handleStateSelection(parentIndex, index, 'Tak')}
							style={[
								styles.stateButton,
								selectedStates[parentIndex][index] === 'Tak' && { backgroundColor: COLORS.primary },
							]}>
							<Text
								style={[
									styles.stateButtonText,
									selectedStates[parentIndex][index] === 'Tak' && { color: COLORS.white },
								]}>
								Tak
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleStateSelection(parentIndex, index, 'Nie')}
							style={[
								styles.stateButton,
								selectedStates[parentIndex][index] === 'Nie' && { backgroundColor: COLORS.primary },
							]}>
							<Text
								style={[
									styles.stateButtonText,
									selectedStates[parentIndex][index] === 'Nie' && { color: COLORS.white },
								]}>
								Nie
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleStateSelection(parentIndex, index, 'Nie dotyczy')}
							style={[
								styles.stateButton,
								selectedStates[parentIndex][index] === 'Nie dotyczy' && { backgroundColor: COLORS.primary },
							]}>
							<Text
								style={[
									styles.stateButtonText,
									selectedStates[parentIndex][index] === 'Nie dotyczy' && { color: COLORS.white },
								]}>
								Nie dotyczy
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
	}

	return (
		<View style={{ flex: 1, flexDirection: 'column', backgroundColor: COLORS.lightWhite, marginHorizontal: 10 }}>
			<ScrollView style={styles.container}>
				{elementsData8.map((element, parentIndex) => (
					<View key={parentIndex}>
						{element.content.map((content, index) => renderElement(content, index, parentIndex))}
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity
								style={styles.cameraIconContainer}
								onPress={() => handleCameraButtonPress(parentIndex, element.content)}>
								<Image
									source={icons.camera}
									style={[styles.cameraIcon, isCameraVisible[parentIndex] && styles.cameraIconActive]}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => handleCameraButtonPress(parentIndex, element.content)}>
								<Image source={CameraAltIcon} style={styles.cameraAltIcon} />
							</TouchableOpacity>
						</View>
					</View>
				))}

				{isFullScreenCameraVisible && (
					<View style={StyleSheet.absoluteFillObject}>
						<Camera style={StyleSheet.absoluteFillObject} type={type} ref={cameraRef} flashMode={flash}>
							<View style={styles.cameraButtons}>
								{/* ... Dodaj przyciski i funkcje obsługujące zmianę typu aparatu i lampy błyskowej ... */}
							</View>
						</Camera>
						<View style={styles.fullScreenCameraButtons}>
							<Button title='Zrób zdjęcie' onPress={takeFullScreenPicture} style={styles.fullScreenCameraButton} />
						</View>
					</View>
				)}
				{!isFullScreenCameraVisible && ( // Dodaj warunek renderowania przycisku "Wyślij"
					<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
						<Text style={styles.submitButtonText}>WYŚLIJ</Text>
					</TouchableOpacity>
				)}
			</ScrollView>
		</View>
	)
}

export default Seven
