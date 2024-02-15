import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import styles from './1.style'
import { COLORS } from '../../constants'
import { elementsData1 } from '../dataElements.js'
import axios from 'axios'
import { Card, Button, Paragraph, TextInput, ToggleButton } from 'react-native-paper'

const elements = elementsData1

const One = () => {
	const navigation = useNavigation() // Dodaj hook nawigacji

	const [openSections, setOpenSections] = useState({})
	const [comments, setComments] = useState(Array(elements.length).fill(''))
	const [switchValues, setSwitchValues] = useState(Array(elements.length).fill(false))
	const [comment, setComment] = useState('') // New state variable for comment
	const [commentIndex, setCommentIndex] = useState(null) // New state variable for comment index
	const [switchValuesContent, setSwitchValuesContent] = useState(
		Array(elements.length)
			.fill(null)
			.map(_ => Array(3).fill(false))
	)

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
				Alert.alert('Sukces', 'Dane zostały poprawnie wysłane.')
			})
			.catch(error => {
				console.log('Błąd:', error)
				Alert.alert('Błąd', 'Wystąpił problem podczas wysyłania danych.')
			})
	}

	return (
		<ScrollView style={{  }}>
			<View style={{ marginHorizontal: 10 }}>
				<Button
					icon='camera'
					mode='contained'
					onPress={() => navigation.navigate('CameraScreen')}
					style={styles.button}>
					Aparat
				</Button>

				{elements.map((element, index) => (
					<Card key={index} style={styles.card}>
						<Card.Title title={element.name} />
						<Card.Content>
							<Switch value={openSections[index]} onValueChange={() => handleToggle(index)} style={styles.switch} />
							{openSections[index] && (
								<View>
									{element.content.map((content, contentIndex) => (
										<View key={contentIndex} style={styles.contentContainer}>
											<Paragraph>{content}</Paragraph>
											<View style={styles.buttonGroup}>
												<Button
													mode={switchValuesContent[index][contentIndex] === 'Tak' ? 'contained' : 'outlined'}
													onPress={() => handleSwitchContent(index, contentIndex, 'Tak')}>
													Tak
												</Button>
												<Button
													mode={switchValuesContent[index][contentIndex] === 'Nie' ? 'contained' : 'outlined'}
													onPress={() => handleSwitchContent(index, contentIndex, 'Nie')}>
													Nie
												</Button>
											</View>
											<TextInput
												label='Uwagi' style={styles.input}
												value={comments[index] || ''}
												onChangeText={text => handleCommentChange(index, contentIndex, text)}
											/>
										</View>
									))}
								</View>
							)}
						</Card.Content>
					</Card>
				))}
				<Button onPress={handleSubmit} mode='contained-tonal'>
					<Text style={styles.submitButtonText}>WYŚLIJ</Text>
				</Button>
			</View>
		</ScrollView>
	)
}

export default One
