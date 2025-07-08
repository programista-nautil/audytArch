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
				// Używamy komponentu Welcome jako statycznego nagłówka listy
				ListHeaderComponent={
					<View className='p-4'>
						<Welcome />
					</View>
				}
				// Popularjobs będzie renderowany jako element listy
				data={[{ key: 'popularjobs' }]} // Potrzebujemy tablicy z przynajmniej jednym elementem
				renderItem={() => (
					<View className='px-4'>
						<Popularjobs />
					</View>
				)}
				keyExtractor={item => item.key}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	)
}

export default HomeScreen
