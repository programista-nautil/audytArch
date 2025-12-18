import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather } from '@expo/vector-icons' // Używamy ikon dla lepszego UI
import { useIsFocused } from '@react-navigation/native'

const Welcome = () => {
	const [templateInfo, setTemplateInfo] = useState(null)
	const isFocused = useIsFocused()

	useEffect(() => {
		const fetchTemplateInfo = async () => {
			try {
				const sheetName = await AsyncStorage.getItem('@SelectedTextTitle') // Nazwa arkusza (np. "1. Otoczenie...")
				const templateKind = await AsyncStorage.getItem('@TemplateKind') // Nowy element: Rodzaj szablonu
				const creationDate = await AsyncStorage.getItem('@TemplateCreationDate')
				const link = await AsyncStorage.getItem('@TemplateLink')

				if (sheetName && creationDate && link) {
					const templateData = {
						sheetName,
						templateKind: templateKind || 'Nieokreślony', // Wartość domyślna, jeśli nie ma zapisu
						creationDate,
						link,
					}
					setTemplateInfo(templateData)
					checkTemplateDate(templateData)
				} else {
					// Czyścimy dane, jeśli nie ma wybranego szablonu
					setTemplateInfo(null)
				}
			} catch (error) {
				console.error('Failed to fetch template info', error)
			}
		}

		if (isFocused) {
			fetchTemplateInfo()
		}
	}, [isFocused])

	const checkTemplateDate = templateData => {
		if (templateData) {
			const today = new Date()
			const templateDate = new Date(templateData.creationDate)
			// Porównujemy daty bez uwzględniania czasu
			if (templateDate.toDateString() !== today.toDateString()) {
				Alert.alert('Uwaga', 'Wybrany szablon nie jest z dzisiaj. Upewnij się, że pracujesz na poprawnym pliku.')
			}
		}
	}

	const InfoRow = ({ label, value, isLink = false, url = '' }) => (
		<View className='flex-row justify-between items-center mb-2'>
			<Text className='text-gray-600'>{label}</Text>
			{isLink ? (
				<TouchableOpacity onPress={() => Linking.openURL(url)}>
					<Text className='text-blue-600 font-semibold underline'>Otwórz Link</Text>
				</TouchableOpacity>
			) : (
				<Text className='font-semibold text-gray-800'>{value}</Text>
			)}
		</View>
	)

	return (
		<View className='p-4'>
			<View className='bg-white rounded-xl p-5 shadow-lg'>
				<View className='flex-row items-center mb-4'>
					<Feather name='info' size={16} color='#4A5568' />
					<Text className='text-lg font-bold text-gray-800 ml-3'>Informacje o szablonie</Text>
				</View>

				<View className='h-px bg-gray-200 mb-4' />

				{templateInfo ? (
					<>
						<InfoRow label='Nazwa arkusza:' value={templateInfo.sheetName} />
						<InfoRow label='Rodzaj szablonu:' value={templateInfo.templateKind} />
						<InfoRow label='Data:' value={new Date(templateInfo.creationDate).toLocaleDateString('pl-PL')} />
						<InfoRow label='Link do folderu:' isLink={true} url={templateInfo.link} />
					</>
				) : (
					<Text className='text-gray-500 text-center py-4'>Nie wybrano szablonu.</Text>
				)}

				<View className='h-px bg-gray-200 mt-4' />

				<Text className='text-xs text-gray-400 text-center mt-4'>Wersja aplikacji: 17.6</Text>
			</View>
		</View>
	)
}

export default Welcome
