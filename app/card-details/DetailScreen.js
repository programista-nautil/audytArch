import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
	Text,
	View,
	Switch,
	Alert,
	StyleSheet,
	Image,
	BackHandler,
	ActivityIndicator,
	TouchableOpacity,
	SafeAreaView,
	Modal,
	FlatList,
} from 'react-native'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera'
import RNFetchBlob from 'rn-fetch-blob'
import GDrive from 'react-native-google-drive-api-wrapper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack, router } from 'expo-router'
import CommentInput from '../../components/home/common/CommentInput'
import * as ImageManipulator from 'expo-image-manipulator'
import { useOfflineQueue } from '../../hooks/useOfflineQueue' // <--- 1. IMPORT HOOKA
import { executeUpload, getSheetMetadata } from '../../services/googleSheets' // <--- 2. IMPORT SERWISU
import { uploadPhotoService } from '../../services/googleDrive'

const SAFE_MAX_ROW_LIMIT = 100

// Pobieranie danych konfiguracyjnych
const retrieveData = async () => {
	try {
		const photosFolderId = await AsyncStorage.getItem('@PhotosFolderId')
		const copiedTemplateId = await AsyncStorage.getItem('@CopiedTemplateId')
		const textId = await AsyncStorage.getItem('@SelectedTextId')
		const id = await AsyncStorage.getItem('@Id')
		if (photosFolderId && copiedTemplateId) {
			return { photosFolderId, copiedTemplateId, textId, id }
		}
	} catch (error) {
		console.error('Failed to retrieve the data from storage', error)
	}
}

