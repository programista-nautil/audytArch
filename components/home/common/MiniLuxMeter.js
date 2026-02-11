import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native'
import { LightSensor } from 'expo-sensors'
import { Feather } from '@expo/vector-icons'

const MiniLuxMeter = ({ onSave, initialValue }) => {
	const [{ illuminance }, setData] = useState({ illuminance: 0 })
	const [isActive, setIsActive] = useState(false)
	const [savedValue, setSavedValue] = useState(initialValue || null)

	// Obsługa sensora
	useEffect(() => {
		let subscription = null
		if (isActive) {
			LightSensor.setUpdateInterval(500) // Odświeżanie co 0.5s wystarczy
			subscription = LightSensor.addListener(setData)
		} else {
			subscription && subscription.remove()
		}
		return () => subscription && subscription.remove()
	}, [isActive])

	const handleToggle = async () => {
		if (!isActive) {
			const isAvailable = await LightSensor.isAvailableAsync()
			if (!isAvailable && Platform.OS !== 'web') {
				Alert.alert('Błąd', 'Brak czujnika światła.')
				return
			}
		}
		setIsActive(!isActive)
	}

	const handleSave = () => {
		const val = Math.round(illuminance)
		setSavedValue(val)
		setIsActive(false)
		if (onSave) onSave(val)
	}

	return (
		<View className='mt-2 mb-4 bg-white p-3 rounded-lg border border-orange-200 flex-row items-center justify-between shadow-sm'>
			{/* LEWA STRONA: WYNIK */}
			<View className='flex-row items-center'>
				<View className={`p-2 rounded-full mr-3 ${isActive ? 'bg-orange-100' : 'bg-gray-100'}`}>
					<Feather name='sun' size={20} color={isActive ? '#F59E0B' : '#9CA3AF'} />
				</View>
				<View>
					<Text className='text-xs text-gray-500 uppercase font-bold'>Natężenie</Text>
					<Text className='text-xl font-bold text-gray-800'>
						{isActive ? Math.round(illuminance) : savedValue || '-'}{' '}
						<Text className='text-sm font-normal text-gray-500'>lx</Text>
					</Text>
				</View>
			</View>

			{/* PRAWA STRONA: PRZYCISKI */}
			<View className='flex-row gap-2'>
				<TouchableOpacity
					onPress={handleToggle}
					className={`px-4 py-2 rounded-md border ${isActive ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
					<Text className={`font-bold ${isActive ? 'text-red-700' : 'text-green-700'}`}>
						{isActive ? 'STOP' : 'ZMIERZ'}
					</Text>
				</TouchableOpacity>

				{isActive && (
					<TouchableOpacity onPress={handleSave} className='px-4 py-2 rounded-md bg-blue-600 border border-blue-600'>
						<Text className='font-bold text-white'>UŻYJ</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	)
}

export default MiniLuxMeter
