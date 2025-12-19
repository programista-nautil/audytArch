import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native'
import { Stack, useFocusEffect } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useOfflineQueue } from '../hooks/useOfflineQueue'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { executeUpload } from '../services/googleSheets'
import { uploadPhotoService } from '../services/googleDrive'

const SyncScreen = () => {
	const { queue, isOnline, removeItem, loadQueue } = useOfflineQueue()
	const [isSyncing, setIsSyncing] = useState(false)
	const [currentSyncItem, setCurrentSyncItem] = useState(null)

	// Teraz useFocusEffect zadziała poprawnie, bo jest pobrany z expo-router
	useFocusEffect(
		useCallback(() => {
			console.log('Otwarto ekran synchronizacji, odświeżam kolejkę...')
			loadQueue()
		}, [loadQueue])
	)

	const handleSyncAll = async () => {
		if (!isOnline) {
			Alert.alert('Brak sieci', 'Nie możesz synchronizować bez połączenia.')
			return
		}

		setIsSyncing(true)
		const tokens = await GoogleSignin.getTokens()
		const queueToProcess = [...queue]

		let successCount = 0
		let failCount = 0
		for (const item of queueToProcess) {
			setCurrentSyncItem(item.id) // Podświetlamy aktualny element (opcjonalnie)
			try {
				// --- LOGIKA ROZRÓŻNIANIA ---
				if (item.data.type === 'photo') {
					// To jest zdjęcie
					await uploadPhotoService(tokens.accessToken, item.data.uri, item.data.folderId, item.data.name)
				} else {
					// To jest arkusz (zakładamy domyślnie, lub sprawdzamy type === 'sheet')
					await executeUpload(item.data, tokens.accessToken)
				}

				await removeItem(item.id)
				successCount++
			} catch (e) {
				console.error(`Błąd synchronizacji elementu ${item.id}:`, e)
				failCount++
			}
		}

		setIsSyncing(false)
		setCurrentSyncItem(null)
		loadQueue()

		Alert.alert('Raport synchronizacji', `Sukces: ${successCount}\nBłędy: ${failCount}`)
	}

	const renderItem = ({ item }) => {
		const isPhoto = item.data.type === 'photo'

		return (
			<View className='bg-white p-4 rounded-lg mb-2 shadow-sm flex-row justify-between items-center border border-gray-200'>
				{/* Ikona typu */}
				<View className={`p-3 rounded-full mr-3 ${isPhoto ? 'bg-purple-100' : 'bg-blue-100'}`}>
					<Feather name={isPhoto ? 'image' : 'file-text'} size={24} color={isPhoto ? '#9333EA' : '#2563EB'} />
				</View>

				<View className='flex-1'>
					<Text className='font-bold text-gray-800' numberOfLines={1}>
						{isPhoto ? `Zdjęcie: ${item.data.name}` : `Audyt: ${item.data.sheetName}`}
					</Text>

					<Text className='text-xs text-gray-500 mt-1'>{new Date(item.timestamp).toLocaleString()}</Text>

					{/* Jeśli to zdjęcie, możemy pokazać podgląd ścieżki lub miniaturkę jeśli chcesz */}
					{isPhoto && (
						<Text className='text-[10px] text-gray-400' numberOfLines={1}>
							{item.data.uri.split('/').pop()}
						</Text>
					)}
				</View>

				{/* Status lub Kosz */}
				{isSyncing && currentSyncItem === item.id ? (
					<ActivityIndicator size='small' color='#3B82F6' />
				) : (
					<TouchableOpacity onPress={() => removeItem(item.id)} className='p-2'>
						<Feather name='trash-2' size={20} color='#EF4444' />
					</TouchableOpacity>
				)}
			</View>
		)
	}

	return (
		<SafeAreaView className='flex-1 bg-gray-100'>
			<Stack.Screen options={{ headerTitle: 'Synchronizacja Offline', headerTitleAlign: 'center' }} />

			<View className='p-4 flex-1'>
				<View className={`p-4 rounded-xl mb-4 flex-row items-center ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
					<Feather name={isOnline ? 'wifi' : 'wifi-off'} size={20} color={isOnline ? 'green' : 'red'} />
					<Text className={`ml-3 font-bold ${isOnline ? 'text-green-800' : 'text-red-800'}`}>
						Status: {isOnline ? 'Online' : 'Offline (Synchronizacja niemożliwa)'}
					</Text>
				</View>

				<FlatList
					data={queue}
					keyExtractor={item => item.id}
					ListEmptyComponent={
						<View className='items-center mt-20'>
							<Feather name='check-circle' size={50} color='#10B981' />
							<Text className='text-gray-500 mt-4'>Wszystkie dane są zsynchronizowane!</Text>
						</View>
					}
					renderItem={renderItem}
				/>

				{queue.length > 0 && (
					<TouchableOpacity
						onPress={handleSyncAll}
						disabled={isSyncing || !isOnline}
						className={`h-14 rounded-full flex-row items-center justify-center shadow-lg ${isOnline ? 'bg-blue-600' : 'bg-gray-400'}`}>
						{isSyncing ? (
							<ActivityIndicator color='white' />
						) : (
							<>
								<Feather name='upload-cloud' size={20} color='white' />
								<Text className='text-white text-lg font-bold ml-3'>SYNCHRONIZUJ TERAZ ({queue.length})</Text>
							</>
						)}
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	)
}

export default SyncScreen
