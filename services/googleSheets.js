/**
 * Serwis do obsługi operacji na Google Sheets API
 */

export const getSheetMetadata = async (spreadsheetId, accessToken, title) => {
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties)`
	const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
	const data = await response.json()

	const targetSheet = data.sheets?.find(sheet => sheet.properties.title === title)
	if (!targetSheet) throw new Error(`Arkusz ${title} nie został znaleziony.`)

	return {
		sheetId: targetSheet.properties.sheetId,
		sheetName: targetSheet.properties.title,
	}
}

export const getLastRowIndex = async (spreadsheetId, sheetName, accessToken) => {
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A:A?fields=values`
	const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
	const result = await response.json()
	return result.values ? result.values.length : 0
}

export const fastCopyStyles = async (spreadsheetId, sheetId, templateRowCount, startRowIndex, accessToken) => {
	const requests = [
		{
			copyPaste: {
				source: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 20 },
				destination: { sheetId, startRowIndex: startRowIndex, endRowIndex: startRowIndex + 1 },
				pasteType: 'PASTE_NORMAL',
			},
		},
		{
			copyPaste: {
				source: {
					sheetId,
					startRowIndex: 1,
					endRowIndex: templateRowCount + 1,
					startColumnIndex: 0,
					endColumnIndex: 20,
				},
				destination: { sheetId, startRowIndex: startRowIndex + 1, endRowIndex: startRowIndex + 1 + templateRowCount },
				pasteType: 'PASTE_FORMAT',
			},
		},
	]

	const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ requests }),
	})

	if (!response.ok) throw new Error('Błąd podczas kopiowania stylów')
}

export const executeUpload = async (payload, accessToken) => {
	const { spreadsheetId, sheetName, finalData, templateCount, sheetId } = payload

	// 1. Znajdź miejsce docelowe
	const lastRow = await getLastRowIndex(spreadsheetId, sheetName, accessToken)

	// 2. Wstaw dane (Append)
	const appendRange = `${sheetName}!A${lastRow + 1}`
	const appendResponse = await fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED`,
		{
			method: 'POST',
			headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ values: finalData }),
		}
	)

	if (!appendResponse.ok) throw new Error('Błąd zapisu danych w arkuszu')

	// 3. Kopiowanie formatowania i logotypu
	await fastCopyStyles(spreadsheetId, sheetId, templateCount, lastRow + 1, accessToken)

	return { success: true, newRow: lastRow + 1 }
}
