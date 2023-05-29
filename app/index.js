import { useState, useEffect } from 'react'
import { View, ScrollView, SafeAreaView, Text, StyleSheet} from 'react-native'
import { Stack, useRouter } from 'expo-router'

import { COLORS, SIZES, icons, images } from '../constants'
import { Nearbyjobs, Popularjobs, ScreenHeaderBtn, Welcome } from '../components'

const Home = () => {
	const router = useRouter()

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
			<Stack.Screen
				options={{
					headerStyle: { backgroundColor: COLORS.lightWhite },
					headerShadowVisible: false,
					headerLeft: () => (<ScreenHeaderBtn iconUrl={icons.menu} dimension='60%' />),
					headerRight: () => (<ScreenHeaderBtn iconUrl={images.profile} dimension='100%' />),
					headerTitle: '',
				}}
			/>
			
				<View style={{ flex: 1, padding: SIZES.medium }}>
					<Welcome />
					<Popularjobs />
					
				</View>
			
		</SafeAreaView>
	)
}

export default Home

const styles = StyleSheet.create({

})