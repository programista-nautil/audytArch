import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
	ScrollView,
	Text,
	View,
	Switch,
	Alert,
	StyleSheet,
	Pressable,
	Image,
	BackHandler,
	ActivityIndicator,
	TouchableOpacity,
	TextInput as NativeTextInput,
	SafeAreaView,
	Modal,
	FlatList,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute, useIsFocused, useFocusEffect } from '@react-navigation/native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { FontAwesome5 } from '@expo/vector-icons'
import { useCameraPermission, useCameraDevice, Camera, PhotoFile } from 'react-native-vision-camera'
import RNFetchBlob from 'rn-fetch-blob'
import GDrive from 'react-native-google-drive-api-wrapper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import CommentInput from '../../components/home/common/CommentInput'
import * as ImageManipulator from 'expo-image-manipulator'

const SAFE_MAX_ROW_LIMIT = 100

//odbieranie danych z AsyncStorage - szablon arkusza i folder zdjęć
const retrieveData = async () => {
	try {
		const photosFolderId = await AsyncStorage.getItem('@PhotosFolderId')
		const copiedTemplateId = await AsyncStorage.getItem('@CopiedTemplateId')
		const textId = await AsyncStorage.getItem('@SelectedTextId')
		const id = await AsyncStorage.getItem('@Id')
		if (photosFolderId !== null && copiedTemplateId !== null && textId !== null) {
			// Use the retrieved data as needed
			return { photosFolderId, copiedTemplateId, textId, id }
		}
		console.log({ id, title })
	} catch (error) {
		console.error('Failed to retrieve the data from storage', error)
	}
}

