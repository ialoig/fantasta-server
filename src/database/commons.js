
const save = ( entry ) =>
{
  return entry.save(
    (err, data) => {
      if (err) {
        return Promise.reject(error)
      }
      return Promise.resolve(data)
    }
  )
}

const update = ( entry, value ) =>
{
  return entry.update(
    value,
    ( err, data ) => {
      if (err)
      {
        return Promise.reject(error)
      }
      return Promise.resolve(data)
    }
  )
}

/**
 * Search Object for a specific Model *
 * @param {*} modelReference : Model to perform the find on
 * @param {*} objectToFind : Object to find in the model (eg. {name: "name_to_find"})
 */
const find = ( modelReference, objectToFind ) =>
{
  return modelReference.find(
    objectToFind,
    (err, objectFound) => {
      if (err || !objectFound || !objectFound[0])
      {
        return Promise.reject(error)
      }
      return Promise.resolve(objectFound[0]);
    }
  )
}

/**
 * Search id for a specific Model
 * @param {*} modelReference : Model to perform the findById on
 * @param {*} idToFind : id to find in the model (eg. ObjectId("5d87b71a9b0ba12ef443976e"))
 */
const findById = ( modelReference, idToFind ) =>
{
  return modelReference.findById(
    idToFind,
    ( err, objectFound ) => {
      if (err) {
        return Promise.reject(error)
      }
      return Promise.resolve(objectFound);
    }
  )
}

export default {
  save,
  update,
  find,
  findById
}
