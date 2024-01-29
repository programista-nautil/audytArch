import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, Button, Text, Linking } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as SecureStore from 'expo-secure-store'
import Popularjobs from '../popular/Popularjobs'

import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

const LoginScreen = () => {
	const [errorInfo, setErrorInfo] = useState('')
	const [accessToken, setAccessToken] = useState(null)
	const [userInfo, setUserInfo] = useState(null)

	const STORAGE_KEY = 'authToken'
	const navigation = useNavigation()

	useEffect(() => {
		const handleInitialURL = async () => {
			const initialURL = await Linking.getInitialURL()
			if (initialURL) handleDeepLink({ url: initialURL })
		}

		handleInitialURL()

		Linking.addEventListener('url', handleDeepLink)
		return () => {
			Linking.removeEventListener('url', handleDeepLink)
		}
	}, [])
	const parseUrl = url => {
		// Uwzględnienie liter wielkich, cyfr oraz "-" i "_" w części ścieżki i schematu
		const pattern = /^([a-zA-Z0-9_-]+):\/\/([a-zA-Z0-9_-]+)\??(.*)$/
		const match = url.match(pattern)
		if (match) {
			const [, scheme, path, queryString] = match
			const queryParams = queryString.split('&').reduce((acc, param) => {
				const [key, value] = param.split('=')
				acc[key] = decodeURIComponent(value)
				return acc
			}, {})
			console.log({ scheme, path, queryParams })
			return { scheme, path, queryParams }
		} else {
			console.log('No match for URL:', url)
			return null
		}
	}

	const handleDeepLink = event => {
		console.log('Received deep link event:', event.url)
		let data = parseUrl(event.url)
		console.log('Parsed data:', data)
		if (data && data.queryParams && data.queryParams.access_token) {
			console.log('Access token received:', data.queryParams.access_token)
			const token = data.queryParams.access_token
			setAccessToken(token)
			saveAuthToken(token)
			fetchUserInfo(token)
			navigation.navigate('Popularjobs')
		}
	}

	const fetchUserInfo = async token => {
		try {
			const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
				headers: { Authorization: `Bearer ${token}` },
			})
			const userData = await response.json()
			setUserInfo(userData)
			console.log({ user: userData })
		} catch (error) {
			console.error('Błąd podczas pobierania danych użytkownika:', error)
		}
	}

	const handleLogin = async () => {
		let result = await WebBrowser.openBrowserAsync('https://damian.nautil.info/googleGalleryApi/authorize')
		if (result.type === 'cancel') {
			setErrorInfo('Logowanie anulowane przez użytkownika')
		}
	}

	const saveAuthToken = async token => {
		try {
			await SecureStore.setItemAsync(STORAGE_KEY, token)
		} catch (error) {
			console.log('Błąd podczas zapisywania tokenu uwierzytelniającego:', error)
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
			<View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ fontSize: 20, marginBottom: 20 }}>Zaloguj się, aby kontynuować</Text>
				<Button title='Zaloguj się przez Google' onPress={handleLogin} />
				{errorInfo ? <Text style={{ color: 'red' }}>{errorInfo}</Text> : null}
			</View>
		</SafeAreaView>
	)
}

export default LoginScreen