const DetailScreen = () => {
	const [templateValuesState, setTemplateValuesState] = useState([])
	const navigation = useNavigation()
	const isFocused = useIsFocused()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isCapturing, setIsCapturing] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	const [sendCount, setSendCount] = useState(0)

	const route = useRoute()
	const { id, title } = route.params

	const [currentId_textid, setCurrentId_textid] = useState('')

	const [takenPhotos, setTakenPhotos] = useState({})

	const getCountStorageKey = async () => {
		const id = await AsyncStorage.getItem('@Id') // ID szablonu/audytu
		const folderId = await AsyncStorage.getItem('@PhotosFolderId') // Lub inny unikalny ID audytu
		// Używamy folderId jako unikalnego identyfikatora konkretnego audytu (bo ID szablonu jest wspólne dla wielu audytów tego typu)
		return `@SendCounts_${folderId}`
	}

	useEffect(() => {
		const loadSendCount = async () => {
			try {
				const storageKey = await getCountStorageKey()
				const storedData = await AsyncStorage.getItem(storageKey)

				setSendCount(0)

				if (storedData) {
					const counts = JSON.parse(storedData)
					if (counts[title]) {
						setSendCount(counts[title])
					} else {
						setSendCount(0)
					}
				}
			} catch (error) {
				console.error('Błąd ładowania licznika:', error)
			}
		}

		loadSendCount()
	}, [title, isFocused])

	useEffect(() => {
		const fetchId = async () => {
			const data = await retrieveData()
			setCurrentId_textid(data.textId) // Use a default empty string if textId is not available
			console.log('Current ID:', data.textId)
		}

		if (isFocused) {
			fetchId()
		}
	}, [isFocused])

	const SHEET_ID = title

	async function fetchDataFromSheet(storageData, token) {
		const { copiedTemplateId: spreadsheetId } = storageData

		try {
			// Pobieramy kolumny A (Lp.) i B (Kategoria/kryterium)
			const response = await fetch(
				`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(SHEET_ID)}!A2:B`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			const result = await response.json()

			if (result.values && result.values.length > 0) {
				const groupedData = []
				let currentSection = null

				for (const row of result.values) {
					const idRaw = row[0] ? row[0].trim() : ''
					const text = row[1]

					// Sprawdzenie końca tabeli
					if (idRaw === '/' || (!idRaw && !text)) {
						console.log('Koniec szablonu (napotkano separator lub pusty wiersz).')
						break
					}

					if (!idRaw || !text) continue

					// --- NOWA LOGIKA ZABEZPIECZAJĄCA ---

					// 1. Normalizacja: Usuń kropkę z końca, jeśli tam jest (zamienia "2.1." na "2.1")
					const normalizedId = idRaw.replace(/\.$/, '')

					// 2. Podział na części: Dzielimy po kropce i filtrujemy puste (na wypadek literówek typu "2..1")
					// Przykład: "2.1.14" -> ["2", "1", "14"] -> hierarchyLevel = 3
					// Przykład: "2.1"    -> ["2", "1"]       -> hierarchyLevel = 2
					const hierarchyParts = normalizedId.split('.').filter(part => part.trim() !== '')
					const hierarchyLevel = hierarchyParts.length

					// 3. Decyzja na podstawie poziomu zagłębienia
					// Zakładamy, że Sekcje to poziom 1 (np. "1.") i poziom 2 (np. "1.1")
					// Wszystko głębiej (poziom 3, 4...) to pytania/kryteria
					const isSectionHeader = hierarchyLevel <= 2

					if (isSectionHeader) {
						// To jest nagłówek (np. "1. Otoczenie" lub "1.1 Ciągi")
						currentSection = {
							name: `${idRaw} ${text} - `, // Używamy oryginalnego idRaw do wyświetlania
							content: [],
						}

						// Dodaj "Lokalizacja" tylko dla głównych kategorii (Poziom 1, np. "1.", "2.")
						if (hierarchyLevel === 1) {
							currentSection.content.push('Lokalizacja')
						}

						groupedData.push(currentSection)
					} else if (currentSection) {
						// To jest pytanie/kryterium (np. "1.1.1", "1.1.14", "2.1.3")
						currentSection.content.push(`${idRaw} ${text}`)
					}
				}
				return groupedData
			} else {
				console.log('No data found in Main Template.')
				return []
			}
		} catch (error) {
			console.error('Error fetching data from sheet:', error)
			return []
		}
	}

	//pobieranie szablonu tabeli do uzupełnienia
	async function fetchTemplateWithBuffer(token, spreadsheetId) {
		try {
			const response = await fetch(
				`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(SHEET_ID)}!A1:P${SAFE_MAX_ROW_LIMIT}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			const result = await response.json()
			return result.values || []
		} catch (error) {
			console.error('Błąd podczas pobierania szablonu:', error)
			return []
		}
	}

	function trimTemplateData(values) {
		if (!values || values.length === 0) return []

		let cutOffIndex = values.length

		// Logika szukania końca danych
		for (let i = 0; i < values.length; i++) {
			const firstCell = values[i][0]

			if (firstCell === '/') {
				cutOffIndex = i
				break
			}

			if (!firstCell) {
				cutOffIndex = i
				break
			}
		}

		// Zwracamy przyciętą tablicę
		return values.slice(0, cutOffIndex)
	}

	function mergeTemplateWithData(template, userData) {
		if (!template || !userData) {
			console.error('Invalid input: template or userData is undefined')
			return []
		}

		// Zacznij od kopii szablonu, aby uniknąć modyfikacji oryginału
		const updatedTemplate = [...template]

		let rowIndex = 1 // Zaczynamy od pierwszego wiersza danych (pomijamy nagłówki)

		userData.forEach((data, index) => {
			if (index === 0 && data.length > 2) {
				data.splice(2, 1) // usuwa trzeci element (czyli drugą odpowiedź)
			}
			const sectionTitle = data[0] // Nazwa sekcji
			const responses = data.slice(1) // Odpowiedzi użytkownika

			// Sprawdzenie, czy bieżący wiersz to nagłówek sekcji
			while (rowIndex < updatedTemplate.length && updatedTemplate[rowIndex][0].endsWith('-')) {
				rowIndex++ // Pomijamy nagłówki sekcji
			}

			responses.forEach((response, colIndex) => {
				if (rowIndex >= updatedTemplate.length) {
					return // Unikaj przepełnienia tablicy
				}

				let status = ''
				let comment = ''

				const firstCommaIndex = response.indexOf(',')

				if (firstCommaIndex !== -1) {
					status = response.substring(0, firstCommaIndex).trim()
					comment = response.substring(firstCommaIndex + 1).trim()
				} else {
					status = response.trim()
				}

				updatedTemplate[rowIndex][2] = status || '' // Wymagania spełnione
				updatedTemplate[rowIndex][3] = comment || '' // Ocena stanu istniejącego

				rowIndex++ // Przejdź do następnego wiersza
			})
		})

		return updatedTemplate
	}

	// Fetch the template before sending the data
	const [elements, setElements] = useState([])
	const [comments, setComments] = useState(Array(elements.length).fill(''))
	const [comment, setComment] = useState('') // New state variable for comment
	const [commentIndex, setCommentIndex] = useState(null) // New state variable for comment index
	const [switchValues, setSwitchValues] = useState(Array(elements.length).fill(false))
	const [switchValuesContent, setSwitchValuesContent] = useState(
		Array(elements.length)
			.fill(null)
			.map(_ => Array(3).fill(false))
	)
	const [openSections, setOpenSections] = useState({})
	const [uploadStatuses, setUploadStatuses] = useState(Array(elements.length).fill(null))
	const [capturedPhoto, setCapturedPhoto] = useState(null)

	useEffect(() => {
		navigation.setOptions({
			headerTitle: title,
			headerTitleAlign: 'center',
			headerTitleStyle: {
				fontSize: 20,
				fontWeight: 'bold',
				color: '#000',
			},
			headerStyle: {
				backgroundColor: '#fff',
				height: 100,
			},
			headerTintColor: '#000',
			headerLeft: () => (
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<FontAwesome5
						name='arrow-left'
						size={24}
						color='#000'
						onPress={() => {
							Alert.alert(
								'Potwierdzenie wyjścia',
								'Czy na pewno chcesz wrócić do menu głównego? Stracisz wszystkie zaznaczone opcje i przyciski.',
								[
									{ text: 'Nie', style: 'cancel' },
									{ text: 'Tak', onPress: () => navigation.goBack() },
								]
							)
						}}
					/>
					<Text style={{ paddingRight: 10 }}></Text>
				</View>
			),
		})
	}, [navigation, title])

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

	const getSheetMetadataEffect = async () => {
		const spreadsheetId = (await retrieveData()).copiedTemplateId // Twoje ID arkusza
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties)`
		const tokens = await GoogleSignin.getTokens()
		const accessToken = tokens.accessToken

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (!response.ok) {
				console.error('HTTP Error:', response.status, await response.text())
				throw new Error('Failed to fetch sheet metadata.')
			}

			const data = await response.json()

			// Processing response to find the sheetId
			const sheets = data.sheets
			if (!sheets || sheets.length === 0) {
				console.error('No sheets found in the received data.')
				return null
			}

			const targetSheet = sheets.find(sheet => sheet.properties.title === title)
			if (!targetSheet) {
				console.error(`Sheet titled ${title}  not found.`)
				return null
			}

			const sheetId = targetSheet.properties.sheetId
			const sheetName = targetSheet.properties.title
			return { sheetId, sheetName, spreadsheetId }
		} catch (error) {
			console.error('Error fetching sheet metadata:', error)
			return null
		}
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

				console.log('Pobrane wiersze (surowe):', rawTemplateValues.length)
				console.log('Pobrane wiersze (przycięte):', trimmedTemplateValues.length)

				setTemplateValuesState(trimmedTemplateValues)
				setElements(data)
				setComments(data.map(() => ''))
				setSwitchValues(data.map(() => false))
				setSwitchValuesContent(data.map(() => Array(3).fill(false)))
			} catch (error) {
				console.error('Błąd podczas pobierania danych:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleToggle = index => {
		setOpenSections(prevState => ({
			...prevState,
			[index]: !prevState[index],
		}))
	}

	const handleCommentChange = (index, contentIndex, text) => {
		setComments(prevState => {
			const updatedComments = [...prevState]
			if (!updatedComments[index]) {
				updatedComments[index] = {}
			}
			updatedComments[index][contentIndex] = text
			return updatedComments
		})
	}

	const handleSwitchContent = (index, contentIndex, value) => {
		setSwitchValuesContent(prevState => {
			const newState = [...prevState]
			newState[index][contentIndex] = value
			return newState
		})
		setCommentIndex(contentIndex) // Store the current content index for comments
	}

	async function checkAndRemoveExcessRecords(
		spreadsheetId,
		sheetName,
		accessToken,
		rowCountBeforeAdding,
		templateRowCount
	) {
		try {
			const getSheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:Z`

			// Pobierz wszystkie dane z arkusza
			const response = await fetch(getSheetDataUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			const result = await response.json()
			const sheetData = result.values

			if (!response.ok || !sheetData) {
				console.error('Błąd podczas pobierania danych z arkusza:', result.error)
				return
			}

			const currentRowCount = sheetData.length // Liczba wierszy w arkuszu po dodaniu
			console.log(`Obecna liczba wierszy: ${currentRowCount}`)

			// Poprawna liczba wierszy: wiersze przed dodaniem + długość szablonu + wiersz "\"
			const validRowCount = rowCountBeforeAdding + templateRowCount + 1
			console.log(`Poprawna liczba wierszy: ${validRowCount}`)

			// Sprawdzenie, czy jest więcej wierszy niż poprawna liczba
			if (currentRowCount > validRowCount) {
				console.log(`Nadmiarowe rekordy: ${currentRowCount - validRowCount}`)
				const deleteRequests = {
					requests: [
						{
							deleteDimension: {
								range: {
									sheetId: await getSheetId(spreadsheetId, sheetName, accessToken),
									dimension: 'ROWS',
									startIndex: validRowCount, // Usuń wiersze zaczynające się od indeksu poprawnej liczby
									endIndex: currentRowCount, // Usuń aż do końca
								},
							},
						},
					],
				}

				const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`

				const deleteResponse = await fetch(batchUpdateUrl, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(deleteRequests),
				})

				if (!deleteResponse.ok) {
					console.error('Błąd podczas usuwania nadmiarowych rekordów:', await deleteResponse.text())
				} else {
					console.log('Nadmiarowe rekordy zostały usunięte.')
				}
			} else {
				console.log('Liczba rekordów jest zgodna z szablonem.')
			}
		} catch (error) {
			console.error('Błąd podczas sprawdzania nadmiarowych rekordów:', error)
		}
	}

	// Pomocnicza funkcja: Pobierz ID arkusza (sheetId)
	async function getSheetId(spreadsheetId, sheetName, accessToken) {
		const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties)`

		try {
			const response = await fetch(metadataUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			const metadata = await response.json()
			if (!response.ok || !metadata.sheets) {
				throw new Error('Nie udało się pobrać metadanych arkusza.')
			}

			const sheet = metadata.sheets.find(sheet => sheet.properties.title === sheetName)
			return sheet.properties.sheetId
		} catch (error) {
			console.error('Błąd podczas pobierania ID arkusza:', error)
			throw error
		}
	}

	async function getRowCountBeforeAdding(spreadsheetId, sheetName, accessToken) {
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:A`

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			const result = await response.json()

			if (response.ok) {
				return result.values ? result.values.length : 0
			} else {
				console.error('Błąd podczas pobierania liczby wierszy:', result.error)
				return 0
			}
		} catch (error) {
			console.error('Błąd podczas pobierania liczby wierszy:', error)
			return 0
		}
	}

	const getSheetMetadata = async (spreadsheetId, accessToken, title) => {
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties)`
		const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
		const data = await response.json()

		const targetSheet = data.sheets?.find(sheet => sheet.properties.title === title)
		if (!targetSheet) throw new Error(`Arkusz ${title} nie został znaleziony.`)

		return {
			sheetId: targetSheet.properties.sheetId,
			sheetName: targetSheet.properties.title,
		}
	}

	// OPTYMALIZACJA: Szybsze sprawdzanie ostatniego wiersza
	const getLastRowIndex = async (spreadsheetId, sheetName, accessToken) => {
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:A?fields=values`
		const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
		const result = await response.json()
		return result.values ? result.values.length : 0
	}

	const handleSubmit = async () => {
		if (isSubmitting) return
		setIsSubmitting(true)

		try {
			const tokens = await GoogleSignin.getTokens()
			const accessToken = tokens.accessToken
			const storageData = await retrieveData()
			const spreadsheetId = storageData.copiedTemplateId

			// 1. Przygotowanie danych (Twoja istniejąca logika)
			const updatedElements = elements.map((element, index) => {
				const updatedContent = element.content.map((text, contentIndex) => ({
					text,
					state: switchValuesContent[index][contentIndex] || 'Nie dotyczy',
					comment: comments[index]?.[contentIndex] || '',
				}))
				return { ...element, content: updatedContent }
			})

			const valuesToSheet = updatedElements.map(element => {
				let row = [element.name, openSections[updatedElements.indexOf(element)] ? 'Tak' : 'Nie']
				element.content.forEach(content => {
					let val = content.state + (content.comment ? `, ${content.comment}` : '')
					row.push(val)
				})
				return row
			})

			// Usunięcie nadmiarowego elementu z pierwszego wiersza (Twoja logika)
			if (valuesToSheet.length > 0 && valuesToSheet[0].length > 2) {
				valuesToSheet[0].splice(2, 1)
			}

			// 2. Pobieranie metadanych równolegle dla szybkości
			const [meta, lastRow] = await Promise.all([
				getSheetMetadata(spreadsheetId, accessToken, title),
				getLastRowIndex(spreadsheetId, title, accessToken),
			])

			// Łączymy dane z szablonem
			const finalDataToAppend = mergeTemplateWithData(templateValuesState, valuesToSheet)
			finalDataToAppend.unshift(['/']) // Separator

			// 3. Wysłanie danych
			const appendRange = `${title}!A${lastRow + 1}`
			const appendResponse = await fetch(
				`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED`,
				{
					method: 'POST',
					headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
					body: JSON.stringify({ values: finalDataToAppend }),
				}
			)

			if (!appendResponse.ok) throw new Error('Błąd podczas appendData')

			// 4. OPTYMALIZACJA: Kopiowanie stylów JEDNYM żądaniem bez pobierania GridData
			// Obliczamy zakresy:
			// Źródło stylów: A2:Z(liczba_wierszy_szablonu + 1)
			// Cel: od miejsca gdzie właśnie dodaliśmy dane
			await fastCopyStyles(
				spreadsheetId,
				meta.sheetId,
				templateValuesState.length,
				lastRow + 1, // +1 bo dodaliśmy '/'
				accessToken
			)

			// 5. Aktualizacja liczników
			const storageKey = await getCountStorageKey()
			const storedData = await AsyncStorage.getItem(storageKey)
			let counts = storedData ? JSON.parse(storedData) : {}
			counts[title] = (counts[title] || 0) + 1
			await AsyncStorage.setItem(storageKey, JSON.stringify(counts))

			setSendCount(counts[title])
			Alert.alert('Sukces', 'Dane zostały zapisane.')
		} catch (error) {
			console.error('Błąd zapisu:', error)
			Alert.alert('Błąd', 'Nie udało się zapisać danych.')
		} finally {
			setIsSubmitting(false)
		}
	}

	async function fastCopyStyles(spreadsheetId, sheetId, templateRowCount, startRowIndex, accessToken) {
		const requests = [
			// Kopiowanie Nagłówka (Wiersz 1 z obrazkiem/logo)
			{
				copyPaste: {
					source: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 20 },
					destination: { sheetId, startRowIndex: startRowIndex, endRowIndex: startRowIndex + 1 },
					pasteType: 'PASTE_NORMAL',
				},
			},
			// Kopiowanie Formatowania dla całej reszty wierszy
			{
				copyPaste: {
					source: {
						sheetId,
						startRowIndex: 1,
						endRowIndex: templateRowCount + 1,
						startColumnIndex: 0,
						endColumnIndex: 20,
					},
					destination: {
						sheetId,
						startRowIndex: startRowIndex + 1,
						endRowIndex: startRowIndex + 1 + templateRowCount,
					},
					pasteType: 'PASTE_FORMAT', // Kopiuje tylko kolory, obramowania, walidację danych
				},
			},
		]

		await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ requests }),
		})
	}

	async function appendData(spreadsheetId, sheetName, values, accessToken) {
		const getRowCountUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:A`
		try {
			// Pobierz wszystkie dane z kolumny A, aby ustalić liczbę wierszy z danymi
			const rowCountResponse = await fetch(getRowCountUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			const rowCountResult = await rowCountResponse.json()
			let lastRowWithData = 0 // Indeks ostatniego wiersza z danymi

			if (rowCountResponse.ok) {
				if (rowCountResult.values) {
					// Znajdź indeks ostatniego niepustego wiersza
					for (let i = rowCountResult.values.length - 1; i >= 0; i--) {
						if (rowCountResult.values[i][0] !== '' && rowCountResult.values[i][0] != null) {
							lastRowWithData = i + 1 // Tablice są indeksowane od 0, ale wiersze w Sheets od 1
							break
						}
					}
				}
			} else {
				console.error('Nie można pobrać liczby wierszy:', rowCountResult.error)
				Alert.alert('Błąd', 'Problem z pobraniem liczby wierszy.')
				return
			}

			// Start appending data two rows after the last row with data
			const startRow = lastRowWithData + 1 // Wstawiamy bez pustych wierszy
			if (values.length > 0 && values[0].length > 2) {
				values[0].splice(2, 1) // usuwa trzeci element (czyli drugą odpowiedź)
			}
			// Przygotowujemy dane do wstawienia znaku '/'
			values.unshift(['/']) // Dodajemy wiersz ze znakiem '/' przed nowymi danymi
			const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A${startRow}:A:append?valueInputOption=USER_ENTERED`
			const appendResponse = await fetch(appendUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ values: values }),
			})

			if (!appendResponse.ok) {
				const errorDetails = await appendResponse.text()
				throw new Error(
					`Błąd podczas wysyłania danych: ${appendResponse.status} ${appendResponse.statusText} - ${errorDetails}`
				)
			}
		} catch (error) {
			console.error('Błąd:', error)
			Alert.alert('Błąd', `Wystąpił problem podczas wysyłania danych: ${error.message}`)
		}
	}

	// Adjust copyStylesAndData to match new data insertion points
	async function copyFirstRow(spreadsheetId, sheetId, sourceRange, destinationRange, accessToken) {
		const requests = [
			{
				copyPaste: {
					source: sourceRange,
					destination: destinationRange,
					pasteType: 'PASTE_NORMAL',
					pasteOrientation: 'NORMAL',
				},
			},
		]

		const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`
		const updateResponse = await fetch(updateUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requests: requests }),
		})

		if (!updateResponse.ok) {
			const errorDetails = await updateResponse.text()
			throw new Error(
				`Błąd podczas kopiowania pierwszego wiersza: ${updateResponse.status} ${updateResponse.statusText} - ${errorDetails}`
			)
		}

		console.log('Pierwszy wiersz został pomyślnie skopiowany.')
	}

	async function copyStylesAndData(spreadsheetId, sourceSheetId, rowCount, accessToken, sheetName) {
		// Obliczenie ostatniego wiersza z danymi
		const getLastRowUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:A`
		let lastRowWithData = 0

		// Znajdź ostatni wiersz z danymi
		const lastRowResponse = await fetch(getLastRowUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		const lastRowResult = await lastRowResponse.json()
		if (lastRowResponse.ok && lastRowResult.values) {
			lastRowWithData = lastRowResult.values.length
		} else {
			console.error('Problem with getting last data row:', lastRowResult.error)
			return
		}

		// Korekta: Przesunięcie startPasteRow o 2 wiersze wyżej
		const startPasteRow = lastRowWithData - rowCount + 1 // +1 zamiast +3
		const endPasteRow = lastRowWithData + 1 // +1 zamiast +3

		// Przygotowanie żądań
		const requests = [
			// Kopiowanie komórek z obrazami osadzonymi w nagłówkach (pierwszy wiersz)
			{
				copyPaste: {
					source: {
						sheetId: sourceSheetId,
						startRowIndex: 0,
						endRowIndex: 1,
						startColumnIndex: 0,
						endColumnIndex: 26, // Zakres kolumn, dostosuj w razie potrzeby
					},
					destination: {
						sheetId: sourceSheetId,
						startRowIndex: startPasteRow - 1,
						endRowIndex: startPasteRow,
						startColumnIndex: 0,
						endColumnIndex: 26,
					},
					pasteType: 'PASTE_NORMAL',
					pasteOrientation: 'NORMAL',
				},
			},
		]

		// Pobierz pełne dane arkusza, w tym stylowanie
		const getSheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?ranges=${sheetName}!A2:Z${
			rowCount + 1
		}&includeGridData=true`
		const sheetDataResponse = await fetch(getSheetDataUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		const sheetDataResult = await sheetDataResponse.json()
		if (!sheetDataResponse.ok) {
			console.error('Problem with getting sheet data:', sheetDataResult.error)
			return
		}

		// Dodaj żądania kopiowania stylów i walidacji danych
		sheetDataResult.sheets[0].data[0].rowData.forEach((row, rowIndex) => {
			row.values.forEach((cell, columnIndex) => {
				if (cell.userEnteredFormat || cell.dataValidation) {
					requests.push({
						repeatCell: {
							range: {
								sheetId: sourceSheetId,
								startRowIndex: startPasteRow + rowIndex,
								endRowIndex: startPasteRow + rowIndex + 1,
								startColumnIndex: columnIndex,
								endColumnIndex: columnIndex + 1,
							},
							cell: {
								userEnteredFormat: cell.userEnteredFormat || {},
								dataValidation: cell.dataValidation || null,
							},
							fields:
								'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy,numberFormat,borders),dataValidation',
						},
					})
				}
			})
		})

		// Wyślij żądanie aktualizacji
		const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requests: requests }),
		})

		if (!response.ok) {
			const responseBody = await response.text()
			throw new Error(`HTTP error ${response.status}: ${responseBody}`)
		}

		console.log('Cells, styles, and data validations copied successfully')
	}

	//aparat
	const { hasPermission, requestPermission } = useCameraPermission()
	const [isActive, setIsActive] = useState(false)
	const [isCameraReady, setIsCameraReady] = useState(false)
	const [isFullScreenCameraVisible, setIsFullScreenCameraVisible] = useState(false)
	const [selectedElementName, setSelectedElementName] = useState('')
	const [selectedElementIndex, setSelectedElementIndex] = useState(null)
	const [SelectedLocalization, setSelectedLocalization] = useState('')

	const device = useCameraDevice('back')
	const cameraRef = useRef(null)

	useEffect(() => {
		requestPermission()
	}, [hasPermission])
	const onTakePicturePressed = async () => {
		if (cameraRef.current && !isCapturing) {
			setIsCapturing(true) // Włącz spinner na migawce
			try {
				const photo = await cameraRef.current.takePhoto()
				setCapturedPhoto(photo)
			} catch (error) {
				console.error('Błąd podczas robienia zdjęcia:', error)
				Alert.alert('Błąd aparatu', 'Nie udało się zrobić zdjęcia.')
			} finally {
				setIsCapturing(false) // Zawsze wyłączaj spinner na migawce po zakończeniu
			}
		}
	}

	const handleUsePhoto = async () => {
		if (!capturedPhoto) return

		setIsUploading(true) // Włączamy spinner (teraz na ekranie podglądu)

		setTakenPhotos(prevPhotos => ({
			...prevPhotos,
			[selectedElementIndex]: capturedPhoto,
		}))

		await uploadPhoto(capturedPhoto, selectedElementName, selectedElementIndex)
		setIsUploading(false)
		// Resetujemy stany po zakończeniu wysyłania/zapisu
		setCapturedPhoto(null)
	}

	// NOWA FUNKCJA: Uruchamiana, gdy użytkownik chce powtórzyć zdjęcie
	const handleRetakePhoto = () => {
		setCapturedPhoto(null) // Czyścimy stan, co spowoduje powrót do widoku kamery
	}

	const compressImage = async uri => {
		try {
			const manipResult = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 1600 } }], // Zmniejszamy szerokość do 1600px (proporcje zachowane)
				{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Jakość 70%, format JPEG
			)
			console.log('Zdjęcie skompresowane. Nowy URI:', manipResult.uri)
			return manipResult.uri
		} catch (error) {
			console.error('Błąd kompresji zdjęcia:', error)
			return uri // W razie błędu zwróć oryginał
		}
	}

	const uploadPhoto = async (photo, name, index) => {
		try {
			const token = (await GoogleSignin.getTokens()).accessToken
			GDrive.setAccessToken(token)
			GDrive.init()

			const photoUri = `file://${photo.path}`
			const compressedUri = await compressImage(photoUri)
			const cleanPath = compressedUri.startsWith('file://') ? compressedUri : `file://${compressedUri}`

			const base64 = await RNFetchBlob.fs.readFile(cleanPath, 'base64')
			const result = await GDrive.files.createFileMultipart(
				base64,
				'image/jpeg',
				{
					parents: [await AsyncStorage.getItem('@PhotosFolderId')],
					name: name,
				},
				true
			)
			if (result.ok) {
				updateUploadStatus(index, 'success')

				setIsActive(false)
			} else {
				throw new Error('Failed to upload photo')
			}
		} catch (error) {
			console.error('Error uploading image to Google Drive: ', error)
			updateUploadStatus(index, 'error')

			setIsActive(false)
		}
	}

	const updateUploadStatus = (index, status) => {
		setUploadStatuses(prev => {
			const updated = [...prev]
			updated[index] = status
			return updated
		})
	}

	const renderItem = useCallback(
		({ item: element, index }) => {
			return (
				<View className='bg-white my-2 rounded-xl shadow-sm overflow-hidden mx-2'>
					{/* Nagłówek sekcji */}
					<View className='p-4 flex-row justify-between items-center'>
						<Text className='text-lg font-bold text-gray-800 flex-1 pr-4'>{element.name}</Text>
						<Switch
							trackColor={{ false: '#E5E7EB', true: '#81b0ff' }}
							thumbColor={openSections[index] ? '#3B82F6' : '#f4f3f4'}
							ios_backgroundColor='#3e3e3e'
							onValueChange={() => handleToggle(index)}
							value={!!openSections[index]}
						/>
					</View>

					{/* Rozwijana zawartość */}
					{openSections[index] && (
						<View>
							{element.content.map((content, contentIndex) => (
								<View key={contentIndex} className='bg-gray-50 p-4 border-t border-gray-200'>
									<Text className='text-base text-gray-700 mb-4'>{content}</Text>

									{/* Przyciski */}
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

									{/* Komentarz */}
									<CommentInput
										placeholder='Dodaj uwagi lub użyj mikrofonu...'
										value={comments[index]?.[contentIndex] || ''}
										onChangeText={text => handleCommentChange(index, contentIndex, text)}
										aiContext={`- Kategoria główna: ${title}\n- Podkategoria: ${element.name}\n- Sprawdzane kryterium: ${content}`}
										photo={takenPhotos[index]}
									/>
								</View>
							))}

							{/* Aparat */}
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

								{/* Status wysyłania */}
								{uploadStatuses[index] && (
									<View
										className={`mt-2 p-2 rounded-md flex-row items-center ${
											uploadStatuses[index] === 'success'
												? 'bg-green-100'
												: uploadStatuses[index] === 'error'
													? 'bg-red-100'
													: 'bg-yellow-100'
										}`}>
										<Feather
											name={
												uploadStatuses[index] === 'success'
													? 'check-circle'
													: uploadStatuses[index] === 'error'
														? 'x-circle'
														: 'clock'
											}
											size={16}
											color={
												uploadStatuses[index] === 'success'
													? '#16A34A'
													: uploadStatuses[index] === 'error'
														? '#DC2626'
														: '#D97706'
											}
										/>
										<Text
											className={`ml-2 font-medium ${uploadStatuses[index] === 'success' ? 'text-green-800' : uploadStatuses[index] === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>
											{uploadStatuses[index] === 'success'
												? 'Zdjęcie wysłane'
												: uploadStatuses[index] === 'error'
													? 'Błąd wysyłania'
													: 'Zapisano w kolejce'}
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
							onPress={handleSubmit} // Tutaj musisz mieć zdefiniowaną funkcję handleSubmit w scope (skopiuj ją z oryginału)
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
							{sendCount > 0 ? (
								<Text className='text-gray-700 font-semibold'>
									Wysłano danych dla tej kategorii: {sendCount} {sendCount === 1 ? 'raz' : 'razy'}
								</Text>
							) : (
								<Text className='text-gray-700 font-semibold'>Nie wysłano jeszcze danych dla tej kategorii</Text>
							)}
						</View>
					</View>
				}
			/>

			{/* Modal z aparatem - UI jak wcześniej, logika podpięta pod oryginał */}
			<Modal visible={isActive} onRequestClose={() => setIsActive(false)} animationType='slide'>
				{device == null ? (
					<View className='flex-1 justify-center items-center bg-black'>
						<Text className='text-white text-xl'>Brak aparatu</Text>
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
								/>
								<TouchableOpacity
									onPress={() => setIsActive(false)}
									className='absolute top-12 left-5 bg-black/50 p-3 rounded-full'>
									<Feather name='x' size={24} color='white' />
								</TouchableOpacity>
								<View className='absolute bottom-10 w-full items-center'>
									<TouchableOpacity
										disabled={isCapturing}
										onPress={onTakePicturePressed}
										className='w-20 h-20 bg-white/80 rounded-full border-4 border-white justify-center items-center'>
										{isCapturing ? (
											<ActivityIndicator size='large' color='#000' />
										) : (
											<Feather name='camera' size={40} color='#333' />
										)}
									</TouchableOpacity>
								</View>
							</>
						) : (
							<View className='flex-1'>
								<Image source={{ uri: `file://${capturedPhoto.path}` }} style={StyleSheet.absoluteFill} />
								<View className='absolute bottom-10 w-full flex-row justify-around items-center'>
									{/* --- POCZĄTEK ZMIANY --- */}
									<TouchableOpacity onPress={handleRetakePhoto} disabled={isUploading} className='items-center'>
										{/* Dodajemy tło dla ikony */}
										<View className='h-16 w-16 bg-black/40 rounded-full justify-center items-center'>
											<Feather name='x' size={32} color='white' />
										</View>
										<Text className='text-white font-bold mt-2'>Zrób ponownie</Text>
									</TouchableOpacity>

									<TouchableOpacity onPress={handleUsePhoto} disabled={isUploading} className='items-center'>
										{/* Dodajemy tło dla ikony */}
										<View className='h-16 w-16 bg-black/40 rounded-full justify-center items-center'>
											<Feather name='check' size={32} color='white' />
										</View>
										<Text className='text-white font-bold mt-2'>Użyj tego zdjęcia</Text>
									</TouchableOpacity>
									{/* --- KONIEC ZMIANY --- */}
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
