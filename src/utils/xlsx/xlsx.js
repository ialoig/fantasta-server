
import { readFile, utils } from 'xlsx'

const Read = ( fileName ) =>
{
    let json = {}
    let file = {}

    try
    {
        file = readFile( './' + fileName )
    }
    catch (error)
    {
        console.error("Errore nella lettura del file: ", error)
    }

    for ( let i in file.SheetNames )
    {
        let sheetName = file.SheetNames[i]

        let xlData = utils.sheet_to_json(file.Sheets[sheetName])

        if ( sheetName )
        {
            json[sheetName] = xlData
        }
    }
    return json
}

export { Read }

