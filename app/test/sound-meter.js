import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAudioRecorder, useAudioRecorderState, AudioModule, RecordingPresets } from 'expo-audio'
import { Stack } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import MeasurementRecorder from '../../components/home/tools/MeasurementRecorder'

const SoundMeterScreen = () => {
	const audioRecorder = useAudioRecorder({
		...RecordingPresets.LOW_QUALITY,
		isMeteringEnabled: true,
	})
	const recorderState = useAudioRecorderState(audioRecorder, 100)

	// Statystyki
	const [currentDb, setCurrentDb] = useState(0)
	const [stats, setStats] = useState({ min: 0, max: 0, avg: 0, median: 0 })
	const samplesRef = useRef([])

	useEffect(() => {
		;(async () => {
			const status = await AudioModule.requestRecordingPermissionsAsync()
			if (!status.granted) {
				Alert.alert('Brak uprawnień', 'Dostęp do mikrofonu jest wymagany.')
			}
		})()
	}, [])

	// 4. Logika Obliczeniowa
	useEffect(() => {
		if (recorderState.isRecording && typeof recorderState.metering === 'number') {
			const rawDb = recorderState.metering

			if (rawDb < -100) return

			const calibratedDb = Math.max(0, Math.floor(rawDb + 100))

			updateStats(calibratedDb)
		}
	}, [recorderState.metering, recorderState.isRecording])

	// 5. LOGIKA OBLICZENIOWA
	const updateStats = newVal => {
		if (!isRecordingRef.current) return

		setCurrentDb(newVal)
		samplesRef.current.push(newVal)

		const samples = samplesRef.current
		if (samples.length === 0) return

		const min = Math.min(...samples)
		const max = Math.max(...samples)
		const sum = samples.reduce((a, b) => a + b, 0)
		const avg = Math.floor(sum / samples.length)

		// Mediana
		const sorted = [...samples].sort((a, b) => a - b)
		const mid = Math.floor(sorted.length / 2)
		const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.floor((sorted[mid - 1] + sorted[mid]) / 2)

		setStats({ min, max, avg, median })
	}

	const startRecording = async () => {
		try {
			// Resetujemy dane
			samplesRef.current = []
			setStats({ min: 0, max: 0, avg: 0, median: 0 })
			setCurrentDb(0)

			// Start (expo-audio)
			await audioRecorder.prepareToRecordAsync()
			audioRecorder.record()
		} catch (err) {
			console.error('Błąd startu nagrywania:', err)
			Alert.alert('Błąd', 'Nie udało się uruchomić mikrofonu.')
		}
	}

	const stopRecording = async () => {
		try {
			await audioRecorder.stop()
		} catch (err) {
			console.error('Błąd zatrzymania:', err)
		}
	}

	const getSoundLevelDescription = db => {
		if (db < 35)
			return {
				text: 'Bardzo cicho / Strefa ciszy',
				color: 'text-green-600',
			}

		// 35-50dB: Optymalne warunki biurowe
		if (db < 50)
			return {
				text: 'Ciche biuro / Biblioteka',
				color: 'text-teal-600', // Spokojny, bezpieczny kolor
			}

		// 50-65dB: Standardowe tło, akceptowalne
		if (db < 65)
			return {
				text: 'Rozmowa / Open Space',
				color: 'text-yellow-600', // Ostrzegawczy - zaczyna być głośno
			}

		// 65-80dB: Utrudniona komunikacja
		if (db < 80)
			return {
				text: 'Głośno / Hałas uliczny',
				color: 'text-orange-600', // Wyraźne ostrzeżenie
			}

		// Powyżej 80dB: Zagrożenie lub silny dyskomfort
		return {
			text: 'Szkodliwy hałas / Zagrożenie',
			color: 'text-red-600', // Alarmowy
		}
	}

	return (
		<SafeAreaView className='flex-1 bg-gray-50'>
			<Stack.Screen options={{ headerTitle: 'Sonometr (dB)', headerTitleAlign: 'center' }} />

			<ScrollView contentContainerStyle={{ padding: 20 }}>
				{/* --- SEKCJA STATYSTYK --- */}
				{/* Pokazujemy to tylko gdy mamy jakieś dane, żeby audytor widział co się dzieje */}
				<View className='flex-row justify-between mb-6'>
					<View className='bg-white p-4 rounded-xl flex-1 mr-2 items-center border border-gray-100 shadow-sm'>
						<Text className='text-gray-500 text-xs uppercase font-bold'>Min</Text>
						<Text className='text-xl font-bold text-green-600'>{stats.min} dB</Text>
					</View>
					<View className='bg-white p-4 rounded-xl flex-1 mx-1 items-center border border-blue-200 bg-blue-50 shadow-sm'>
						<Text className='text-blue-800 text-xs uppercase font-bold mb-1'>Wynik Uśredniony (Mediana)</Text>
						<Text className='text-4xl font-bold text-blue-700'>{stats.median} dB</Text>
					</View>
					<View className='bg-white p-4 rounded-xl flex-1 ml-2 items-center border border-gray-100 shadow-sm'>
						<Text className='text-gray-500 text-xs uppercase font-bold'>Max</Text>
						<Text className='text-xl font-bold text-red-600'>{stats.max} dB</Text>
					</View>
				</View>

				{/* --- GŁÓWNY KOMPONENT REJESTRATORA --- */}
				{/* Przekazujemy medianę jako główną wartość do zapisu! */}
				<MeasurementRecorder
					title='Głośność'
					value={recorderState.isRecording ? currentDb : stats.median}
					unit='dB'
					iconName='mic'
					levelInfo={getSoundLevelDescription(recorderState.isRecording ? currentDb : stats.median)}
					isActive={recorderState.isRecording}
					onStart={startRecording}
					onStop={stopRecording}
				/>

				{/* Informacja dla użytkownika */}
				<View className='mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200'>
					<View className='flex-row items-start'>
						<Feather name='info' size={20} color='#D97706' style={{ marginTop: 2 }} />
						<Text className='ml-3 text-yellow-800 flex-1 text-sm'>
							Pomiar głośności w telefonie jest wartością orientacyjną.
							{'\n\n'}
							System automatycznie oblicza <Text className='font-bold'>średnią głośność</Text> z czasu trwania pomiaru,
							aby wyeliminować chwilowe hałasy. To właśnie średnia zostanie zapisana.
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SoundMeterScreen
