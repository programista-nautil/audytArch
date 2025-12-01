import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native' // << ZMIANA: dodano ActivityIndicator

import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'

const retrieveId = async () => {
	try {
		const storedId = await AsyncStorage.getItem('@Id')
		if (storedId !== null) {
			return storedId
		}
	} catch (error) {
		console.error('Failed to retrieve the data from storage', error)
	}
	return null
}

const Popularjobs = () => {
	const [currentId, setCurrentId] = useState(null)
	const [templateData, setTemplateData] = useState(null)
	const [categoriesData, setCategoriesData] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const data_template = [{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') }]

	// Ogólna tablica dla większości typów budynków (default, hala, akademik)
	const data_general = [
		{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') },
		{ id: 1, title: '1.OTOCZENIE ZEWNĘTRZNE', icon: require('../../../assets/images/zew.png') },
		{ id: 2, title: '2.PARKING DLA OZN', icon: require('../../../assets/images/parking.jpg') },
		{ id: 3, title: '3.STREFA WEJŚCIA', icon: require('../../../assets/images/strefaWej.jpg') },
		{ id: 4, title: '4.SCHODY ZEWNĘTRZNE', icon: require('../../../assets/images/outdoor_stairs.jpg') },
		{ id: 5, title: '5.POCHYLNIE', icon: require('../../../assets/images/ramp.jpg') },
		{ id: 6, title: '6.DOMOFON', icon: require('../../../assets/images/domofon.jpg') },
		{ id: 7, title: '7.RECEPCJA', icon: require('../../../assets/images/reception.jpg') },
		{ id: 8, title: '8.KORYTARZE', icon: require('../../../assets/images/corridors.jpg') },
		{ id: 9, title: '9.KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 10, title: '10.DZWIGI OSOBOWE PLATFORMY', icon: require('../../../assets/images/elevator.jpg') },
		{ id: 11, title: '11.WC', icon: require('../../../assets/images/wc.jpg') },
		{ id: 12, title: '12.POKOJE RODZICA Z DZIECKIEM', icon: require('../../../assets/images/parentChildren.jpg') },
		{ id: 13, title: '13.INNE POMIESZCZENIA', icon: require('../../../assets/images/otherRooms.jpg') },
		{ id: 14, title: '14.OCHRONA PRZECIWPOŻAROWA', icon: require('../../../assets/images/fireproof.jpg') },
		{ id: 15, title: '15.INFORMACJE', icon: require('../../../assets/images/information.jpg') },
		{ id: 16, title: '16.MATERIAŁY WYKOŃCZENIOWE', icon: require('../../../assets/images/materialywyk.jpg') },
		{ id: 17, title: 'KWESTIONARIUSZ GUS', icon: require('../../../assets/images/qa.png') },
	]

	// Specjalna tablica dla default z innym tytułem w pozycji 12
	const data_default = [
		{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') },
		{ id: 1, title: '1.OTOCZENIE ZEWNĘTRZNE', icon: require('../../../assets/images/zew.png') },
		{ id: 2, title: '2.PARKING DLA OZN', icon: require('../../../assets/images/parking.jpg') },
		{ id: 3, title: '3.STREFA WEJŚCIA', icon: require('../../../assets/images/strefaWej.jpg') },
		{ id: 4, title: '4.SCHODY ZEWNĘTRZNE', icon: require('../../../assets/images/outdoor_stairs.jpg') },
		{ id: 5, title: '5.POCHYLNIE', icon: require('../../../assets/images/ramp.jpg') },
		{ id: 6, title: '6.DOMOFON', icon: require('../../../assets/images/domofon.jpg') },
		{ id: 7, title: '7.RECEPCJA', icon: require('../../../assets/images/reception.jpg') },
		{ id: 8, title: '8.KORYTARZE', icon: require('../../../assets/images/corridors.jpg') },
		{ id: 9, title: '9.KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 10, title: '10.DZWIGI OSOBOWE PLATFORMY', icon: require('../../../assets/images/elevator.jpg') },
		{ id: 11, title: '11.WC', icon: require('../../../assets/images/wc.jpg') },
		{ id: 12, title: '12.POKOJE RODZICA Z DZIECKIEM', icon: require('../../../assets/images/parentChildren.jpg') },
		{ id: 13, title: '13.INNE POMIESZCZENIA', icon: require('../../../assets/images/otherRooms.jpg') },
		{ id: 14, title: '14.OCHRONA PRZECIWPOŻAROWA', icon: require('../../../assets/images/fireproof.jpg') },
		{ id: 15, title: '15.INFORMACJE', icon: require('../../../assets/images/information.jpg') },
		{ id: 16, title: '16.MATERIAŁY WYKOŃCZENIOWE', icon: require('../../../assets/images/materialywyk.jpg') },
		{ id: 17, title: 'KWESTIONARIUSZ GUS', icon: require('../../../assets/images/qa.png') },
	]

	const data_klatki = [
		{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') },
		{ id: 1, title: '1.OTOCZENIE ZEWNĘTRZNE', icon: require('../../../assets/images/zew.png') },
		{ id: 2, title: '2.PARKING DLA OZN', icon: require('../../../assets/images/parking.jpg') },
		{ id: 3, title: '3.STREFA WEJŚCIA', icon: require('../../../assets/images/strefaWej.jpg') },
		{ id: 4, title: '4.SCHODY ZEWNĘTRZNE', icon: require('../../../assets/images/outdoor_stairs.jpg') },
		{ id: 5, title: '5.POCHYLNIE', icon: require('../../../assets/images/ramp.jpg') },
		{ id: 6, title: '6.DOMOFON', icon: require('../../../assets/images/domofon.jpg') },
		{ id: 7, title: '7.KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 8, title: '8.DZWIGI OSOBOWE PLATFORMY', icon: require('../../../assets/images/elevator.jpg') },
		{ id: 9, title: 'KWESTIONARIUSZ GUS', icon: require('../../../assets/images/information.jpg') },
	]

	const data_knn = [
		{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') },
		{ id: 1, title: '1.STREFA WEJŚCIA', icon: require('../../../assets/images/outdoor_stairs.jpg') },
		{ id: 2, title: '2.ORIENTACJA W BUDYNKU I PRZEKAZ INFORMACJI', icon: require('../../../assets/images/ramp.jpg') },
		{ id: 3, title: '3.KOMUNIKACJA POZIOMA', icon: require('../../../assets/images/domofon.jpg') },
		{ id: 4, title: '4.KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 5, title: '5.STANOWISKA POSTOJOWE', icon: require('../../../assets/images/elevator.jpg') },
		{ id: 6, title: '6.POMIESZCZENIA HIGIENICZNO-SANITARNE', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 7, title: '7.STANOWISKO OBSŁUGI KLIENTA', icon: require('../../../assets/images/elevator.jpg') },
	]

	const data_basen = [
		{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') },
		{ id: 1, title: '1.OTOCZENIE ZEWNĘTRZNE', icon: require('../../../assets/images/zew.png') },
		{ id: 2, title: '2.PARKING DLA OZN', icon: require('../../../assets/images/parking.jpg') },
		{ id: 3, title: '3.STREFA WEJŚCIA', icon: require('../../../assets/images/strefaWej.jpg') },
		{ id: 4, title: '4.SCHODY ZEWNĘTRZNE', icon: require('../../../assets/images/outdoor_stairs.jpg') },
		{ id: 5, title: '5.POCHYLNIE', icon: require('../../../assets/images/ramp.jpg') },
		{ id: 6, title: '6.DOMOFON', icon: require('../../../assets/images/domofon.jpg') },
		{ id: 7, title: '7.RECEPCJA', icon: require('../../../assets/images/reception.jpg') },
		{ id: 8, title: '8.KORYTARZE', icon: require('../../../assets/images/corridors.jpg') },
		{ id: 9, title: '9.KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 10, title: '10.DZWIGI OSOBOWE PLATFORMY', icon: require('../../../assets/images/elevator.jpg') },
		{ id: 11, title: '11.WC', icon: require('../../../assets/images/wc.jpg') },
		{ id: 12, title: '12.KOMFORTKA', icon: require('../../../assets/images/parentChildren.jpg') },
		{ id: 13, title: '13.DOSTĘPNOŚĆ STREFY BASENOWEJ', icon: require('../../../assets/images/otherRooms.jpg') },
		{ id: 14, title: '14.OCHRONA PRZECIWPOŻAROWA', icon: require('../../../assets/images/fireproof.jpg') },
		{ id: 15, title: '15.INFORMACJE', icon: require('../../../assets/images/information.jpg') },
		{ id: 16, title: '16.MATERIAŁY WYKOŃCZENIOWE', icon: require('../../../assets/images/materialywyk.jpg') },
		{ id: 17, title: 'KWESTIONARIUSZ GUS', icon: require('../../../assets/images/qa.png') },
	]

	const data_szkola = [
		{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') },
		{ id: 1, title: '1.OTOCZENIE ZEWNĘTRZNE', icon: require('../../../assets/images/zew.png') },
		{ id: 2, title: '2.TERENY SPORTOWE I REKREACYJNE', icon: require('../../../assets/images/parking.jpg') },
		{ id: 3, title: '3.STREFA WEJŚCIA', icon: require('../../../assets/images/strefaWej.jpg') },
		{ id: 4, title: '4.SCHODY ZEWNĘTRZNE', icon: require('../../../assets/images/outdoor_stairs.jpg') },
		{ id: 5, title: '5.POCHYLNIE', icon: require('../../../assets/images/ramp.jpg') },
		{ id: 6, title: '6.KORYTARZE', icon: require('../../../assets/images/corridors.jpg') },
		{ id: 7, title: '7.KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 8, title: '8.DZWIGI OSOBOWE PLATFORMY', icon: require('../../../assets/images/elevator.jpg') },
		{ id: 9, title: '9.WC DLA OzN', icon: require('../../../assets/images/wc.jpg') },
		{ id: 10, title: '10.INNE POMIESZCZENIA', icon: require('../../../assets/images/otherRooms.jpg') },
		{ id: 11, title: '11.OCHRONA PRZECIWPOŻAROWA', icon: require('../../../assets/images/fireproof.jpg') },
		{ id: 12, title: '12.INFORMACJE', icon: require('../../../assets/images/qa.png') },
	]

	useFocusEffect(
		React.useCallback(() => {
			const fetchId = async () => {
				// Nie ustawiamy już isLoading na true na początku,
				// ponieważ dane mogą być już wyświetlane.
				// Loader będzie kontrolowany przez stan początkowy.
				const id_storage = await retrieveId()
				let sourceData

				if (id_storage) {
					setCurrentId(id_storage)
					switch (id_storage) {
						case '4':
							sourceData = data_knn
							break
						case '2':
							sourceData = data_klatki
							break
						case '5':
							sourceData = data_basen
							break
						case '6':
						case '7':
						case '8':
						case '9':
						case '10':
							sourceData = data_general
							break
						case '11':
							sourceData = data_szkola
							break
						default:
							sourceData = data_default
							break
					}
				} else {
					sourceData = data_template
				}

				setTemplateData(sourceData[0])
				setCategoriesData(sourceData.slice(1))

				// Wyłączamy loader tylko wtedy, gdy był aktywny (czyli przy pierwszym ładowaniu)
				if (isLoading) {
					setIsLoading(false)
				}
			}

			fetchId()
		}, []) // Pusta tablica jest tu celowa, aby funkcja stworzyła się raz.
	)

	const handleCardPress = (id, title) => {
		const params = { id, title }
		if (id === 0) {
			router.push({ pathname: '/card-details/Template', params })
		} else {
			router.push({ pathname: '/card-details/DetailScreen', params })
		}
	}

	const renderCategoryCard = ({ item }) => (
		<TouchableOpacity
			onPress={() => handleCardPress(item.id, item.title)}
			className='bg-white rounded-2xl shadow-sm overflow-hidden mb-4 active:opacity-80 w-[48%]'>
			<Image source={item.icon} className='w-full h-28' resizeMode='cover' />
			<View className='p-3 justify-center' style={{ minHeight: 70 }}>
				<Text className='text-sm font-semibold text-gray-700 leading-tight text-center'>{item.title}</Text>
			</View>
		</TouchableOpacity>
	)

	if (isLoading) {
		return (
			<View className='flex-1 justify-center items-center min-h-[400px]'>
				<ActivityIndicator size='large' color='#3B82F6' />
				<Text className='mt-3 text-base text-gray-500'>Wczytywanie kategorii...</Text>
			</View>
		)
	}

	return (
		<View className='flex-1 mt-2 px-4'>
			{templateData && (
				<View className='mb-6 items-center'>
					<TouchableOpacity
						onPress={() => handleCardPress(templateData.id, templateData.title)}
						className='bg-white rounded-2xl shadow-md overflow-hidden active:opacity-80 w-full max-w-xs'>
						<Image source={templateData.icon} className='w-full h-36' resizeMode='cover' />
						<View className='p-4'>
							<Text className='text-lg font-bold text-slate-800 text-center'>{templateData.title}</Text>
						</View>
					</TouchableOpacity>
				</View>
			)}

			{categoriesData.length > 0 && (
				<>
					<View className='mb-4 flex-row items-center'>
						<Feather name='grid' size={22} color='#4A5568' />
						<Text className='text-xl font-bold text-gray-800 ml-2'>Wybierz kategorię</Text>
					</View>

					<FlatList
						data={categoriesData}
						renderItem={renderCategoryCard}
						keyExtractor={item => item.id.toString()}
						numColumns={2}
						showsVerticalScrollIndicator={false}
						contentContainerClassName='pb-24'
						columnWrapperClassName='justify-between'
					/>
				</>
			)}
		</View>
	)
}

export default Popularjobs
