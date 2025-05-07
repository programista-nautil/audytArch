import * as Network from 'expo-network'

export const checkInternet = async () => {
	const state = await Network.getNetworkStateAsync()
	return state.isConnected && state.isInternetReachable !== false
}
