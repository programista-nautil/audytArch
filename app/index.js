import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, AppRegistry, Text, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { PaperProvider } from 'react-native-paper'
import { COLORS, SIZES } from '../constants'
import Welcome from '../components/home/welcome/Welcome' // Załóżmy, że to jest poprawna ścieżka
import Popularjobs from '../components/home/popular/Popularjobs' // Załóżmy, że to jest poprawna ścieżka
import CameraScreen from '../components/home/camera/CameraScreen' // Załóżmy, że to jest poprawna ścieżka
import DetailScreen from '../components/home/detailScreen/DetailScreen' // Załóżmy, że to jest poprawna ścieżka

import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'

const Stack = createStackNavigator()

//remove header

Stack.Navigator.defaultProps = {
	headerMode: HomeScreen,
}

const HomeScreen = ({ route }) => {
	const [error, setError] = useState()
	const [userInfo, setUserInfo] = useState()

	useEffect(() => {
		GoogleSignin.configure({
			scopes: [
				'https://www.googleapis.com/auth/spreadsheets', // Do pracy z arkuszami
				'https://www.googleapis.com/auth/drive', // Pełny dostęp do Drive, jeśli potrzebny
			],
		})
	}, [])

	const signIn = async () => {
		try {
			await GoogleSignin.hasPlayServices()
			const user = await GoogleSignin.signIn()
			setUserInfo(user)
			setError()
		} catch (error) {
			setError(error)
		}
	}

	const logOut = async () => {
		try {
			setUserInfo()
			await GoogleSignin.revokeAccess()
			await GoogleSignin.signOut()
			setError()
		} catch (error) {
			setError(error)
		}
	}
	return (
		<PaperProvider>
			<SafeAreaView style={styles.container}>
				<Text>{JSON.stringify(error)}</Text>
				{userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
				{userInfo ? (
					<TouchableOpacity onPress={logOut}>
						<Text>Wyloguj</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity onPress={signIn}>
						<Text>Zaloguj się</Text>
					</TouchableOpacity>
				)}
				<Welcome />
				<Popularjobs />
				{/* Inne komponenty, które chcesz umieścić na ekranie głównym */}
			</SafeAreaView>
		</PaperProvider>
	)
}

const HomeStackNavigator = () => (
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
		<Stack.Screen
			name='DetailScreen'
			component={DetailScreen}
			options={({ route }) => ({ title: route.params.title })}
		/>
		{/* Tutaj możesz dodać inne ekrany, które chcesz umieścić w stosie nawigacyjnym */}
	</Stack.Navigator>
)

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
