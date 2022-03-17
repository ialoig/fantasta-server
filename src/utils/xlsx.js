
import xlsx from "xlsx"

const read = (fileName, skipRows) =>
{
	console.log(`[xlsx] reading file ${fileName} (skipping ${skipRows} rows)`)

	let file = xlsx.readFile( "./" + fileName )
    
	let excelContent_obj = []

	if ( file && file.Sheets )
	{
		// Read single sheet
		let worksheet = file.Sheets["Tutti"] || {}

		// Skip rows
		if ( skipRows > 0 && worksheet["!ref"] )
		{
			let range = xlsx.utils.decode_range(worksheet["!ref"])
			range.s.r+= skipRows
			if(range.s.r >= range.e.r) range.s.r = range.e.r
			worksheet["!ref"] = xlsx.utils.encode_range(range)
		}

		excelContent_obj = xlsx.utils.sheet_to_json(worksheet)
	}

	return excelContent_obj
}

const readFile = ( file, skipRows) =>
{
    
	let excelContent_obj = []

	if ( file && file.Sheets )
	{
		// Read single sheet
		let worksheet = file.Sheets["Tutti"] || {}

		// Skip rows
		if ( skipRows > 0 && worksheet["!ref"] )
		{
			let range = xlsx.utils.decode_range(worksheet["!ref"])
			range.s.r+= skipRows
			if(range.s.r >= range.e.r) range.s.r = range.e.r
			worksheet["!ref"] = xlsx.utils.encode_range(range)
		}

		excelContent_obj = xlsx.utils.sheet_to_json(worksheet)
	}

	return excelContent_obj
}

export default {
	read,
	readFile
}

