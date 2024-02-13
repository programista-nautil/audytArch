import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import { useRouter } from 'expo-router'

import styles from './welcome.style'
import { icons, SIZES } from '../../../constants'
const jobsTypes = []



const Welcome = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.welcomeMessage}>Uzupełnij wszystkie dane:</Text>
			
		</View>
	)
}

export default Welcome
