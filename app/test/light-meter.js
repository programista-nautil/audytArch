import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, ScrollView, SafeAreaView, Platform, Alert } from 'react-native'
import { LightSensor } from 'expo-sensors'
import { Stack } from 'expo-router'
import MeasurementRecorder from '../../components/home/tools/MeasurementRecorder'

const LightMeterScreen = () => {
	// Stan sensora
	const [{ illuminance }, setData] = useState({ illuminance: 0 })
	const [isActive, setIsActive] = useState(false)
	const [isAvailable, setIsAvailable] = useState(false)

	useEffect(() => {
		async function checkAvailability() {
			const isSensorAvailable = await LightSensor.isAvailableAsync()
			setIsAvailable(isSensorAvailable)
			if (!isSensorAvailable && Platform.OS !== 'web') {
				Alert.alert('Błąd', 'Brak czujnika światła w urządzeniu.')
			}
		}
		checkAvailability()
	}, [])

	// 2. Obsługa sensora
	useEffect(() => {
		let subscription = null
		if (isActive && isAvailable) {
			LightSensor.setUpdateInterval(200)
			subscription = LightSensor.addListener(setData)
		} else {
			subscription && subscription.remove()
		}
		return () => subscription && subscription.remove()
	}, [isActive, isAvailable])

	// Callbacki sterujące
	const startMeasurement = useCallback(() => setIsActive(true), [])
	const stopMeasurement = useCallback(() => setIsActive(false), [])

	// Helper do interpretacji wyników (UX)
	const getLightLevelDescription = lux => {
		// Poniżej 50lx: Zagrożenie bezpieczeństwa w miejscach publicznych
		if (lux < 50)
			return {
				text: 'Niedostateczne / Strefa magazynowa',
				color: 'text-red-600', // Czerwony ostrzegawczy
			}

		// 50-150lx: Minimum dla korytarzy (często spotykane, ale 'na styk')
		if (lux < 150)
			return {
				text: 'Ciąg komunikacyjny / Korytarz',
				color: 'text-orange-600',
			}

		// 150-300lx: Dobre oświetlenie ogólne (schody, hole)
		if (lux < 300)
			return {
				text: 'Hol / Schody / Poczekalnia',
				color: 'text-yellow-600',
			}

		// 300-750lx: Standard pracy biurowej i obsługi klienta
		if (lux < 750)
			return {
				text: 'Biuro / Recepcja / Czytanie',
				color: 'text-green-600', // Zielony - optymalne do zadań wzrokowych
			}

		// 750-2000lx: Praca wymagająca skupienia
		if (lux < 2000)
			return {
				text: 'Praca precyzyjna / Bardzo jasne',
				color: 'text-blue-600',
			}

		// Powyżej 2000lx: Zazwyczaj światło dzienne wpadające przez okno
		return {
			text: 'Światło dzienne / Silne operacyjne',
			color: 'text-indigo-600',
		}
	}

	const levelInfo = getLightLevelDescription(illuminance)

	return (
		<SafeAreaView className='flex-1 bg-gray-50'>
			<Stack.Screen options={{ headerTitle: 'Luksomierz', headerTitleAlign: 'center' }} />

			<ScrollView contentContainerStyle={{ padding: 20 }}>
				{/* Używamy naszego super komponentu */}
				<MeasurementRecorder
					title='Lux'
					value={illuminance}
					unit='lx'
					iconName='sun'
					levelInfo={levelInfo}
					isActive={isActive}
					onStart={startMeasurement}
					onStop={stopMeasurement}
				/>
			</ScrollView>
		</SafeAreaView>
	)
}

export default LightMeterScreen
