import React from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import styles from './popularjobs.style'
import { SIZES } from '../../../constants'

const Popularjobs = () => {
	const navigation = useNavigation()

	const data = [
		{ id: 1, title: '1.OTOCZENIE ZEWNĘTRZNE', icon: require('../../../assets/images/zew.png') },
		{ id: 2, title: '2.PARKING DLA ONZ', icon: require('../../../assets/images/parking.jpg') },
		{ id: 3, title: '3.STREFA WEJŚCIA', icon: require('../../../assets/images/strefaWej.jpg') },
		{ id: 4, title: '4.POCHYLNIE', icon: require('../../../assets/images/ramp.jpg') },
		{ id: 5, title: '5.DOMOFON', icon: require('../../../assets/images/domofon.jpg') },
		{ id: 6, title: '6.RECEPCJA', icon: require('../../../assets/images/reception.jpg') },
		{ id: 7, title: '7.KORYTARZE', icon: require('../../../assets/images/corridors.jpg') },
		{ id: 8, title: '8.KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
		{ id: 9, title: '9.DŹWIGI OSOBOWE + PLATFORMY ', icon: require('../../../assets/images/elevator.jpg') },
		{ id: 10, title: '10.WC', icon: require('../../../assets/images/wc.jpg') },
		{ id: 11, title: '11.POKOJE RODZICA Z DZIECKIEM', icon: require('../../../assets/images/parentChildren.jpg') },
		{ id: 12, title: '12.INNE POMIESZCZENIA', icon: require('../../../assets/images/otherRooms.jpg') },
		{ id: 13, title: '13.DRZWI WEWNĘTRZNE', icon: require('../../../assets/images/drzwiwew.jpg') },
		{ id: 14, title: '14.OCHRONA PRZECIWPOŻAROWA', icon: require('../../../assets/images/fireproof.jpg') },
		{ id: 15, title: '15.INFORMACJE', icon: require('../../../assets/images/information.jpg') },
		{ id: 16, title: '16.MATERIAŁY WYKOŃCZENIOWE', icon: require('../../../assets/images/materialywyk.jpg') },
	]

	const handleCardPress = (id, title) => {
		navigation.navigate(`card-details/${id}`, {title}) // Przenoszenie na nowy ekran o nazwie 'CardDetails'
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
		<View style={{ marginBottom: 50 }}>
			<FlatList data={data} renderItem={renderCard} keyExtractor={item => item.id.toString()} />
		</View>
	)
}

export default Popularjobs
