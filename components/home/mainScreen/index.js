import { useState, useEffect } from 'react'
import { View, ScrollView, SafeAreaView, Text, StyleSheet } from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { COLORS, SIZES, icons, images } from '../constants'
import { GoogleLogin, Nearbyjobs, Popularjobs, ScreenHeaderBtn, Welcome } from '../components'
import * as SecureStore from 'expo-secure-store'

const Home = () => {
	const router = useRouter()
	const STORAGE_KEY = 'authToken'

	useEffect(() => {
		;(async () => {
			const token = await SecureStore.getItemAsync(STORAGE_KEY)
			if (!token) {
				router.push('Login')
			}
		})()
	}, [])

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: COLORS.lightWhite },
					headerShadowVisible: false,
					headerLeft: () => <ScreenHeaderBtn iconUrl={icons.menu} dimension='60%' />,
					headerRight: () => <ScreenHeaderBtn iconUrl={images.profile} dimension='100%' />,
					headerTitle: '',
				}}
			/>

			<View style={{ flex: 1, padding: SIZES.medium }}>
				<Welcome />
				<Popularjobs />
			</View>
		</SafeAreaView>
	)
}

export default Home

const styles = StyleSheet.create({})
