import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import CameraModule from './CameraModule'
import { Stack } from 'expo-router'

const CameraScreen = () => {
	return (
		<View style={StyleSheet.absoluteFill}>
			<Stack.Screen options={{ headerShown: false }} />
			<Text>CameraScreen</Text>
		</View>
	)
}

export default CameraScreen
