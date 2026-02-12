import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import * as Location from 'expo-location'
import { Feather } from '@expo/vector-icons'

const LocationFetcher = ({ onLocationFound }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [displayLocation, setDisplayLocation] = useState(null)

	const getLocation = async () => {
		setIsLoading(true)
		try {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				Alert.alert('Brak zgody', 'Aplikacja potrzebuje dostępu do lokalizacji.')
				setIsLoading(false)
				return
			}

			let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })

			const { latitude, longitude } = location.coords
			const coordsStr = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`

			let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude })

			let readableAddress = coordsStr

			if (addressResponse.length > 0) {
				const addr = addressResponse[0]

				const streetPart = [addr.street, addr.streetNumber].filter(Boolean).join(' ')

				if (streetPart.trim().length > 0) {
					readableAddress = streetPart
				} else if (addr.city) {
					readableAddress = addr.city
				}
			}

			setDisplayLocation(readableAddress)

			onLocationFound(coordsStr)
		} catch (error) {
			console.error(error)
			Alert.alert('Błąd', 'Nie udało się pobrać lokalizacji.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<View className='mb-2 flex-row items-center'>
			<TouchableOpacity
				onPress={getLocation}
				disabled={isLoading}
				className={`flex-row items-center px-3 py-2 rounded-lg border ${displayLocation ? 'bg-green-50 border-green-200' : 'bg-white border-blue-200'}`}>
				{isLoading ? (
					<ActivityIndicator size='small' color='#3B82F6' />
				) : (
					<Feather
						name={displayLocation ? 'map-pin' : 'navigation'}
						size={16}
						color={displayLocation ? '#16A34A' : '#3B82F6'}
					/>
				)}

				<Text className={`ml-2 font-semibold ${displayLocation ? 'text-green-700' : 'text-blue-600'}`}>
					{isLoading
						? 'Szukanie adresu...'
						: displayLocation
							? `Zaktualizuj (${displayLocation})`
							: 'Dodaj lokalizację GPS'}
				</Text>
			</TouchableOpacity>
		</View>
	)
}

export default LocationFetcher
