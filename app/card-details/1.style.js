import { StyleSheet } from 'react-native'

import { FONT, SIZES, COLORS } from '../../constants'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: COLORS.lightWhite,
	},
	card: {
		marginBottom: 10,
		backgroundColor: COLORS.white,
	},
	button: {
		marginVertical: 10,
	},
	contentContainer: {
		marginVertical: 10,
	},
	buttonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
	},
	switch: {
		alignSelf: 'flex-end',
	},
	input: {
		marginVertical: 10,
		backgroundColor: COLORS.lightGray,
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

	cameraButton: {
		backgroundColor: 'blue',
		paddingHorizontal: 20,
		paddingVertical: 20,
		borderRadius: 10,
		marginBottom: 20,
		marginTop: 20,
		alignSelf: 'center',
	},
	cameraButtonText: {
		color: 'black',
	},
	cameraControls: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingHorizontal: 20,
		paddingVertical: 20,
		borderRadius: 5,
	},
	cameraControlsText: {
		color: 'black',
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
		flex: 1,
		width: 50,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: COLORS.lightGray,
		marginRight: 10,
		padding: 5,
		marginHorizontal: 5,
	},
	stateButtonContainer: {
		paddingVertical: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
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
	commentInput: {
		backgroundColor: COLORS.lightGray,
		padding: 10,
		borderRadius: 10,
		marginTop: 10,
		width: '100%', // Zmieniono na 100%
		borderWidth: 1, // Dodano, aby pole było bardziej widoczne
		borderColor: '#000',
	},
	commentContainer: {
		width: '100%',
		marginVertical: 20,
	},
})

export default styles
