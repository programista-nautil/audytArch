import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View, Button, Alert, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const DetailScreen = () => {
	const navigation = useNavigation()
	const route = useRoute()
	const { id, title } = route.params || { id: 'defaultId', title: 'Default Title' }
	const [elements, setElements] = useState([])
	const [comments, setComments] = useState([])
	const [switchValuesContent, setSwitchValuesContent] = useState([])

	console.log('id:', id)

	useEffect(() => {
		GoogleSignin.configure({
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		})
		fetchDataFromSheet(id)
	}, [id])

	const fetchDataFromSheet = async sheetId => {
		try {
			const token = (await GoogleSignin.getTokens()).accessToken
			const response = await fetch(
				`https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/${sheetId}!A2:E`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			const result = await response.json()
			if (result.values) {
				const data = result.values.map(row => ({
					name: row[0],
					content: row[1] ? row[1].split(';').map(item => item.trim()) : [],
				}))
				setElements(data)
				setComments(data.map(() => ''))
				setSwitchValuesContent(data.map(() => Array(3).fill(false)))
			}
		} catch (error) {
			console.error('Error fetching data from sheet:', error)
		}
	}

	return (
		<ScrollView>
			<Text>{title} asd</Text>
			{elements.map((element, index) => (
				<View key={index}>
					<Text>{element.name}</Text>
					<TextInput
						value={comments[index]}
						onChangeText={text => {
							const newComments = [...comments]
							newComments[index] = text
							setComments(newComments)
						}}
						placeholder='Uwagi'
					/>
					{/* Add more UI elements here */}
				</View>
			))}
		</ScrollView>
	)
}

export default DetailScreen
