import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Modal } from 'react-native'
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
]

const storeData = async (photosFolderId, copiedTemplateId, textId, id) => {
	try {
		const creationDate = new Date().toISOString()
		const templateLink = `https://docs.google.com/spreadsheets/d/${copiedTemplateId}/edit`

		await AsyncStorage.setItem('@Id', id)
		await AsyncStorage.setItem('@PhotosFolderId', photosFolderId)
		await AsyncStorage.setItem('@CopiedTemplateId', copiedTemplateId)
		await AsyncStorage.setItem('@SelectedTextId', textId)
		await AsyncStorage.setItem('@TemplateCreationDate', creationDate)
		await AsyncStorage.setItem('@TemplateLink', templateLink)
		console.log('Data successfully saved')
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

	useEffect(() => {
		GoogleSignin.configure({
			scopes: [
				'https://www.googleapis.com/auth/drive',
				'https://www.googleapis.com/auth/drive.file',
				'https://www.googleapis.com/auth/drive.readonly',
			],
		})
	}, [])

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
			storeData(photosFolderId, copiedTemplateId, selectedTemplate.text_id, selectedTemplate.id)
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
					<View className='mb-8'>
						<Text className='text-3xl font-bold text-gray-900'>Nowy Audyt</Text>
						<Text className='text-base text-gray-600 mt-1'>Stwórz folder i skopiuj szablon na Dysk Google.</Text>
					</View>

					{/* Krok 1 */}
					<View className='mb-6'>
						<Text className='text-lg font-bold text-gray-700 mb-2'>Krok 1: Wybierz szablon</Text>
						<TouchableOpacity
							onPress={() => setModalVisible(true)}
							className='flex-row items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm'>
							<Text className={`text-base ${selectedTemplate ? 'text-gray-900' : 'text-gray-500'}`}>
								{selectedTemplate ? selectedTemplate.name : 'Wybierz z listy'}
							</Text>
							<Feather name='chevron-down' size={20} color='#6B7280' />
						</TouchableOpacity>
					</View>

					{/* Krok 2 */}
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

					{/* Przycisk akcji */}
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

					{/* Komunikaty o statusie */}
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

			{/* Modal do wyboru szablonu */}
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
