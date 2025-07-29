import { LogBox } from 'react-native'
import 'expo-router/entry'

// Ignoruj te specificzne ostrzeżenia związane z NativeEventEmitter
LogBox.ignoreLogs([
	'new NativeEventEmitter',
	'`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method',
	'`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method',
])
