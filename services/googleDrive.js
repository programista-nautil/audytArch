import RNFetchBlob from 'rn-fetch-blob'
import GDrive from 'react-native-google-drive-api-wrapper'

/**
 * Wysyła zdjęcie na Google Drive
 */
export const uploadPhotoService = async (accessToken, photoUri, folderId, fileName) => {
	// Inicjalizacja GDrive z tokenem
	GDrive.setAccessToken(accessToken)
	GDrive.init()

	// Upewniamy się, że ścieżka ma prefiks file://
	const cleanPath = photoUri.startsWith('file://') ? photoUri : `file://${photoUri}`

	// Czytamy plik jako base64
	const base64 = await RNFetchBlob.fs.readFile(cleanPath, 'base64')

	// Wysyłamy
	const result = await GDrive.files.createFileMultipart(
		base64,
		'image/jpeg',
		{
			parents: [folderId],
			name: fileName,
		},
		true
	)

	if (!result.ok) {
		throw new Error('Google Drive Upload Failed')
	}

	return true
}
