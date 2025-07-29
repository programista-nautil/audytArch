import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather } from '@expo/vector-icons' // Używamy ikon dla lepszego UI

const Welcome = () => {
	const [templateInfo, setTemplateInfo] = useState(null)

	useEffect(() => {
		const fetchTemplateInfo = async () => {
			try {
				const id = await AsyncStorage.getItem('@Id')
				const creationDate = await AsyncStorage.getItem('@TemplateCreationDate')
				const link = await AsyncStorage.getItem('@TemplateLink')

				if (id && creationDate && link) {
					const templateData = { id, creationDate, link }
					setTemplateInfo(templateData)
					checkTemplateDate(templateData)
				}
			} catch (error) {
				console.error('Failed to fetch template info', error)
			}
		}

		fetchTemplateInfo()
	}, [])

	const checkTemplateDate = templateData => {
		if (templateData) {
			const today = new Date().toISOString().split('T')[0]
			const templateDate = new Date(templateData.creationDate).toISOString().split('T')[0]

			if (templateDate !== today) {
				Alert.alert('Uwaga', 'Proszę sprawdzić, czy wybrany szablon jest poprawny.')
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
					<Feather name='info' size={24} color='#4A5568' />
					<Text className='text-xl font-bold text-gray-800 ml-3'>Informacje o szablonie</Text>
				</View>

				<View className='h-px bg-gray-200 mb-4' />

				{templateInfo ? (
					<>
						<InfoRow label='Nazwa szablonu:' value={templateInfo.id} />
						<InfoRow label='Data utworzenia:' value={new Date(templateInfo.creationDate).toLocaleDateString('pl-PL')} />
						<InfoRow label='Link do arkusza:' isLink={true} url={templateInfo.link} />
					</>
				) : (
					<Text className='text-gray-500 text-center py-4'>Nie wybrano szablonu.</Text>
				)}

				<View className='h-px bg-gray-200 mt-4' />

				<Text className='text-xs text-gray-400 text-center mt-4'>Wersja aplikacji: 17.1</Text>
			</View>
		</View>
	)
}

export default Welcome
