import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'

export const QUEUE_STORAGE_KEY = '@Audit_Offline_Queue'

export const useOfflineQueue = () => {
	const [queue, setQueue] = useState([])
	const [isOnline, setIsOnline] = useState(true)

	// Ładowanie kolejki z pamięci
	const loadQueue = useCallback(async () => {
		try {
			const data = await AsyncStorage.getItem(QUEUE_STORAGE_KEY)
			const parsed = data ? JSON.parse(data) : []
			setQueue(parsed)
			return parsed
		} catch (e) {
			console.error('Błąd ładowania kolejki:', e)
			return []
		}
	}, [])

	useEffect(() => {
		loadQueue()
		const unsubscribe = NetInfo.addEventListener(state => {
			setIsOnline(!!(state.isConnected && state.isInternetReachable))
		})
		return () => unsubscribe()
	}, [loadQueue])

	// BEZPIECZNE DODAWANIE: Czyta z dysku, dodaje, zapisuje
	const addToQueue = async itemData => {
		try {
			console.log('--- START DODAWANIA DO KOLEJKI ---')
			const currentData = await AsyncStorage.getItem(QUEUE_STORAGE_KEY)
			const currentQueue = currentData ? JSON.parse(currentData) : []

			const newItem = {
				id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
				data: itemData, // Tutaj trafia nasz payload
				timestamp: new Date().toISOString(),
			}

			const updatedQueue = [...currentQueue, newItem]
			await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue))

			setQueue(updatedQueue)
			console.log('--- SUKCES: Zapisano w AsyncStorage. Liczba zadań:', updatedQueue.length)
			return true
		} catch (e) {
			console.error('--- BŁĄD KRYTYCZNY KOLEJKI ---', e)
			return false
		}
	}

	const removeItem = async id => {
		const currentData = await AsyncStorage.getItem(QUEUE_STORAGE_KEY)
		const currentQueue = currentData ? JSON.parse(currentData) : []
		const updatedQueue = currentQueue.filter(item => item.id !== id)

		await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue))
		setQueue(updatedQueue)
	}

	return { queue, isOnline, addToQueue, removeItem, loadQueue, count: queue.length }
}
