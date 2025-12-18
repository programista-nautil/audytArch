import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useOfflineQueue } from '../hooks/useOfflineQueue'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { executeUpload } from '../services/googleSheets'

const SyncScreen = () => {
	const { queue, isOnline, removeItem, loadQueue } = useOfflineQueue()
	const [isSyncing, setIsSyncing] = useState(false)
	const router = useRouter()

	const handleSyncAll = async () => {
		if (!isOnline) {
			Alert.alert('Brak sieci', 'Nie możesz synchronizować bez połączenia.')
			return
		}

		setIsSyncing(true)
		try {
			const tokens = await GoogleSignin.getTokens()

			// Przetwarzamy kolejkę po kolei
			// Robimy kopię kolejki, aby uniknąć problemów z mutacją podczas pętli
			const queueToProcess = [...queue]

			for (const item of queueToProcess) {
				try {
					// Wywołujemy serwis dla każdego elementu z kolejki
					await executeUpload(item.data, tokens.accessToken)
					// Jeśli się udało - usuwamy z AsyncStorage
					await removeItem(item.id)
				} catch (e) {
					console.error(`Błąd synchronizacji elementu ${item.id}:`, e)
					// Jeśli jeden element zawiedzie, przechodzimy do następnego
					// Możesz tu dodać Alert, jeśli błąd jest krytyczny
				}
			}

			Alert.alert('Synchronizacja', 'Zakończono przetwarzanie kolejki.')
		} catch (error) {
			Alert.alert('Błąd', 'Wystąpił nieoczekiwany błąd podczas synchronizacji.')
		} finally {
			setIsSyncing(false)
			loadQueue() // Odśwież widok listy
		}
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
					renderItem={({ item }) => (
						<View className='bg-white p-4 rounded-lg mb-2 shadow-sm flex-row justify-between items-center border border-gray-200'>
							<View className='flex-1'>
								<Text className='font-bold text-gray-800'>{item.data.sheetName}</Text>
								<Text className='text-xs text-gray-500'>Dodano: {new Date(item.timestamp).toLocaleString()}</Text>
							</View>
							<TouchableOpacity onPress={() => removeItem(item.id)}>
								<Feather name='trash-2' size={20} color='#EF4444' />
							</TouchableOpacity>
						</View>
					)}
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
