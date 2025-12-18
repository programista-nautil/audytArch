import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import Welcome from '../components/home/welcome/Welcome'
import Popularjobs from '../components/home/popular/Popularjobs'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { useRouter } from 'expo-router'
import { useOfflineQueue } from '../hooks/useOfflineQueue'

const HomeScreen = () => {
	const router = useRouter()
	const { count } = useOfflineQueue()
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
		<SafeAreaView className='flex-1 bg-gray-50'>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: '#FEFEFE' },
					headerShadowVisible: false,
					headerTitle: 'Audyt Architektoniczny',
					headerTitleAlign: 'center',
					headerRight: () => (
						<TouchableOpacity onPress={() => router.push('/sync')} className='mr-4 p-2 relative'>
							<Feather name='refresh-cw' size={24} color={count > 0 ? '#3B82F6' : '#9CA3AF'} />
							{count > 0 && (
								<View className='absolute top-0 right-0 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center border-2 border-white'>
									<Text className='text-white text-[10px] font-bold'>{count}</Text>
								</View>
							)}
						</TouchableOpacity>
					),
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
							// --- PANEL ZALOGOWANEGO UŻYTKOWNIKA ---
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
							// --- PANEL LOGOWANIA ---
							<View className='bg-white p-6 rounded-xl shadow-md mb-6 items-center border border-gray-200'>
								<GoogleSigninButton
									size={GoogleSigninButton.Size.Wide}
									color={GoogleSigninButton.Color.Dark}
									onPress={signIn}
								/>
							</View>
						)}

						{/* Komunikat o błędzie */}
						{error && (
							<View className='bg-red-100 border border-red-300 p-4 rounded-lg flex-row items-center mb-6'>
								<Feather name='alert-triangle' size={24} color='#DC2626' />
								<Text className='text-red-800 ml-3 flex-1'>Wystąpił błąd logowania. Spróbuj ponownie.</Text>
							</View>
						)}

						{/* Reszta komponentów */}
						<Welcome />
						<Popularjobs />
					</View>
				)}
			/>
		</SafeAreaView>
	)
}

export default HomeScreen
