import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Menu, Provider, Button as PaperButton, TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

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
]

const storeData = async (photosFolderId, copiedTemplateId, textId, id, navigation) => {
	try {
		const creationDate = new Date().toISOString() // Zapisujemy datę w formacie ISO
		const templateLink = `https://drive.google.com/file/d/${copiedTemplateId}/view` // Tworzymy link do szablonu

		console.log(
			'Saving data to storage...' +
				photosFolderId +
				' ' +
				copiedTemplateId +
				' ' +
				textId +
				' ' +
				id +
				' ' +
				creationDate +
				' ' +
				templateLink
		)

		await AsyncStorage.setItem('@Id', id)
		await AsyncStorage.setItem('@PhotosFolderId', photosFolderId)
		await AsyncStorage.setItem('@CopiedTemplateId', copiedTemplateId)
		await AsyncStorage.setItem('@SelectedTextId', textId) // Saving the text_id
		await AsyncStorage.setItem('@TemplateCreationDate', creationDate) // Zapisujemy datę
		await AsyncStorage.setItem('@TemplateLink', templateLink) // Zapisujemy link do szablonu

		console.log('Data successfully saved')
	} catch (error) {
		console.error('Failed to save the data to the storage', error)
	}
}

const TemplateManagerScreen = () => {
	const navigation = useNavigation()
	const [visible, setVisible] = useState(false)
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

	const openMenu = () => setVisible(true)
	const closeMenu = () => setVisible(false)

	const createFolderAndCopyTemplate = async () => {
		if (!selectedTemplate) {
			console.error('No template selected.')
			return
		}

		setIsProcessing(true)
		try {
			const token = (await GoogleSignin.getTokens()).accessToken

			// Test file access
			let response = await fetch(`https://www.googleapis.com/drive/v3/files/${selectedTemplate.fileId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`Failed to access file. Status: ${response.status}, Response: ${errorText}`)
			}

			// Tworzenie głównego folderu
			response = await fetch('https://www.googleapis.com/drive/v3/files', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: folderName || 'Nowy Folder',
					mimeType: 'application/vnd.google-apps.folder',
					parents: ['168wNbxGIF7sf9rDcegK9zO1e2G94ncqL'],
				}),
			})
			const folderData = await response.json()
			const mainFolderId = folderData.id

			// Tworzenie folderu "Zdjęcia"
			response = await fetch('https://www.googleapis.com/drive/v3/files', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Zdjęcia',
					mimeType: 'application/vnd.google-apps.folder',
					parents: [mainFolderId],
				}),
			})
			const photosFolderData = await response.json()
			const photosFolderId = photosFolderData.id

			// Kopiowanie szablonu
			response = await fetch(`https://www.googleapis.com/drive/v3/files/${selectedTemplate.fileId}/copy`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: `${selectedTemplate.name} - Copy`,
					parents: [mainFolderId],
				}),
			})

			// Check response status
			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`Failed to copy template. Status: ${response.status}, Response: ${errorText}`)
			}

			const copiedTemplateData = await response.json()

			// Log the full response for debugging
			console.log('Copied Template Response:', copiedTemplateData)

			// Ensure copiedTemplateData contains the expected id
			if (!copiedTemplateData.id) {
				throw new Error('Copied template ID is missing in the response')
			}

			const copiedTemplateId = copiedTemplateData.id

			setIsProcessing(false)
			setFolderId(mainFolderId)

			console.log({ photosFolderId, copiedTemplateId }, selectedTemplate.text_id, selectedTemplate.id)
			storeData(photosFolderId, copiedTemplateId, selectedTemplate.text_id, selectedTemplate.id, navigation)
		} catch (error) {
			setIsProcessing(false)
			console.error('Failed to create folder and copy template', error)
			setError(error.message)
		}
	}

	return (
		<Provider>
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollViewContent}>
					<Text style={styles.title}>Wybierz szablon:</Text>
					<Menu
						visible={visible}
						onDismiss={closeMenu}
						anchor={
							<PaperButton onPress={openMenu} mode='outlined' style={styles.menuButton}>
								{selectedTemplate ? selectedTemplate.name : 'Wybierz szablon'}
							</PaperButton>
						}>
						{templates.map(template => (
							<Menu.Item
								key={template.id}
								onPress={() => {
									setSelectedTemplate(template)
									closeMenu()
								}}
								title={template.name}
							/>
						))}
					</Menu>
					<TextInput
						label='Nazwa Folderu'
						value={folderName}
						onChangeText={text => setFolderName(text)}
						mode='outlined'
						style={styles.input}
					/>
					<PaperButton
						mode='contained'
						onPress={createFolderAndCopyTemplate}
						disabled={!selectedTemplate || !folderName || isProcessing}
						style={styles.button}>
						Stwórz folder i skopiuj szablon
					</PaperButton>
					{folderId && <Text style={styles.successMessage}>Folder utworzony! ID: {folderId}</Text>}
					{error && <Text style={styles.errorMessage}>Error: {error}</Text>}
				</ScrollView>
			</View>
		</Provider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	scrollViewContent: {
		justifyContent: 'flex-start',
		alignItems: 'stretch',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	menuButton: {
		marginBottom: 20,
	},
	input: {
		marginBottom: 20,
		backgroundColor: 'white',
	},
	button: {
		marginBottom: 20,
	},
	successMessage: {
		color: 'green',
		marginTop: 10,
	},
	errorMessage: {
		color: 'red',
		marginTop: 10,
	},
})

export default TemplateManagerScreen
