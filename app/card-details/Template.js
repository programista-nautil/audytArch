import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Modal, Alert } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Provider, TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather } from '@expo/vector-icons'
import { Stack } from 'expo-router'

// --- Logika (bez zmian) ---
const templates = [
	{
		id: '1',
		name: 'Szkoła',
		fileId: '1ttdyySavO0xv94NQ_7phpT0csOJHY8_9qlJ5fU3noCs',
		text_id: '1un6di9qcq4wN4DL_bHfmgdYZddbVAl4atGc6_KX4-bI',
	},
	{
		id: '2',
		name: 'Klatki',
		fileId: '1nWYvp5aeJ0Scs_dlT6bNHThMXKsRGCwq1YZ17oSTACU',
		text_id: '1MOgCsBoh01Z-q9yOUHl_isc147nnPX-YUCWdawwHuV4',
	},
	{
		id: '3',
		name: 'Szpital',
		fileId: '1ttdyySavO0xv94NQ_7phpT0csOJHY8_9qlJ5fU3noCs',
		text_id: '1un6di9qcq4wN4DL_bHfmgdYZddbVAl4atGc6_KX4-bI',
	},
	{
		id: '4',
		name: 'Spójność',
		fileId: '1zUA4ynCygVzB6g-VKffDyyHUKTesuaHEDuNDVvlj7w0',
		text_id: '1FLeRAc3wsKJinE86nitw1SMpU643jN_RScEE0KGCNq8',
	},
	{
		id: '5',
		name: 'Basen',
		fileId: '1rCygnhn_WTSQudcPeUuQUE9wF5qKfIoQoFnJB8-MKXg',
		text_id: '1sXtQLxCLkhHrAQmA4Z7zJxXFE5CY1-Pbx9a4UnIIZIo',
	},
	{
		id: '6',
		name: 'Hala Sportowa',
		fileId: '1DFQ5rZKFYEcgCwqdGYQYJFT9MYEAsmwpNd-btY7kz1Y',
		text_id: '1_vmxeAVuPD3daYO9t2ii4pWn2Z3CiENSMGpkAsEXhJc',
	},
	{
		id: '7',
		name: 'Akademik',
		fileId: '1vIBiCQcnAzeUSISUJa2fTq9BWRNSa7ToQGNHxd97mHk',
		text_id: '17uLWNie95RFGxmTbYEZjF6Ro2I-wzMAVT4PA9UNZSf0',
	},
	{
		id: '8',
		name: 'Budynek Administracyjny',
		fileId: '1ZdCXkoP1nHofsvPfbBgHTpQ6UVhr30W19Pv6a3yxIpE',
		text_id: '1YRxSYHiEbVozvVWh_jaT05aX-mvJ1hHT69i0zr6elME',
	},
	{
		id: '9',
		name: 'Budynek Dydaktyczny',
		fileId: '1Qu74MFnbROTQDuH5ABRiRB0MiUhpwAbo-su-muZpN2s',
		text_id: '13NGkwnm9ZeRov_iqVMkSs6EdI-acLTx68mCU2d7cPGg',
	},
	{
		id: '10',
		name: 'Biblioteka',
		fileId: '1MszR0MKBAfOcyzfmZcX1cB7XiOaJH2OIUjpiP9EjUCY',
		text_id: '1O9rK-2vVyY0SyH7235tU96CKRD_0INBnTzjCFXtt8I8',
	},
	{
		id: '11',
		name: 'Szkoła - Julia',
		templateKey: 'szkola-julia',
		fileId: '164rvHjfeQVKqpKm_gUmS4macG1dMesmXGJNBRATZhJk',
		text_id: '1O9rK-2vVyY0SyH7235tU96CKRD_0INBnTzjCFXtt8I8',
	},
	{
		id: '12',
		name: 'Klatki - Julia',
		templateKey: 'klatki-julia',
		fileId: '1eQ8jVCYOPjdbBSnW4Tr_u_gjDTyubACVsOy-eUtvMBE',
		text_id: '1O9rK-2vVyY0SyH7235tU96CKRD_0INBnTzjCFXtt8I8',
	},
]

