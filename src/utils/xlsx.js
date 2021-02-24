
import { readFile, utils } from 'xlsx'
const read = (fileName, skipRows) =>
{
    console.log(`[xlsx] reading file ${fileName} (skipping ${skipRows} rows)`)

    let file = readFile( './' + fileName )
    
    let excelContent_obj = []

    if ( file && file.Sheets )
    {
        // Read single sheet
        let worksheet = file.Sheets["Tutti"] || {}

        // Skip rows
        if ( skipRows > 0 && worksheet['!ref'] )
        {
            let range = utils.decode_range(worksheet['!ref']);
            range.s.r+= skipRows;
            if(range.s.r >= range.e.r) range.s.r = range.e.r;
            worksheet['!ref'] = utils.encode_range(range);
        }

        excelContent_obj = utils.sheet_to_json(worksheet)
    }

    return excelContent_obj
}

export default {
    read
}

