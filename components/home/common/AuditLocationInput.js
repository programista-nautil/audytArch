import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import * as Location from 'expo-location'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const AuditLocationInput = () => {
	const [address, setAddress] = useState('')
	const [gpsTag, setGpsTag] = useState(null)
	const [isLoadingLoc, setIsLoadingLoc] = useState(false)
	const [isSending, setIsSending] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const handleGetLocation = async () => {
		setIsLoadingLoc(true)
		setIsSuccess(false)
		try {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				Alert.alert('Brak zgody', 'Aplikacja potrzebuje dostępu do lokalizacji.')
				return
			}

			// 1. GPS
			let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
			const { latitude, longitude } = location.coords

			const newGpsTag = `[GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`
			setGpsTag(newGpsTag)

			let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude })

			if (addressResponse.length > 0) {
				const addr = addressResponse[0]
				const streetPart = [addr.street, addr.streetNumber].filter(Boolean).join(' ')
				const cityPart = [addr.postalCode, addr.city].filter(Boolean).join(' ')
				const fullAddr = [streetPart, cityPart].filter(Boolean).join(', ')

				setAddress(fullAddr)
			} else {
				setAddress(`${latitude}, ${longitude}`)
			}
		} catch (error) {
			console.error(error)
			Alert.alert('Błąd', 'Nie udało się pobrać adresu.')
		} finally {
			setIsLoadingLoc(false)
		}
	}

	const handleSendToSheet = async () => {
		if (!address.trim()) return

		setIsSending(true)
		try {
			const spreadsheetId = await AsyncStorage.getItem('@CopiedTemplateId')
			if (!spreadsheetId) {
				Alert.alert('Błąd', 'Nie wybrano audytu. Wejdź najpierw w szczegóły audytu, aby pobrać ID.')
				return
			}

			const finalValue = gpsTag ? `${address} ${gpsTag}` : address

			const token = (await GoogleSignin.getTokens()).accessToken
			const range = "'0. Podstawowe dane'!C31"

			const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`

			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					values: [[finalValue]],
				}),
			})

			if (response.ok) {
				setIsSuccess(true)

				setTimeout(() => setIsSuccess(false), 3000)
			} else {
				throw new Error('Błąd API Google Sheets')
			}
		} catch (error) {
			console.error(error)
			Alert.alert('Błąd wysyłania', 'Nie udało się zapisać adresu w arkuszu.')
		} finally {
			setIsSending(false)
			setAddress('')
			setGpsTag(null)
		}
	}

	return (
		<View className='mx-4 mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-200'>
			<Text className='text-xs font-bold text-gray-500 mb-2 uppercase ml-1'>Lokalizacja Audytu (Do Raportu)</Text>

			<View className='flex-row gap-2'>
				{/* INPUT ADRESU */}
				<View className='flex-1 justify-center'>
					<TextInput
						className='bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm h-10'
						placeholder='Ulica, Miasto...'
						value={address}
						onChangeText={text => {
							setAddress(text)
							setIsSuccess(false)
						}}
					/>
				</View>

				{/* PRZYCISK POBIERANIA GPS */}
				<TouchableOpacity
					onPress={handleGetLocation}
					disabled={isLoadingLoc}
					className='w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg items-center justify-center'>
					{isLoadingLoc ? (
						<ActivityIndicator size='small' color='#3B82F6' />
					) : (
						<Feather name='map-pin' size={18} color='#3B82F6' />
					)}
				</TouchableOpacity>

				{/* PRZYCISK WYSYŁANIA */}
				<TouchableOpacity
					onPress={handleSendToSheet}
					disabled={isSending || !address}
					className={`w-10 h-10 rounded-lg items-center justify-center ${isSuccess ? 'bg-green-500 border-green-600' : 'bg-blue-600 border-blue-700'}`}>
					{isSending ? (
						<ActivityIndicator size='small' color='white' />
					) : (
						<Feather name={isSuccess ? 'check' : 'send'} size={18} color='white' />
					)}
				</TouchableOpacity>
			</View>

			{isSuccess && <Text className='text-xs text-green-600 mt-1 ml-1 font-medium'>Zapisano w arkuszu!</Text>}
		</View>
	)
}

export default AuditLocationInput
