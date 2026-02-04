import { File } from 'expo-file-system'
import GDrive from 'react-native-google-drive-api-wrapper'

/**
 * Wysyła zdjęcie na Google Drive
 */
export const uploadPhotoService = async (accessToken, photoUri, folderId, fileName) => {
	// Inicjalizacja GDrive z tokenem
	GDrive.setAccessToken(accessToken)
	GDrive.init()

	const cleanUri = photoUri.startsWith('file://') ? photoUri : `file://${photoUri}`
	const file = new File(cleanUri)

	// 2. Pobieramy base64 (Nowe API)
	const base64 = await file.base64()

	// 3. Budowanie body multipart (bez zmian)
	const metadata = {
		name: fileName,
		parents: [folderId],
		mimeType: 'image/jpeg',
	}

	const body =
		`--foo_bar_baz\r\n` +
		`Content-Type: application/json; charset=UTF-8\r\n\r\n` +
		`${JSON.stringify(metadata)}\r\n` +
		`--foo_bar_baz\r\n` +
		`Content-Type: image/jpeg\r\n` +
		`Content-Transfer-Encoding: base64\r\n\r\n` +
		`${base64}\r\n` +
		`--foo_bar_baz--`

	const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'multipart/related; boundary=foo_bar_baz',
			'Content-Length': body.length.toString(),
		},
		body: body,
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`Google Drive Upload Failed: ${response.status} - ${errorText}`)
	}

	return true
}
