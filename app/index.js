import React from 'react'
import { SafeAreaView, View, FlatList } from 'react-native'
import { Stack } from 'expo-router'
import Welcome from '../components/home/welcome/Welcome'
import Popularjobs from '../components/home/popular/Popularjobs'

const HomeScreen = () => {
	return (
		<SafeAreaView className='flex-1 bg-gray-50'>
			{/* Konfiguracja nagłówka pozostaje bez zmian */}
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: '#FEFEFE' },
					headerShadowVisible: false,
					headerTitle: 'Audyt Architektoniczny',
					headerTitleAlign: 'center',
				}}
			/>

			{/* Zastępujemy ScrollView komponentem FlatList, aby poprawnie obsłużyć
              zagnieżdżoną wirtualną listę z komponentu Popularjobs.
            */}
			<FlatList
				// Jeśli planujesz dodać w przyszłości główną, pionową listę
				// (np. "Oferty w pobliżu"), jej dane trafią tutaj.
				// Na razie zostawiamy pustą tablicę.
				data={[]}
				keyExtractor={item => `main-item-${item}`}
				renderItem={null}
				showsVerticalScrollIndicator={false}
				// Wszystkie komponenty, które były w ScrollView, umieszczamy tutaj
				ListHeaderComponent={() => (
					<View className='flex-1 p-4'>
						<Welcome />
						<Popularjobs />
					</View>
				)}
			/>
		</SafeAreaView>
	)
}

export default HomeScreen
