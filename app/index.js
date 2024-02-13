import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, AppRegistry, Text, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { PaperProvider } from 'react-native-paper'
import { COLORS, SIZES } from '../constants'
import Welcome from '../components/home/welcome/Welcome' // Załóżmy, że to jest poprawna ścieżka
import Popularjobs from '../components/home/popular/Popularjobs' // Załóżmy, że to jest poprawna ścieżka
import CameraScreen from '../components/home/camera/CameraScreen' // Załóżmy, że to jest poprawna ścieżka

const Stack = createStackNavigator()


const HomeScreen = () => {

	return (
		<PaperProvider>
			<SafeAreaView style={styles.container}>
			<View >

			</View>
				<Welcome />
				<Popularjobs />
				{/* Inne komponenty, które chcesz umieścić na ekranie głównym */}
			</SafeAreaView>
		</PaperProvider>
	)
}

const HomeStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='Audyt Architektoniczny'
				component={HomeScreen}
				options={{
					headerStyle: { backgroundColor: COLORS.lightWhite },
					headerShadowVisible: false,
					// Dodaj tutaj inne opcje dla nagłówka, jeśli potrzebujesz
				}}
			/>
			<Stack.Screen name='CameraScreen' component={CameraScreen} />
			<Stack.Screen
				name='Popularjobs'
				component={Popularjobs}
				options={{
					title: 'Popular Jobs',
					// Dodaj tutaj inne opcje dla nagłówka, jeśli potrzebujesz
				}}
			/>
			{/* Tutaj możesz dodać inne ekrany, które chcesz umieścić w stosie nawigacyjnym */}
		</Stack.Navigator>
	)
}

export default HomeStackNavigator

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.lightWhite,
		alignItems: 'center',
		justifyContent: 'center',
		padding: SIZES.medium,
		paddingTop: 40,
	},
})
