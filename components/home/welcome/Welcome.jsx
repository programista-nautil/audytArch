import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, Alert, Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import styles from './welcome.style'
import { icons, SIZES } from '../../../constants'
import { Button } from 'react-native-paper'
const jobsTypes = []

const retrieveData = async () => {
	try {
		const photosFolderId = await AsyncStorage.getItem('@PhotosFolderId')
		const copiedTemplateId = await AsyncStorage.getItem('@CopiedTemplateId')
		const textId = await AsyncStorage.getItem('@SelectedTextId')
		if (photosFolderId !== null && copiedTemplateId !== null && textId !== null) {
			// Use the retrieved data as needed
			return { photosFolderId, copiedTemplateId, textId }
		}
		console.log({ id, title })
	} catch (error) {
		console.error('Failed to retrieve the data from storage', error)
	}
}

const Welcome = () => {
	const [templateInfo, setTemplateInfo] = useState(null)

	useEffect(() => {
		const fetchTemplateInfo = async () => {
			try {
				const id = await AsyncStorage.getItem('@Id')
				const creationDate = await AsyncStorage.getItem('@TemplateCreationDate')
				const link = await AsyncStorage.getItem('@TemplateLink')

				if (id && creationDate && link) {
					setTemplateInfo({
						id,
						creationDate,
						link,
					})
				}
			} catch (error) {
				console.error('Failed to fetch template info', error)
			}
		}

		fetchTemplateInfo()
	}, [])

	const checkTemplateDate = () => {
		if (templateInfo) {
			const today = new Date().toISOString().split('T')[0]
			const templateDate = new Date(templateInfo.creationDate).toISOString().split('T')[0]

			if (templateDate !== today) {
				Alert.alert('Uwaga', 'Proszę sprawdzić, czy wybrany szablon jest poprawny.')
			}
		}
	}

	return (
		<View style={styles.container}>
			{templateInfo ? (
				<>
					<Text style={styles.text}>Szablon: {templateInfo.id}</Text>
					<Text style={styles.text}>
						Data utworzenia: {new Date(templateInfo.creationDate).toLocaleDateString('pl-PL')}
					</Text>
					<Text style={styles.text}>
						<Text>Link do szablonu: </Text>
						<Text
							style={styles.link}
							onPress={() => {
								Linking.openURL(templateInfo.link)
							}}>
							OTWÓRZ
						</Text>
					</Text>
					{checkTemplateDate()}
				</>
			) : (
				<Text style={styles.text }>Nie wybrano szablonu.</Text>
			)}
		</View>
	)
}

export default Welcome
