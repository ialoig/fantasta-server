
import { readFile, utils } from 'xlsx'

const Read = (fileName, skipRows) =>
{
    console.log(`Reading file: ${fileName}. Skipping ${skipRows} rows`)

    let file = {}

    try
    {
        file = readFile( './' + fileName )
    }
    catch (error)
    {
        console.error(`Error reading file: ${fileName}. ${error}`)
    }

    // Read single sheet
    var worksheet = file.Sheets["Tutti"]

    // Skip rows
    if (skipRows > 0){
        var range = utils.decode_range(worksheet['!ref']);
        range.s.r+= skipRows;
        if(range.s.r >= range.e.r) range.s.r = range.e.r;
        worksheet['!ref'] = utils.encode_range(range);
    }

    let excelContent_obj = utils.sheet_to_json(worksheet)

    return excelContent_obj
}

export { Read }