const fetchExistingAudits = async accessToken => {
	// ID folderu głównego, w którym tworzone są wszystkie audyty
	const parentFolderId = '168wNbxGIF7sf9rDcegK9zO1e2G94ncqL'

	const folderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
	const orderBy = 'createdTime desc'
	const pageSize = 10 // Pobieramy więcej, aby znaleźć 10 pasujących
	const fields = 'files(id,name,createdTime)'

	const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(folderQuery)}&orderBy=${encodeURIComponent(orderBy)}&pageSize=${pageSize}&fields=${encodeURIComponent(fields)}`

	try {
		const response = await fetch(url, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		if (!response.ok) {
			throw new Error(`Błąd pobierania folderów: ${await response.text()}`)
		}
		const data = await response.json()
		const folders = data.files || []

		// Krok 2: Odfiltruj foldery, zostawiając tylko te z plikiem '_audyt-info.json'
		const validAudits = []
		for (const folder of folders) {
			// Przerywamy pętlę, gdy znajdziemy już 10 validnych audytów
			if (validAudits.length >= 10) {
				break
			}

			const fileCheckQuery = `'${folder.id}' in parents and name='_audyt-info.json' and trashed=false`
			const fileCheckUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(fileCheckQuery)}&pageSize=1&fields=files(id)`

			const fileCheckResponse = await fetch(fileCheckUrl, {
				headers: { Authorization: `Bearer ${accessToken}` },
			})

			if (fileCheckResponse.ok) {
				const fileData = await fileCheckResponse.json()
				if (fileData.files && fileData.files.length > 0) {
					// Jeśli plik istnieje, folder jest poprawnym audytem
					validAudits.push(folder)
				}
			}
		}

		console.log(`Znaleziono ${validAudits.length} kompletnych audytów.`)
		return validAudits
	} catch (error) {
		console.error('Błąd w fetchExistingAudits:', error)
		return []
	}
}

const storeData = async (photosFolderId, copiedTemplateId, textId, id, templateName, sheetName, mainFolderId) => {
	try {
		const creationDate = new Date().toISOString()
		// Tworzymy link do FOLDERU, a nie do pliku
		const templateLink = `https://drive.google.com/drive/folders/${mainFolderId}`

		await AsyncStorage.setItem('@Id', id)
		await AsyncStorage.setItem('@PhotosFolderId', photosFolderId)
		await AsyncStorage.setItem('@CopiedTemplateId', copiedTemplateId)
		await AsyncStorage.setItem('@SelectedTextId', textId)
		await AsyncStorage.setItem('@TemplateCreationDate', creationDate)
		await AsyncStorage.setItem('@TemplateLink', templateLink) // Zapisujemy nowy link
		await AsyncStorage.setItem('@TemplateKind', templateName || 'Nieokreślony')
		await AsyncStorage.setItem('@SelectedTextTitle', sheetName || 'Bez nazwy')

		console.log('Data successfully saved with FOLDER link')
	} catch (error) {
		console.error('Failed to save the data to the storage', error)
	}
}

