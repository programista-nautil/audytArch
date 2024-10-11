import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import styles from './popularjobs.style'
import { SIZES } from '../../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
	const navigation = useNavigation()
	const isFocused = useIsFocused()
	const [currentId, setCurrentId] = useState(null)
	const [data, setData] = useState([{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') }])

	const data_template = [{ id: 0, title: 'SZABLON', icon: require('../../../assets/images/szablon.png') }]

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

	useEffect(() => {
		const fetchId = async () => {
			const id_storage = await retrieveId()
			if (id_storage) {
				setCurrentId(id_storage)
				console.log('Current ID:', id_storage)

				if (id_storage === '2') {
					setData(data_klatki)
				} else {
					setData(data_default)
				}
			} else {
				setData(data_template)
			}
		}

		if (isFocused) {
			fetchId()
		}
	}, [isFocused])

	const handleCardPress = async (id, title) => {
		if (id === 0) {
			navigation.navigate(`card-details/Template`, { id: id, title: title })
		} else {
			navigation.navigate(`card-details/DetailScreen`, { id: id, title: title })
		}
	}

	const renderCard = ({ item }) => (
		<View style={[styles.cardContainer, { marginBottom: SIZES.large }]}>
			<TouchableOpacity onPress={() => handleCardPress(item.id, item.title)}>
				<Image source={item.icon} style={styles.icon} />
				<Text style={styles.headerTitle}>{item.title}</Text>
			</TouchableOpacity>
		</View>
	)

	return (
		<View style={{ marginBottom: 150 }}>
			<FlatList data={data} renderItem={renderCard} keyExtractor={item => item.id.toString()} />
		</View>
	)
}

export default Popularjobs
