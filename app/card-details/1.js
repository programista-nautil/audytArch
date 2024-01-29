import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch, Image, TextInput, Alert, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/native'
import styles from './1.style'
import { COLORS, icons } from '../../constants'
import CameraAltIcon from '../../assets/icons/camera.png'
import CameraModule from '../../components/home/camera/CameraModule.js'
import { elementsData1 } from '../dataElements.js'
import axios from 'axios'

const elements = elementsData1

const One = () => {
	const route = useRoute()
	const { title } = route.params

	const [openSections, setOpenSections] = useState({})
	const [comments, setComments] = useState(Array(elements.length).fill(''))
	const [isFullScreenCameraVisible, setIsFullScreenCameraVisible] = useState(false)
	const [elementName, setElementName] = useState('')
	const [switchValues, setSwitchValues] = useState(Array(elements.length).fill(false))
	const [comment, setComment] = useState('') // New state variable for comment
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

	const handleCameraButtonPress = (index, contentName) => {
		setElementName(contentName.substring(0, 6))
		setIsFullScreenCameraVisible(true)
	}

	const handlePictureTaken = uri => {
		console.log('Zdjęcie zrobione:', uri)
		// Logika zapisywania zdjęcia, może wykorzystać funkcję uploadFile
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
		<View style={{ flex: 1, backgroundColor: COLORS.lightWhite, marginHorizontal: 10 }}>
			{!isFullScreenCameraVisible && (
				<ScrollView style={styles.container}>
					{elements.map((element, index) => (
						<TouchableOpacity key={index} onPress={() => handleToggle(index)}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								<Text
									style={{
										flex: 1,
										fontSize: 16,
										color: COLORS.tertiary,
									}}>
									{element.name}
								</Text>
								<Switch value={openSections[index]} onValueChange={() => handleToggle(index)} />
							</View>
							{openSections[index] && (
								<View style={{ backgroundColor: COLORS.gray2 }}>
									{element.content.map((content, contentIndex) => (
										<View
											key={contentIndex}
											style={{
												backgroundColor: contentIndex % 2 === 1 ? COLORS.lightGray : COLORS.white,
											}}>
											<Text style={[styles.tabText, { flex: 1 }]}>{content}</Text>
											<TouchableOpacity onPress={() => handleCameraButtonPress(index, content)}>
												<Image source={CameraAltIcon} style={styles.cameraAltIcon} />
											</TouchableOpacity>
											<View style={styles.commentContainer}>
												<TextInput
													style={styles.commentInput}
													placeholder='Wpisz uwagi'
													value={comments[index] || ''}
													onChangeText={text => handleCommentChange(index, contentIndex, text)}
												/>
											</View>
										</View>
									))}
								</View>
							)}
						</TouchableOpacity>
					))}
				</ScrollView>
			)}

			{isFullScreenCameraVisible && (
				<View style={StyleSheet.absoluteFill}>
					<CameraModule
						onPictureTaken={handlePictureTaken}
						uploadUrl='https://damian.nautil.info/googleGalleryApi/upload'
						elementName={elementName}
					/>
				</View>
			)}

			{!isFullScreenCameraVisible && (
				<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
					<Text style={styles.submitButtonText}>WYŚLIJ</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

export default One