const TemplateManagerScreen = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedTemplate, setSelectedTemplate] = useState(null)
	const [folderName, setFolderName] = useState('')
	const [folderId, setFolderId] = useState(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState(null)

	const [existingAuditsModalVisible, setExistingAuditsModalVisible] = useState(false)
	const [selectedAudit, setSelectedAudit] = useState(null) // Przechowuje wybrany istniejący audyt
	const [existingAudits, setExistingAudits] = useState([])
	const [isLoadingAudits, setIsLoadingAudits] = useState(true)

	useEffect(() => {
		GoogleSignin.configure({
			scopes: [
				'https://www.googleapis.com/auth/drive',
				'https://www.googleapis.com/auth/drive.file',
				'https://www.googleapis.com/auth/drive.readonly',
			],
		})

		const loadAudits = async () => {
			try {
				const token = (await GoogleSignin.getTokens()).accessToken
				const audits = await fetchExistingAudits(token)
				setExistingAudits(audits)
			} catch (err) {
				setError('Nie udało się wczytać listy istniejących audytów.')
			} finally {
				setIsLoadingAudits(false)
			}
		}

		loadAudits()
	}, [])

	const handleSelectExistingAudit = async auditFolder => {
		setExistingAuditsModalVisible(false) // Zamknij modal po wyborze
		setSelectedAudit(auditFolder) // Zapisz wybrany audyt w stanie

		setIsProcessing(true)
		setError(null)
		try {
			const token = (await GoogleSignin.getTokens()).accessToken
			const folderId = auditFolder.id

			const query = `'${folderId}' in parents and trashed=false`
			const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`

			const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
			if (!response.ok) throw new Error('Nie udało się pobrać zawartości folderu.')
			const { files } = await response.json()

			const auditSheet = files.find(f => f.mimeType === 'application/vnd.google-apps.spreadsheet')
			const photosFolder = files.find(f => f.name === 'Zdjęcia' && f.mimeType === 'application/vnd.google-apps.folder')
			const infoFile = files.find(f => f.name === '_audyt-info.json') // Szukamy naszego pliku z metadanymi

			if (!auditSheet || !photosFolder || !infoFile) {
				throw new Error(
					"Wybrany folder jest niekompletny (brak arkusza, folderu 'Zdjęcia' lub pliku _audyt-info.json).",
				)
			}

			const fileContentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${infoFile.id}?alt=media`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			if (!fileContentResponse.ok) throw new Error('Nie udało się odczytać pliku z metadanymi.')
			const auditMetadata = await fileContentResponse.json()

			// Krok 3: Zapisz odzyskane dane do pamięci aplikacji
			await storeData(
				photosFolder.id,
				auditSheet.id,
				auditMetadata.textId, // Używamy odzyskanego textId
				auditMetadata.templateId, // Używamy odzyskanego id szablonu
				auditMetadata.templateName, // Używamy odzyskanej nazwy szablonu
				auditFolder.name,
				folderId,
			)
			Alert.alert(
				'Sukces',
				`Wczytano audyt "${auditFolder.name}". Możesz teraz wrócić do ekranu głównego i kontynuować pracę.`,
			)
		} catch (err) {
			console.error('Błąd przy wczytywaniu istniejącego audytu:', err)
			setError(err.message)
		} finally {
			setIsProcessing(false)
		}
	}

	const createFolderAndCopyTemplate = async () => {
		if (!selectedTemplate) {
			setError('Nie wybrano szablonu.')
			return
		}
		if (!folderName.trim()) {
			setError('Nazwa folderu nie może być pusta.')
			return
		}

		setIsProcessing(true)
		setError(null)
		setFolderId(null)

		try {
			const token = (await GoogleSignin.getTokens()).accessToken
			let response

			response = await fetch('https://www.googleapis.com/drive/v3/files', {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: folderName,
					mimeType: 'application/vnd.google-apps.folder',
					parents: ['168wNbxGIF7sf9rDcegK9zO1e2G94ncqL'],
				}),
			})
			if (!response.ok) throw new Error(`Błąd tworzenia folderu: ${await response.text()}`)
			const folderData = await response.json()
			const mainFolderId = folderData.id

			response = await fetch('https://www.googleapis.com/drive/v3/files', {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: 'Zdjęcia',
					mimeType: 'application/vnd.google-apps.folder',
					parents: [mainFolderId],
				}),
			})
			if (!response.ok) throw new Error(`Błąd tworzenia folderu Zdjęcia: ${await response.text()}`)
			const photosFolderData = await response.json()
			const photosFolderId = photosFolderData.id

			const metadata = {
				templateId: selectedTemplate.id,
				templateName: selectedTemplate.name,
				textId: selectedTemplate.text_id,
				creationDate: new Date().toISOString(),
			}

			await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/related; boundary=foo_bar_baz',
				},
				body: `--foo_bar_baz
Content-Type: application/json; charset=UTF-8

${JSON.stringify({ name: '_audyt-info.json', parents: [mainFolderId], mimeType: 'application/json' })}

--foo_bar_baz
Content-Type: application/json

${JSON.stringify(metadata)}
--foo_bar_baz--`,
			})
			console.log('Plik _audyt-info.json został utworzony.')

			response = await fetch(`https://www.googleapis.com/drive/v3/files/${selectedTemplate.fileId}/copy`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: `${folderName} - Arkusz Audytu`, parents: [mainFolderId] }),
			})
			if (!response.ok) throw new Error(`Błąd kopiowania szablonu: ${await response.text()}`)
			const copiedTemplateData = await response.json()
			if (!copiedTemplateData.id) throw new Error('Brak ID skopiowanego szablonu w odpowiedzi.')

			const copiedTemplateId = copiedTemplateData.id
			setFolderId(mainFolderId)
			storeData(
				photosFolderId,
				copiedTemplateId,
				selectedTemplate.text_id,
				selectedTemplate.id,
				selectedTemplate.name,
				folderName,
				mainFolderId,
			)
		} catch (err) {
			console.error('Błąd podczas tworzenia folderu i kopiowania szablonu', err)
			setError(err.message)
		} finally {
			setIsProcessing(false)
		}
	}

	const handleSelectTemplate = template => {
		setSelectedTemplate(template)
		setModalVisible(false)
	}

	return (
		<Provider>
			<Stack.Screen
				options={{
					headerTitle: 'Szablon',
					headerTitleAlign: 'center',
					headerStyle: { backgroundColor: '#F9FAFB' },
					headerShadowVisible: false,
				}}
			/>
			<SafeAreaView className='flex-1 bg-gray-50'>
				<ScrollView contentContainerClassName='p-5' keyboardShouldPersistTaps='handled'>
					<View>
						<Text className='text-3xl font-bold text-gray-900'>Kontynuuj pracę</Text>
						<Text className='text-base text-gray-600 mt-1'>Wybierz istniejący audyt z listy, aby kontynuować.</Text>
						<TouchableOpacity
							onPress={() => setExistingAuditsModalVisible(true)}
							disabled={isLoadingAudits}
							className='flex-row items-center justify-between mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm'>
							<Text className={`text-base ${selectedAudit ? 'text-gray-900' : 'text-gray-500'}`}>
								{isLoadingAudits
									? 'Wczytywanie listy...'
									: selectedAudit
										? selectedAudit.name
										: 'Wybierz z listy istniejących audytów'}
							</Text>
							<Feather name='chevron-down' size={20} color='#6B7280' />
						</TouchableOpacity>
					</View>

					<View className='flex-row items-center my-8'>
						<View className='flex-1 h-px bg-gray-300' />
						<Text className='mx-4 text-gray-500 font-semibold'>LUB</Text>
						<View className='flex-1 h-px bg-gray-300' />
					</View>

					{/* Sekcja "Nowy Audyt" */}
					<View className='mb-8'>
						<Text className='text-3xl font-bold text-gray-900'>Nowy Audyt</Text>
						<Text className='text-base text-gray-600 mt-1'>Stwórz nowy folder i skopiuj szablon na Dysk Google.</Text>
					</View>

					<View className='mb-6'>
						<Text className='text-lg font-bold text-gray-700 mb-2'>Krok 1: Wybierz szablon</Text>
						{/* Reszta UI dla tworzenia nowego audytu pozostaje bez zmian */}
						<TouchableOpacity
							onPress={() => setModalVisible(true)}
							className='flex-row items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm'>
							<Text className={`text-base ${selectedTemplate ? 'text-gray-900' : 'text-gray-500'}`}>
								{selectedTemplate ? selectedTemplate.name : 'Wybierz z listy'}
							</Text>
							<Feather name='chevron-down' size={20} color='#6B7280' />
						</TouchableOpacity>
					</View>

					<View className='mb-8'>
						<Text className='text-lg font-bold text-gray-700 mb-2'>Krok 2: Podaj nazwę audytu</Text>
						<TextInput
							value={folderName}
							onChangeText={text => setFolderName(text)}
							mode='outlined'
							className='bg-white border rounded-lg shadow-sm'
							theme={{ colors: { primary: '#3B82F6', background: 'white' } }}
						/>
					</View>

					<TouchableOpacity
						onPress={createFolderAndCopyTemplate}
						disabled={!selectedTemplate || !folderName || isProcessing}
						className={`py-4 rounded-lg flex-row items-center justify-center shadow-lg ${
							!selectedTemplate || !folderName || isProcessing ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'
						}`}>
						{isProcessing ? (
							<ActivityIndicator color='white' />
						) : (
							<>
								<Feather name='folder-plus' size={20} color='white' />
								<Text className='text-white text-lg font-bold ml-3'>Stwórz folder i skopiuj szablon</Text>
							</>
						)}
					</TouchableOpacity>

					<View className='mt-6'>
						{folderId && (
							<View className='bg-green-100 border border-green-300 p-4 rounded-lg flex-row items-center'>
								<Feather name='check-circle' size={24} color='#16A34A' />
								<Text className='text-green-800 ml-3 flex-1'>Folder utworzony pomyślnie!</Text>
							</View>
						)}
						{error && (
							<View className='bg-red-100 border border-red-300 p-4 rounded-lg flex-row items-center'>
								<Feather name='x-circle' size={24} color='#DC2626' />
								<Text className='text-red-800 ml-3 flex-1'>Błąd: {error}</Text>
							</View>
						)}
					</View>
				</ScrollView>
			</SafeAreaView>

			<Modal
				transparent={true}
				animationType='fade'
				visible={existingAuditsModalVisible}
				onRequestClose={() => setExistingAuditsModalVisible(false)}>
				<View className='flex-1 justify-center items-center bg-black/60 px-5'>
					<View className='bg-white rounded-2xl w-full max-w-sm shadow-xl'>
						<Text className='text-xl font-bold text-gray-800 p-5 border-b border-gray-200'>
							Wybierz audyt (10 najnowszych)
						</Text>
						<ScrollView style={{ maxHeight: 300 }}>
							{existingAudits.map((audit, index) => (
								<TouchableOpacity
									key={audit.id}
									onPress={() => handleSelectExistingAudit(audit)}
									className={`p-4 active:bg-gray-100 ${index !== existingAudits.length - 1 ? 'border-b border-gray-100' : ''}`}>
									<Text className='text-base text-gray-700'>{audit.name}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
						<TouchableOpacity
							onPress={() => setExistingAuditsModalVisible(false)}
							className='p-5 bg-gray-50 active:bg-gray-200 rounded-b-2xl border-t border-gray-200'>
							<Text className='text-base text-blue-600 font-semibold text-center'>Anuluj</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<Modal
				transparent={true}
				animationType='fade'
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}>
				<View className='flex-1 justify-center items-center bg-black/60 px-5'>
					<View className='bg-white rounded-2xl w-full max-w-sm shadow-xl'>
						<Text className='text-xl font-bold text-gray-800 p-5 border-b border-gray-200'>Wybierz szablon</Text>
						<View className='py-2'>
							{templates.map((template, index) => (
								<TouchableOpacity
									key={template.id}
									onPress={() => handleSelectTemplate(template)}
									className={`p-4 active:bg-gray-100 ${index !== templates.length - 1 ? 'border-b border-gray-100' : ''}`}>
									<Text className='text-base text-gray-700'>{template.name}</Text>
								</TouchableOpacity>
							))}
						</View>
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
							className='p-5 bg-gray-50 active:bg-gray-200 rounded-b-2xl border-t border-gray-200'>
							<Text className='text-base text-blue-600 font-semibold text-center'>Anuluj</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</Provider>
	)
}

export default TemplateManagerScreen
