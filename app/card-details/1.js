import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch, Image, Alert, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/native'
import styles from './1.style'
import { COLORS, icons } from '../../constants'
import CameraAltIcon from '../../assets/icons/camera.png'
import CameraModule from '../../components/home/camera/CameraModule.js'
import { elementsData1 } from '../dataElements.js'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import { TextInput } from 'react-native-paper'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

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

	const handleCameraButtonPress = (index, contentName) => {
		setElementName(contentName.substring(0, 6))
		setIsFullScreenCameraVisible(true)
	}

	const handleCloseCamera = () => {
		setIsFullScreenCameraVisible(false)
	}

	const handlePictureTaken = uri => {
		console.log('Zdjęcie zrobione:', uri)
		// Logika zapisywania zdjęcia, może wykorzystać funkcję uploadFile
		uploadImageToServer(uri)
	}

	const handleSwitchContent = (index, contentIndex, value) => {
		setSwitchValuesContent(prevState => {
			const newState = [...prevState]
			newState[index][contentIndex] = value
			return newState
		})
		setCommentIndex(contentIndex) // Store the current content index for comments
	}

	//wybór zdjęć z galerii
	const pickImage = async () => {
		// Prośba o uprawnienia do dostępu do galerii
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (permissionResult.granted === false) {
			alert('Wymagane są uprawnienia do dostępu do zdjęć!')
			return
		}

		// Wybór zdjęcia
		const pickerResult = await ImagePicker.launchImageLibraryAsync()
		console.log('Wynik wyboru zdjęcia:', pickerResult)
		if (pickerResult.canceled === true) {
			return
		}
		const selectedImage = pickerResult.assets[0]
		const imageUri = selectedImage.uri
		// Możesz teraz użyć pickerResult.uri do wysłania zdjęcia na serwer
		uploadImageToServer(imageUri)
	}

	const uploadImageToServer = async imageUri => {
		const formData = new FormData()
		formData.append('sampleFile', {
			uri: imageUri,
			type: 'image/jpeg', // lub inny typ pliku
			name: imageUri.split('/').pop(),
		})
		console.log('URI wybranego zdjęcia:', imageUri)
		console.log('Formularz do wysłania:', formData)

		try {
			const response = await axios.post('https://damian.nautil.info/googleGalleryApi/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			console.log('Odpowiedź serwera:', response.data)
		} catch (error) {
			console.error('Błąd podczas wysyłania zdjęcia:', error)
			console.log('Pełny obiekt błędu:', error.response)
		}
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
												alignItems: 'center',
											}}>
											<Text style={[styles.tabText, { flex: 1 }]}>{content}</Text>
											<View style={styles.stateButtonContainer}>
												<TouchableOpacity
													style={[
														styles.stateButton,
														switchValuesContent[index][contentIndex] === 'Tak' && { backgroundColor: COLORS.primary },
													]}
													onPress={() => handleSwitchContent(index, contentIndex, 'Tak')}>
													<Text
														style={[
															styles.stateButtonText,
															switchValuesContent[index][contentIndex] === 'Tak' && { color: COLORS.white },
														]}>
														Tak
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={[
														styles.stateButton,
														switchValuesContent[index][contentIndex] === 'Nie' && { backgroundColor: COLORS.primary },
													]}
													onPress={() => handleSwitchContent(index, contentIndex, 'Nie')}>
													<Text
														style={[
															styles.stateButtonText,
															switchValuesContent[index][contentIndex] === 'Nie' && { color: COLORS.white },
														]}>
														Nie
													</Text>
												</TouchableOpacity>
											</View>
											<TouchableOpacity
												onPress={() => handleCameraButtonPress(index, content)}
												style={{
													flexDirection: 'row',
													alignItems: 'center',
												}}>
												<Image source={CameraAltIcon} style={styles.cameraAltIcon} />
											</TouchableOpacity>
											<View style={styles.commentContainer}>
												<TextInput
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
					<TouchableOpacity onPress={pickImage}>
						<Text>Wybierz zdjęcie</Text>
					</TouchableOpacity>
				</ScrollView>
			)}

			{isFullScreenCameraVisible && (
				<View style={StyleSheet.absoluteFill}>
					<CameraModule
						onPictureTaken={handlePictureTaken}
						uploadUrl='https://damian.nautil.info/googleGalleryApi/upload'
						elementName={elementName}
						onClose={handleCloseCamera} // Dodaj to
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
