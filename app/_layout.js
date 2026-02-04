import '../global.css'
import { Stack } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync()

const Layout = () => {
	const [fontsLoaded] = useFonts({
		DMBold: require('../assets/fonts/DMSans-Bold.ttf'),
		DMRegular: require('../assets/fonts/DMSans-Regular.ttf'),
		DMMedium: require('../assets/fonts/DMSans-Medium.ttf'),
	})

	useEffect(() => {
		const prepare = async () => {
			await SplashScreen.preventAutoHideAsync()
			// ...load resources
			await SplashScreen.hideAsync()
		}
		prepare()
	}, [])

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) {
		return null
	}

	return (
		<SafeAreaProvider>
			<Stack onLayout={onLayoutRootView} />
		</SafeAreaProvider>
	)
}

export default Layout
