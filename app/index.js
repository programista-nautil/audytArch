import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Stack, useRouter, useFocusEffect } from 'expo-router'
import Welcome from '../components/home/welcome/Welcome'
import Popularjobs from '../components/home/popular/Popularjobs'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { useOfflineQueue } from '../hooks/useOfflineQueue'

const HomeScreen = () => {
	const router = useRouter()
	// 1. Dodano 'count' do destrukturyzacji
	const { queue, isOnline, loadQueue, count } = useOfflineQueue()
	const [error, setError] = useState()
	const [userInfo, setUserInfo] = useState()

	// 2. Odświeżanie kolejki przy każdym powrocie na ekran (Focus)
	useFocusEffect(
		useCallback(() => {
			loadQueue()
		}, []),
	)

	useEffect(() => {
		if (isOnline && count > 0) {
			console.log('Wykryto powrót sieci! Masz zadania w kolejce:', count)
			// Możesz tutaj odkomentować, jeśli chcesz automatyczny Alert
			Alert.alert('Sieć dostępna', `Masz ${count} oczekujących zadań do wysłania.`)
		}
	}, [isOnline, count])

	useEffect(() => {
		GoogleSignin.configure({
			scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
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
		<SafeAreaView className='flex-1 bg-gray-50'>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: '#FEFEFE' },
					headerShadowVisible: false,
					headerTitle: 'Audyt Architektoniczny',
					headerTitleAlign: 'center',
				}}
			/>

			<FlatList
				data={[]}
				keyExtractor={item => `main-item-${item}`}
				renderItem={null}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={() => (
					<View className='flex-1 p-4'>
						{userInfo ? (
							<View className='bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200'>
								<View className='flex-row items-center'>
									{userInfo.user.photo && (
										<Image source={{ uri: userInfo.user.photo }} className='w-14 h-14 rounded-full' />
									)}
									<View className='ml-4 flex-1'>
										<Text className='text-lg font-bold text-gray-800' numberOfLines={1}>
											{userInfo.user.name}
										</Text>
										<Text className='text-gray-500' numberOfLines={1}>
											{userInfo.user.email}
										</Text>
									</View>
								</View>
								<TouchableOpacity
									onPress={logOut}
									className='mt-4 bg-red-500 active:bg-red-600 py-3 px-4 rounded-lg flex-row justify-center items-center'>
									<Feather name='log-out' size={18} color='white' />
									<Text className='text-white text-center font-bold ml-2'>Wyloguj się</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View className='bg-white p-6 rounded-xl shadow-md mb-6 items-center border border-gray-200'>
								<GoogleSigninButton
									size={GoogleSigninButton.Size.Wide}
									color={GoogleSigninButton.Color.Dark}
									onPress={signIn}
								/>
							</View>
						)}

						{/* --- NOWY ELEMENT: POWIADOMIENIE O SYNCHRONIZACJI --- */}
						{count > 0 && (
							<TouchableOpacity
								onPress={() => router.push('/sync')}
								className={`mb-6 p-4 rounded-xl flex-row items-center justify-between ${isOnline ? 'bg-blue-50 border border-blue-200' : 'bg-orange-50 border border-orange-200'}`}>
								<View className='flex-row items-center flex-1'>
									<Feather
										name={isOnline ? 'cloud-off' : 'wifi-off'}
										size={20}
										color={isOnline ? '#3B82F6' : '#F59E0B'}
									/>
									<Text className={`ml-3 font-semibold ${isOnline ? 'text-blue-800' : 'text-orange-800'}`}>
										{isOnline ? `Masz ${count} zadania do synchronizacji` : `Oczekiwanie na sieć (${count} w kolejce)`}
									</Text>
								</View>
								<Feather name='chevron-right' size={20} color={isOnline ? '#3B82F6' : '#F59E0B'} />
							</TouchableOpacity>
						)}

						{error && (
							<View className='bg-red-100 border border-red-300 p-4 rounded-lg flex-row items-center mb-6'>
								<Feather name='alert-triangle' size={24} color='#DC2626' />
								<Text className='text-red-800 ml-3 flex-1'>Wystąpił błąd logowania. Spróbuj ponownie.</Text>
							</View>
						)}

						<Welcome />
						<Popularjobs />
						<TouchableOpacity
							onPress={() => router.push('/test/light-meter')}
							className='mx-4 mt-2 mb-6 bg-purple-600 p-4 rounded-xl shadow-md flex-row items-center justify-between'>
							<View className='flex-row items-center'>
								<View className='bg-white/20 p-2 rounded-lg'>
									<Feather name='tool' size={24} color='white' />
								</View>
								<View className='ml-3'>
									<Text className='text-white font-bold text-lg'>Narzędzia Pomiarowe</Text>
									<Text className='text-purple-100 text-xs'>Luksomierz i testy sensorów</Text>
								</View>
							</View>
							<Feather name='chevron-right' size={24} color='white' />
						</TouchableOpacity>
					</View>
				)}
			/>
		</SafeAreaView>
	)
}

export default HomeScreen
