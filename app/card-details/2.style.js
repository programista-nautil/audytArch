import { StyleSheet } from 'react-native'

import { FONT, SIZES, COLORS } from '../../constants'

const styles = StyleSheet.create({
	container: {
		marginBottom: SIZES.xLarge,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: SIZES.large,
		fontFamily: FONT.medium,
		color: COLORS.primary,
		marginTop: SIZES.small,
		marginBottom: SIZES.xxLarge,
	},
	headerBtn: {
		fontSize: SIZES.medium,
		fontFamily: FONT.medium,
		color: COLORS.gray,
	},
	cardsContainer: {
		marginTop: SIZES.medium,
	},
	icon: {
		width: '100%',
		height: 150,
		marginRight: 10,
		borderRadius: 10,
	},
	tabText: (activeJobType, item) => ({
		fontFamily: FONT.medium,
		color: activeJobType === item ? COLORS.secondary : COLORS.gray2,
	}),
	submitButton: {
		marginTop: 30,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.primary,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.white,
	},

	cameraContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cameraButton: {
		backgroundColor: 'blue',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	cameraButtonText: {
		color: 'white',
	},
	camera: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	cameraControls: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
	},
	cameraControlsText: {
		color: 'white',
	},
	imagePreviewContainer: {
		alignItems: 'center',
		marginBottom: 10,
	},
	imagePreview: {
		width: 200,
		height: 200,
		marginBottom: 10,
	},
	savePictureButton: {
		backgroundColor: 'green',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	savePictureButtonText: {
		color: 'white',
	},
	choosePhotoButton: {
		backgroundColor: 'orange',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
		marginBottom: 20,
	},
	choosePhotoButtonText: {
		color: 'white',
	},
	userInfoContainer: {
		alignItems: 'center',
		marginBottom: 20,
	},
	userInfoText: {
		fontSize: 16,
		marginBottom: 10,
	},
	stateButton: {
		width: 80,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: COLORS.lightGray,
		marginRight: 10,
	},
	stateButtonContainer: {
		paddingVertical: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	fullScreenCameraButtons: {
		position: 'absolute', // Przyciski powinny być wyświetlane na wierzchu podglądu aparatu
		bottom: 20, // Umieść przyciski na dole ekranu
		width: '100%', // Przyciski powinny zajmować pełną szerokość ekranu
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: 20, // Dodaj padding do przycisków
	},
	fullScreenCameraButton: {
		width: 200, // Ustaw szerokość przycisku
		height: 60, // Ustaw wysokość przycisku
		justifyContent: 'center', // Wyśrodkuj tekst wewnątrz przycisku
		alignItems: 'center', // Wyśrodkuj tekst wewnątrz przycisku
		backgroundColor: '#3897f0', // Ustaw kolor tła przycisku
		borderRadius: 30, // Zaokrąglij rogi przycisku
	},
})

export default styles
