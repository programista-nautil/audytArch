import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { SIZES } from '../../constants'
import { useRoute } from '@react-navigation/native';

const UniversalCard = () => {
	const route = useRoute()
	const { id, title, icon, data } = route.params

	return (
		<View style={[styles.cardContainer, { marginBottom: SIZES.large }]}>
			<Text style={styles.headerTitle}>{data.name}</Text>
			{data.map((item, index) => (
				<Text key={index}>{item}</Text>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	cardContainer: {
		// Styl dla kontenera karty
	},
	icon: {
		// Styl dla ikony
	},
	headerTitle: {
		// Styl dla tytułu
	},
})

export default UniversalCard
