
import { utils } from 'xlsx'

const read = (fileName, skipRows) =>
{
    console.log(`Reading file: ${fileName}. Skipping ${skipRows} rows`)

    let file = {}

    try
    {
        // file = readFile( './' + fileName )
    }
    catch (error)
    {
        console.error(`Error reading file: ${fileName}. ${error}`)
        // todo: send metric (Error reading file)
    }

    let excelContent_obj = []

    if ( file && file.Sheets )
    {
        // Read single sheet
        let worksheet = file.Sheets && file.Sheets["Tutti"] || {}

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

