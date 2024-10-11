// screens/TemplateManagerScreen.js
import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Menu, Provider, Button as PaperButton } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

const templates = [
	{ id: '1', name: 'Szkoła' },
	{ id: '2', name: 'Klatki' },
	{ id: '3', name: 'Szpital' },
]

const TemplateManagerScreen = () => {
	const [visible, setVisible] = useState(false)
	const [selectedTemplate, setSelectedTemplate] = useState(null)
	const [folderId, setFolderId] = useState(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		GoogleSignin.configure({
			scopes: ['https://www.googleapis.com/auth/drive.file'],
		})
	}, [])

	const openMenu = () => setVisible(true)
	const closeMenu = () => setVisible(false)
	//create folder in google drive
	//copy template to folder
	//set folderId
	//set isProcessing to false
	const createFolder = async () => {
		const token = (await GoogleSignin.getTokens()).accessToken // Pobieranie tokenu
		const response = await fetch(`https://www.googleapis.com/drive/v3/files`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: 'TEST',
				mimeType: 'application/vnd.google-apps.folder',
				parents: ['168wNbxGIF7sf9rDcegK9zO1e2G94ncqL'],
			}),
		})
		const data = await response.json()
		return data.id
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
								{selectedTemplate ? templates.find(t => t.id === selectedTemplate).name : 'Wybierz szablon'}
							</PaperButton>
						}>
						{templates.map(template => (
							<Menu.Item
								key={template.id}
								onPress={() => {
									setSelectedTemplate(template.id)
								}}
								title={template.name}
							/>
						))}
					</Menu>
					<Button
						title='Stwórz folder i skopiuj szablon'
						onPress={createFolder}
						disabled={!selectedTemplate || isProcessing}
						color='#6200ee' // Primary color for button
					/>
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
		flexGrow: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	menuButton: {
		marginBottom: 10,
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
