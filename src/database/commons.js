
const save = ( entry ) =>
{
    return new Promise( ( resolve, reject ) => {
        entry.save(
            (err, data) => {
                if (err)
                {
                    return reject(err)
                }
                return resolve(data)
            }
        )
    })
}

const update = ( entry, value ) =>
{
    return new Promise( ( resolve, reject ) => {
        entry.update(
            value,
            ( err, data ) => {
                if (err)
                {
                    return reject(err)
                }
                return resolve(data)
            }
        )
    })
}

/**
 * Search Object for a specific Model *
 * @param {*} modelReference : Model to perform the find on
 * @param {*} objectToFind : Object to find in the model (eg. {name: "name_to_find"})
 */
const find = ( modelReference, objectToFind ) =>
{
    return new Promise( ( resolve, reject ) => {
        modelReference.find(
            objectToFind,
            (err, objectFound) => {
                if (err || !objectFound || !objectFound[0])
                {
                    return reject(error)
                }
                return resolve(objectFound[0])
            }
        )
    })
}

/**
 * Search id for a specific Model
 * @param {*} modelReference : Model to perform the findById on
 * @param {*} idToFind : id to find in the model (eg. ObjectId("5d87b71a9b0ba12ef443976e"))
 */
const findById = ( modelReference, idToFind ) =>
{
    return new Promise( ( resolve, reject ) => {
        modelReference.findById(
            idToFind,
            ( err, objectFound ) => {
                if (err)
                {
                    return reject(error)
                }
                return resolve(objectFound)
            }
        )
    })
}

export default {
    save,
    update,
    find,
    findById
}