const DetailScreen = () => {
	// --- HOOKI I STANY ---
	const { addToQueue, isOnline } = useOfflineQueue() // <--- 3. UŻYCIE HOOKA
	const navigation = useNavigation()
	const isFocused = useIsFocused()
	const route = useRoute()
	const { id, title } = route.params

	const [templateValuesState, setTemplateValuesState] = useState([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [sendCount, setSendCount] = useState(0)

	// Aparat i zdjęcia
	const [isCapturing, setIsCapturing] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [takenPhotos, setTakenPhotos] = useState({})
	const [capturedPhoto, setCapturedPhoto] = useState(null)
	const [isActive, setIsActive] = useState(false)
	const [isCameraReady, setIsCameraReady] = useState(false)
	const [selectedElementName, setSelectedElementName] = useState('')
	const [selectedElementIndex, setSelectedElementIndex] = useState(null)
	const { hasPermission, requestPermission } = useCameraPermission()
	const device = useCameraDevice('back')
	const cameraRef = useRef(null)

	// Formularz
	const [elements, setElements] = useState([])
	const [comments, setComments] = useState([])
	const [switchValuesContent, setSwitchValuesContent] = useState([])
	const [openSections, setOpenSections] = useState({})
	const [uploadStatuses, setUploadStatuses] = useState([])

	// --- EFEKTY (Licznik, BackHandler, Nawigacja) ---

	const getCountStorageKey = async () => {
		const folderId = await AsyncStorage.getItem('@PhotosFolderId')
		return `@SendCounts_${folderId}`
	}

	useEffect(() => {
		const loadSendCount = async () => {
			try {
				const storageKey = await getCountStorageKey()
				const storedData = await AsyncStorage.getItem(storageKey)
				if (storedData) {
					const counts = JSON.parse(storedData)
					setSendCount(counts[title] || 0)
				}
			} catch (error) {
				console.error('Błąd ładowania licznika:', error)
			}
		}
		if (isFocused) loadSendCount()
	}, [title, isFocused])

	useEffect(() => {
		const backAction = () => {
			Alert.alert('Potwierdzenie wyjścia', 'Czy na pewno chcesz wrócić? Niezapisane zmiany zostaną utracone.', [
				{ text: 'Anuluj', style: 'cancel' },
				{ text: 'Wyjdź', style: 'destructive', onPress: () => router.back() },
			])
			return true
		}
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
		return () => backHandler.remove()
	}, [])

	useEffect(() => {
		navigation.setOptions({
			headerTitle: title,
			headerTitleAlign: 'center',
			headerLeft: () => (
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<FontAwesome5
						name='arrow-left'
						size={24}
						color='#000'
						onPress={() => {
							Alert.alert('Potwierdzenie wyjścia', 'Czy na pewno chcesz wrócić do menu głównego?', [
								{ text: 'Nie', style: 'cancel' },
								{ text: 'Tak', onPress: () => navigation.goBack() },
							])
						}}
					/>
				</View>
			),
		})
	}, [navigation, title])

	// --- POBIERANIE DANYCH (SZABLON) ---

	async function fetchDataFromSheet(storageData, token) {
		const { copiedTemplateId: spreadsheetId } = storageData
		try {
			const response = await fetch(
				`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(title)}!A2:B`,
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			const result = await response.json()

			if (result.values && result.values.length > 0) {
				const groupedData = []
				let currentSection = null

				for (const row of result.values) {
					const idRaw = row[0] ? row[0].trim() : ''
					const text = row[1]
					if (idRaw === '/' || (!idRaw && !text)) break
					if (!idRaw || !text) continue

					const normalizedId = idRaw.replace(/\.$/, '')
					const hierarchyLevel = normalizedId.split('.').filter(part => part.trim() !== '').length
					const isSectionHeader = hierarchyLevel <= 2

					if (isSectionHeader) {
						currentSection = { name: `${idRaw} ${text} - `, content: [] }
						if (hierarchyLevel === 1) currentSection.content.push('Lokalizacja')
						groupedData.push(currentSection)
					} else if (currentSection) {
						currentSection.content.push(`${idRaw} ${text}`)
					}
				}
				return groupedData
			}
			return []
		} catch (error) {
			console.error('Error fetching data:', error)
			return []
		}
	}

	async function fetchTemplateWithBuffer(token, spreadsheetId) {
		try {
			const response = await fetch(
				`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(title)}!A1:P${SAFE_MAX_ROW_LIMIT}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			const result = await response.json()
			return result.values || []
		} catch (error) {
			return []
		}
	}

	function trimTemplateData(values) {
		if (!values || values.length === 0) return []
		let cutOffIndex = values.length
		for (let i = 0; i < values.length; i++) {
			if (values[i][0] === '/' || !values[i][0]) {
				cutOffIndex = i
				break
			}
		}
		return values.slice(0, cutOffIndex)
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const [tokens, storageData] = await Promise.all([GoogleSignin.getTokens(), retrieveData()])
				const accessToken = tokens.accessToken
				const [data, rawTemplateValues] = await Promise.all([
					fetchDataFromSheet(storageData, accessToken),
					fetchTemplateWithBuffer(accessToken, storageData.copiedTemplateId),
				])
				const trimmedTemplateValues = trimTemplateData(rawTemplateValues)

				setTemplateValuesState(trimmedTemplateValues)
				setElements(data)
				setComments(data.map(() => ''))
				setSwitchValuesContent(data.map(() => Array(10).fill(false))) // Zwiększony bufor
				setUploadStatuses(Array(data.length).fill(null))
			} catch (error) {
				console.error('Błąd init:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	// --- LOGIKA FORMULARZA ---

	function mergeTemplateWithData(template, userData) {
		const updatedTemplate = [...template]
		let rowIndex = 1
		userData.forEach((data, index) => {
			if (index === 0 && data.length > 2) data.splice(2, 1)
			const responses = data.slice(1)
			while (rowIndex < updatedTemplate.length && updatedTemplate[rowIndex][0].endsWith('-')) {
				rowIndex++
			}
			responses.forEach(response => {
				if (rowIndex >= updatedTemplate.length) return
				let status = '',
					comment = ''
				const firstCommaIndex = response.indexOf(',')
				if (firstCommaIndex !== -1) {
					status = response.substring(0, firstCommaIndex).trim()
					comment = response.substring(firstCommaIndex + 1).trim()
				} else {
					status = response.trim()
				}
				updatedTemplate[rowIndex][2] = status || ''
				updatedTemplate[rowIndex][3] = comment || ''
				rowIndex++
			})
		})
		return updatedTemplate
	}

	const handleToggle = index => {
		setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))
	}

	const handleCommentChange = (index, contentIndex, text) => {
		setComments(prev => {
			const updated = [...prev]
			if (!updated[index]) updated[index] = {}
			updated[index][contentIndex] = text
			return updated
		})
	}

	const handleSwitchContent = (index, contentIndex, value) => {
		setSwitchValuesContent(prev => {
			const newState = [...prev]
			if (!newState[index]) newState[index] = []
			newState[index][contentIndex] = value
			return newState
		})
	}

	const resetForm = () => {
		setOpenSections({})
		setSwitchValuesContent(elements.map(() => Array(10).fill(false)))
		setComments(elements.map(() => ({})))
		setUploadStatuses(Array(elements.length).fill(null))
		setTakenPhotos({})
		console.log('Formularz wyczyszczony')
	}

	// --- WYSYŁANIE (HANDLESUBMIT) ---

	const handleSubmit = async () => {
		if (isSubmitting) return
		setIsSubmitting(true)

		// 1. Definiujemy payload NA SAMYM POCZĄTKU, żeby był dostępny w catch
		let payload = null

		try {
			const storageData = await retrieveData()
			const spreadsheetId = storageData.copiedTemplateId
			const accessToken = (await GoogleSignin.getTokens()).accessToken

			// 2. Budowanie danych (to nie wymaga internetu)
			const valuesToSheet = elements.map((element, index) => {
				let row = [element.name, openSections[index] ? 'Tak' : 'Nie']
				element.content.forEach((content, contentIndex) => {
					const state = switchValuesContent[index]?.[contentIndex] || 'Nie dotyczy'
					const comment = comments[index]?.[contentIndex] || ''
					row.push(comment.trim() !== '' ? `${state}, ${comment}` : state)
				})
				return row
			})

			const finalData = mergeTemplateWithData(templateValuesState, valuesToSheet)
			finalData.unshift(['/'])

			// 3. Tworzymy payload BEZ sheetId (na razie)
			payload = {
				spreadsheetId,
				sheetName: title,
				finalData,
				templateCount: templateValuesState.length,
				sheetId: null, // <--- Ważne: domyślnie null
			}

			// 4. Sprawdzamy tryb samolotowy (NetInfo)
			if (!isOnline) {
				throw new Error('OfflineMode') // Wyrzucamy błąd, żeby wpaść do catch
			}

			// 5. Jeśli jesteśmy online, próbujemy pobrać ID i wysłać
			// Jeśli to zawiedzie (np. "Network request failed"), payload już istnieje!
			const meta = await getSheetMetadata(spreadsheetId, accessToken, title)
			payload.sheetId = meta.sheetId // Uzupełniamy ID jeśli się udało

			console.log('Wysyłanie online...')
			await executeUpload(payload, accessToken)

			// Sukces Online
			const storageKey = await getCountStorageKey()
			const storedData = await AsyncStorage.getItem(storageKey)
			let counts = storedData ? JSON.parse(storedData) : {}
			counts[title] = (counts[title] || 0) + 1
			await AsyncStorage.setItem(storageKey, JSON.stringify(counts))
			setSendCount(counts[title])

			Alert.alert('Sukces', 'Dane zostały wysłane pomyślnie!')
			resetForm()
		} catch (error) {
			console.log('Obsługa błędu wysyłki:', error.message)

			// 6. Logika ratunkowa
			// Teraz payload na pewno istnieje (chyba że błąd był w retrieveData, ale to rzadkość)
			const isNetworkError =
				error.message.includes('Network request failed') ||
				error.message === 'OfflineMode' ||
				error.message.includes('Internet')

			if (payload && isNetworkError) {
				console.log('Dodawanie do kolejki offline...')
				await addToQueue(payload)
				Alert.alert('Tryb Offline', 'Brak połączenia z serwerem. Audyt zapisano w kolejce do wysłania później.')
				resetForm()
			} else {
				// Inne błędy (np. błąd kodu, brak uprawnień)
				Alert.alert('Błąd', 'Wystąpił problem: ' + error.message)
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	// --- APARAT I ZDJĘCIA (BEZ ZMIAN W LOGICE, TYLKO UPORZĄDKOWANIE) ---

	useEffect(() => {
		requestPermission()
	}, [hasPermission])

	const onTakePicturePressed = async () => {
		if (cameraRef.current && !isCapturing) {
			setIsCapturing(true)
			try {
				const photo = await cameraRef.current.takePhoto()
				setCapturedPhoto(photo)
			} catch (error) {
				Alert.alert('Błąd', 'Nie udało się zrobić zdjęcia.')
			} finally {
				setIsCapturing(false)
			}
		}
	}

	const compressImage = async uri => {
		try {
			const manipResult = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1600 } }], {
				compress: 0.7,
				format: ImageManipulator.SaveFormat.JPEG,
			})
			return manipResult.uri
		} catch (error) {
			return uri
		}
	}

	const handleUsePhoto = async () => {
		if (!capturedPhoto) return

		// Ustawiamy status na "w trakcie" (spinner)
		setIsUploading(true)
		setTakenPhotos(prev => ({ ...prev, [selectedElementIndex]: capturedPhoto }))

		let payload = null

		try {
			// 1. Kompresja (robimy to zawsze, żeby plik w cache był gotowy)
			const photoUri = `file://${capturedPhoto.path}`
			const compressedUri = await compressImage(photoUri)
			const folderId = await AsyncStorage.getItem('@PhotosFolderId')

			// 2. Przygotowanie Payloadu
			payload = {
				type: 'photo', // <--- KLUCZOWE ROZRÓŻNIENIE
				uri: compressedUri,
				name: selectedElementName,
				folderId: folderId,
			}

			// 3. Sprawdzenie sieci
			if (!isOnline) {
				console.log('Offline: Kolejkowanie zdjęcia...')
				await addToQueue(payload)

				// Ustawiamy status na "queued" (nowy stan)
				setUploadStatuses(prev => {
					const n = [...prev]
					n[selectedElementIndex] = 'queued'
					return n
				})
				setIsActive(false) // Zamykamy aparat
				Alert.alert('Offline', 'Zdjęcie dodano do kolejki synchronizacji.')
				return
			}

			// 4. Wysyłka Online
			const token = (await GoogleSignin.getTokens()).accessToken
			await uploadPhotoService(token, payload.uri, payload.folderId, payload.name)

			// Sukces
			setUploadStatuses(prev => {
				const n = [...prev]
				n[selectedElementIndex] = 'success'
				return n
			})
			setIsActive(false)
		} catch (error) {
			console.error('Błąd zdjęcia:', error)

			// Ratowanie do kolejki w przypadku błędu sieci
			if (payload && (error.message.includes('Network') || !isOnline)) {
				await addToQueue(payload)
				setUploadStatuses(prev => {
					const n = [...prev]
					n[selectedElementIndex] = 'queued'
					return n
				})
				Alert.alert('Offline', 'Problem z siecią. Zdjęcie trafiło do kolejki.')
				setIsActive(false)
			} else {
				setUploadStatuses(prev => {
					const n = [...prev]
					n[selectedElementIndex] = 'error'
					return n
				})
				Alert.alert('Błąd', 'Nie udało się zapisać zdjęcia.')
			}
		} finally {
			setIsUploading(false)
			setCapturedPhoto(null)
		}
	}

	// --- RENDER ---

	const renderItem = useCallback(
		({ item: element, index }) => {
			return (
				<View className='bg-white my-2 rounded-xl shadow-sm overflow-hidden mx-2'>
					<View className='p-4 flex-row justify-between items-center'>
						<Text className='text-lg font-bold text-gray-800 flex-1 pr-4'>{element.name}</Text>
						<Switch
							trackColor={{ false: '#E5E7EB', true: '#81b0ff' }}
							thumbColor={openSections[index] ? '#3B82F6' : '#f4f3f4'}
							onValueChange={() => handleToggle(index)}
							value={!!openSections[index]}
						/>
					</View>
					{openSections[index] && (
						<View>
							{element.content.map((content, contentIndex) => (
								<View key={contentIndex} className='bg-gray-50 p-4 border-t border-gray-200'>
									<Text className='text-base text-gray-700 mb-4'>{content}</Text>
									<View className='flex-row flex-wrap gap-2 mb-4'>
										{['Tak', 'Nie', 'Nie dotyczy'].map(value => (
											<TouchableOpacity
												key={value}
												onPress={() => handleSwitchContent(index, contentIndex, value)}
												className={`px-3 py-2 rounded-full border ${switchValuesContent[index]?.[contentIndex] === value ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
												<Text
													className={`font-semibold ${switchValuesContent[index]?.[contentIndex] === value ? 'text-white' : 'text-gray-700'}`}>
													{value}
												</Text>
											</TouchableOpacity>
										))}
									</View>
									<CommentInput
										placeholder='Dodaj uwagi...'
										value={comments[index]?.[contentIndex] || ''}
										onChangeText={text => handleCommentChange(index, contentIndex, text)}
										aiContext={`- Kat: ${title}\n- Podkat: ${element.name}\n- Kryt: ${content}`}
										photo={takenPhotos[index]}
									/>
								</View>
							))}
							<View className='p-4 border-t border-gray-200'>
								<TouchableOpacity
									onPress={() => {
										let com = comments[index]?.[0] || ''
										setSelectedElementName(element.name + com)
										setSelectedElementIndex(index)
										setIsActive(true)
									}}
									className='flex-row items-center justify-center bg-gray-200 active:bg-gray-300 rounded-lg p-3'>
									<Feather name='camera' size={20} color='#4B5563' />
									<Text className='text-gray-700 font-semibold ml-3'>Zrób zdjęcie</Text>
								</TouchableOpacity>
								{uploadStatuses[index] && (
									<View
										className={`mt-2 p-2 rounded-md flex-row items-center ${
											uploadStatuses[index] === 'success'
												? 'bg-green-100'
												: uploadStatuses[index] === 'queued'
													? 'bg-yellow-100'
													: 'bg-red-100' // <--- Obsługa żółtego koloru
										}`}>
										<Feather
											name={
												uploadStatuses[index] === 'success'
													? 'check-circle'
													: uploadStatuses[index] === 'queued'
														? 'clock'
														: 'x-circle' // <--- Ikona zegara
											}
											size={16}
											color={
												uploadStatuses[index] === 'success'
													? '#16A34A'
													: uploadStatuses[index] === 'queued'
														? '#D97706'
														: '#DC2626'
											}
										/>
										<Text
											className={`ml-2 font-medium ${
												uploadStatuses[index] === 'success'
													? 'text-green-800'
													: uploadStatuses[index] === 'queued'
														? 'text-yellow-800'
														: 'text-red-800'
											}`}>
											{uploadStatuses[index] === 'success'
												? 'Zdjęcie wysłane'
												: uploadStatuses[index] === 'queued'
													? 'Oczekuje na wysyłkę'
													: 'Błąd wysyłania'}
										</Text>
									</View>
								)}
							</View>
						</View>
					)}
				</View>
			)
		},
		[openSections, switchValuesContent, comments, uploadStatuses, takenPhotos]
	)

	if (isLoading) {
		return (
			<SafeAreaView className='flex-1 justify-center items-center bg-gray-100'>
				<ActivityIndicator size='large' color='#3B82F6' />
				<Text className='mt-4 text-lg text-gray-600'>Wczytywanie audytu...</Text>
			</SafeAreaView>
		)
	}

	return (
		<SafeAreaView className='flex-1 bg-gray-100'>
			<Stack.Screen options={{ headerTitle: title, headerTitleAlign: 'center' }} />
			<FlatList
				data={elements}
				keyExtractor={(item, index) => index.toString()}
				renderItem={renderItem}
				contentContainerStyle={{ padding: 8 }}
				ListFooterComponent={
					<View className='p-5 pb-20'>
						<TouchableOpacity
							onPress={handleSubmit}
							disabled={isSubmitting}
							className={`h-14 rounded-full flex-row items-center justify-center shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600'}`}>
							{isSubmitting ? (
								<ActivityIndicator color='white' />
							) : (
								<>
									<Feather name='send' size={20} color='white' />
									<Text className='text-white text-lg font-bold ml-3'>WYŚLIJ</Text>
								</>
							)}
						</TouchableOpacity>
						<View className='items-center mt-10 mb-20'>
							<Text className='text-gray-700 font-semibold'>
								{sendCount > 0 ? `Wysłano danych: ${sendCount}` : 'Nie wysłano jeszcze danych'}
							</Text>
						</View>
					</View>
				}
			/>

			{/* MODAL APARATU */}
			<Modal visible={isActive} onRequestClose={() => setIsActive(false)} animationType='slide'>
				{device == null ? (
					<View className='flex-1 justify-center items-center bg-black'>
						<Text className='text-white'>Brak aparatu</Text>
					</View>
				) : (
					<View className='flex-1 bg-black'>
						{!capturedPhoto ? (
							<>
								<Camera
									ref={cameraRef}
									style={StyleSheet.absoluteFill}
									device={device}
									photo={true}
									isActive={isFocused && isActive}
									onInitialized={() => setIsCameraReady(true)}
									resizeMode='contain'
								/>
								<TouchableOpacity
									onPress={() => setIsActive(false)}
									className='absolute top-12 left-5 bg-black/50 p-3 rounded-full'>
									<Feather name='x' size={24} color='white' />
								</TouchableOpacity>
								<View className='absolute bottom-10 w-full items-center'>
									<TouchableOpacity
										onPress={onTakePicturePressed}
										disabled={isCapturing}
										className='w-20 h-20 bg-white/80 rounded-full border-4 border-white justify-center items-center'>
										{isCapturing ? (
											<ActivityIndicator color='#000' />
										) : (
											<Feather name='camera' size={40} color='#333' />
										)}
									</TouchableOpacity>
								</View>
							</>
						) : (
							<View className='flex-1'>
								<Image
									source={{ uri: `file://${capturedPhoto.path}` }}
									style={StyleSheet.absoluteFill}
									resizeMode='contain'
								/>
								<View className='absolute bottom-10 w-full flex-row justify-around items-center'>
									<TouchableOpacity
										onPress={() => setCapturedPhoto(null)}
										disabled={isUploading}
										className='items-center'>
										<View className='h-16 w-16 bg-black/40 rounded-full justify-center items-center'>
											<Feather name='x' size={32} color='white' />
										</View>
										<Text className='text-white font-bold mt-2'>Powtórz</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={handleUsePhoto} disabled={isUploading} className='items-center'>
										<View className='h-16 w-16 bg-black/40 rounded-full justify-center items-center'>
											<Feather name='check' size={32} color='white' />
										</View>
										<Text className='text-white font-bold mt-2'>Użyj</Text>
									</TouchableOpacity>
								</View>
								{isUploading && (
									<View
										style={[
											StyleSheet.absoluteFill,
											{ backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
										]}>
										<ActivityIndicator size='large' color='white' />
										<Text className='text-white mt-2'>Wysyłanie...</Text>
									</View>
								)}
							</View>
						)}
					</View>
				)}
			</Modal>
		</SafeAreaView>
	)
}

export default DetailScreen
