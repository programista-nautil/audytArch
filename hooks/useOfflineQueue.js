import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'

export const QUEUE_STORAGE_KEY = '@Audit_Offline_Queue'

export const useOfflineQueue = () => {
	const [queue, setQueue] = useState([])
	const [isOnline, setIsOnline] = useState(true)

	useEffect(() => {
		loadQueue()
		const unsubscribe = NetInfo.addEventListener(state => {
			setIsOnline(state.isConnected && state.isInternetReachable)
		})
		return () => unsubscribe()
	}, [])

	const loadQueue = async () => {
		try {
			const data = await AsyncStorage.getItem(QUEUE_STORAGE_KEY)
			setQueue(data ? JSON.parse(data) : [])
		} catch (e) {
			console.error(e)
		}
	}

	const addToQueue = async item => {
		const newQueue = [
			...queue,
			{
				id: Date.now().toString(),
				...item,
				timestamp: new Date().toISOString(),
			},
		]
		setQueue(newQueue)
		await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(newQueue))
	}

	const removeItem = async id => {
		const newQueue = queue.filter(item => item.id !== id)
		setQueue(newQueue)
		await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(newQueue))
	}

	return { queue, isOnline, addToQueue, removeItem, loadQueue, count: queue.length }
}
