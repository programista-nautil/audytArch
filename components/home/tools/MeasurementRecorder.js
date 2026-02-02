import React, { useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Modal,
	TextInput,
	Alert,
	ActivityIndicator,
	Share,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import GDrive from 'react-native-google-drive-api-wrapper'
import RNFetchBlob from 'rn-fetch-blob'

/**
 * Komponent do zarządzania pomiarami (Światło, Dźwięk itp.)
 * @param {number} value - Aktualna wartość z czujnika
 * @param {string} unit - Jednostka (np. "lx", "dB")
 * @param {string} title - Tytuł narzędzia
 * @param {string} iconName - Nazwa ikony z Feather
 * @param {function} onStart - Funkcja uruchamiająca czujnik
 * @param {function} onStop - Funkcja zatrzymująca czujnik
 * @param {boolean} isActive - Czy czujnik działa
 */
const MeasurementRecorder = ({ value, unit, title, iconName = 'activity', levelInfo, onStart, onStop, isActive }) => {
	const [measurements, setMeasurements] = useState([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [note, setNote] = useState('')
	const [tempValue, setTempValue] = useState(null)
	const [isExporting, setIsExporting] = useState(false)

	const formatTime = dateObj => {
		return dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
	}

	// 1. Inicjacja zapisu - otwórz modal
	const handleInitSave = () => {
		setTempValue(value)
		if (isActive) onStop()
		setIsModalVisible(true)
	}

	// 2. Potwierdzenie zapisu
	const handleConfirmSave = () => {
		const now = new Date()

		const newMeasurement = {
			id: Date.now(),
			value: Math.round(tempValue),
			unit: unit,
			note: note.trim() || 'Bez notatki',
			timestamp: `${now.toLocaleDateString('pl-PL')} ${formatTime(now)}`,
			isoTime: new Date().toISOString(),
		}

		setMeasurements(prev => [newMeasurement, ...prev])
		setNote('')
		setIsModalVisible(false)
	}

	// 3. Eksport do CSV na Google Drive
	const handleExportCSV = async () => {
		if (measurements.length === 0) return

		setIsExporting(true)
		try {
			const token = (await GoogleSignin.getTokens()).accessToken
			GDrive.setAccessToken(token)
			GDrive.init()

			const photosFolderId = await AsyncStorage.getItem('@PhotosFolderId')
			const fileName = `Pomiar_${title}.csv`

			// 2. SZUKAMY FOLDERU NADRZĘDNEGO (AUDYTU)
			// Pytamy Google: "Kto jest rodzicem folderu Zdjęcia?"
			const metaResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${photosFolderId}?fields=parents`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			const metaData = await metaResponse.json()

			if (!metaData.parents || metaData.parents.length === 0) {
				throw new Error('Nie znaleziono folderu głównego audytu.')
			}

			const auditFolderId = metaData.parents[0]

			const newRows = measurements
				.map(m => {
					const dateObj = new Date(m.isoTime)
					const date = dateObj.toLocaleDateString('pl-PL')
					const time = formatTime(dateObj)
					const safeNote = m.note.replace(/;/g, ',')
					return `${date};${time};${m.value};${m.unit};${safeNote}`
				})
				.join('\n')

			const searchResult = await GDrive.files.list({
				q: `name = '${fileName}' and '${auditFolderId}' in parents and trashed = false`,
			})

			let fileId = null
			let finalContent = ''

			if (searchResult.files && searchResult.files.length > 0) {
				// --- PLIK ISTNIEJE: POBIERZ I DOPISZ ---
				console.log('Znaleziono istniejący plik CSV, aktualizuję...')
				fileId = searchResult.files[0].id

				const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
					headers: { Authorization: `Bearer ${token}` },
				})

				if (contentResponse.ok) {
					const oldContent = await contentResponse.text()
					const prefix = oldContent.endsWith('\n') ? '' : '\n'
					finalContent = oldContent + prefix + newRows
				} else {
					finalContent = 'Data;Godzina;Wartość;Jednostka;Notatka\n' + newRows
				}
			} else {
				// --- PLIK NIE ISTNIEJE: STWÓRZ NOWY ---
				console.log('Tworzę nowy plik CSV w folderze audytu...')
				const header = 'Data;Godzina;Wartość;Jednostka;Notatka\n'
				finalContent = header + newRows
			}

			// C. Przygotowanie pliku do wysyłki
			const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${fileName}`
			await RNFetchBlob.fs.writeFile(filePath, finalContent, 'utf8')
			const base64 = await RNFetchBlob.fs.readFile(filePath, 'base64')

			// D. Wysyłka (PATCH lub POST)
			let result
			if (fileId) {
				// UPDATE (PATCH)
				result = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/related; boundary=foo_bar_baz',
					},
					body: `
--foo_bar_baz
Content-Type: application/json; charset=UTF-8

{}

--foo_bar_baz
Content-Type: text/csv
Content-Transfer-Encoding: base64

${base64}
--foo_bar_baz--
`,
				})
			} else {
				// CREATE (POST) - w folderze AUDYTU (nie zdjęć)
				result = await GDrive.files.createFileMultipart(
					base64,
					'text/csv',
					{
						parents: [auditFolderId], // <--- Używamy ID rodzica
						name: fileName,
					},
					true,
				)
			}

			if (result.ok || result.status === 200) {
				Alert.alert(
					'Sukces',
					fileId ? 'Dopisano dane do istniejącego raportu.' : 'Utworzono nowy raport w folderze audytu.',
					[{ text: 'OK' }],
				)
			} else {
				throw new Error('Błąd zapisu API')
			}
		} catch (error) {
			console.error('Export Error:', error)
			Alert.alert('Błąd', 'Nie udało się zapisać pliku CSV: ' + error.message)
		} finally {
			setIsExporting(false)
		}
	}

	const clearHistory = () => {
		Alert.alert('Wyczyść historię', 'Czy na pewno chcesz usunąć wszystkie pomiary?', [
			{ text: 'Anuluj', style: 'cancel' },
			{ text: 'Usuń', style: 'destructive', onPress: () => setMeasurements([]) },
		])
	}

	return (
		<View>
			{/* --- GŁÓWNY WSKAŹNIK --- */}
			<View className='bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-200 mb-6'>
				<Feather name={isActive ? iconName : 'pause-circle'} size={48} color={isActive ? '#F59E0B' : '#9CA3AF'} />

				<Text className='text-6xl font-bold text-gray-900 mt-4'>{Math.round(value)}</Text>
				<Text className='text-xl text-gray-500 mb-2'>{unit}</Text>

				<View className='bg-gray-100 px-4 py-2 rounded-full mt-2'>
					<Text className={`font-semibold ${levelInfo.color}`}>{levelInfo.text}</Text>
				</View>
			</View>

			{/* --- KONTROLERY --- */}
			<View className='flex-row justify-between gap-4 mb-8'>
				<TouchableOpacity
					onPress={isActive ? onStop : onStart}
					className={`flex-1 py-4 rounded-xl flex-row justify-center items-center shadow-sm ${isActive ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
					<Feather name={isActive ? 'pause' : 'play'} size={24} color={isActive ? '#DC2626' : '#16A34A'} />
					<Text className={`ml-2 font-bold ${isActive ? 'text-red-700' : 'text-green-700'}`}>
						{isActive ? 'ZATRZYMAJ' : 'START'}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleInitSave}
					// Pozwalamy zapisać nawet jak jest aktywne (funkcja sama zatrzyma)
					className={`flex-1 py-4 rounded-xl flex-row justify-center items-center shadow-sm bg-blue-600`}>
					<Feather name='save' size={24} color='white' />
					<Text className='ml-2 font-bold text-white'>ZAPISZ</Text>
				</TouchableOpacity>
			</View>

			{/* --- LISTA I EKSPORT --- */}
			<View>
				<View className='flex-row justify-between items-center mb-4'>
					<Text className='text-lg font-bold text-gray-800'>Historia ({measurements.length})</Text>
					<View className='flex-row gap-4'>
						{measurements.length > 0 && (
							<>
								<TouchableOpacity onPress={clearHistory}>
									<Text className='text-red-500 font-medium'>Wyczyść</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={handleExportCSV} disabled={isExporting}>
									{isExporting ? (
										<ActivityIndicator size='small' color='#3B82F6' />
									) : (
										<Text className='text-blue-600 font-bold'>Eksportuj CSV</Text>
									)}
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>

				{measurements.length === 0 ? (
					<View className='items-center py-10 opacity-50'>
						<Feather name='list' size={40} color='#9CA3AF' />
						<Text className='text-gray-400 mt-2'>Brak zapisanych pomiarów</Text>
					</View>
				) : (
					measurements.map(item => (
						<View key={item.id} className='bg-white p-4 rounded-xl mb-2 border border-gray-100 shadow-sm'>
							<View className='flex-row justify-between items-start'>
								<View>
									<View className='flex-row items-center mb-1'>
										<Text className='font-bold text-gray-800 text-lg mr-2'>
											{item.value} {item.unit}
										</Text>
										<Text className='text-xs text-gray-400'>{item.timestamp}</Text>
									</View>
									{/* Wyświetlanie notatki */}
									<Text className='text-gray-600 italic'>"{item.note}"</Text>
								</View>
								<TouchableOpacity onPress={() => setMeasurements(prev => prev.filter(m => m.id !== item.id))}>
									<Feather name='trash-2' size={18} color='#EF4444' />
								</TouchableOpacity>
							</View>
						</View>
					))
				)}
			</View>

			{/* --- MODAL DO WPISYWANIA NOTATKI --- */}
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType='slide'
				onRequestClose={() => setIsModalVisible(false)}>
				<View className='flex-1 justify-center items-center bg-black/50 p-4'>
					<View className='bg-white w-full rounded-2xl p-6 shadow-lg'>
						<Text className='text-xl font-bold text-gray-800 mb-2'>Zapisz pomiar</Text>
						<Text className='text-gray-500 mb-4'>
							Wynik: {tempValue} {unit}
						</Text>

						<Text className='text-sm font-bold text-gray-700 mb-2'>Notatka (opcjonalnie):</Text>
						<TextInput
							className='bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 text-gray-800'
							placeholder='np. Biurko w sali 102'
							value={note}
							onChangeText={setNote}
							autoFocus={true}
						/>

						<View className='flex-row justify-end gap-3'>
							<TouchableOpacity onPress={() => setIsModalVisible(false)} className='px-4 py-3 rounded-lg bg-gray-200'>
								<Text className='font-bold text-gray-700'>Anuluj</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={handleConfirmSave} className='px-4 py-3 rounded-lg bg-blue-600'>
								<Text className='font-bold text-white'>Zapisz do listy</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

export default MeasurementRecorder
