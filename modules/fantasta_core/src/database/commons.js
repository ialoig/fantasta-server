var Q = require("q");

var save = function(entry) {
  var deferredObject = Q.defer();
  entry.save(function(err, data) {
    if (err) {
      deferredObject.reject(err);
    }
    deferredObject.resolve(data);
  });
  return deferredObject.promise;
};

var update = function(entry, value) {
  var deferredObject = Q.defer();
  entry.update(value, function(err, data) {
    if (err) {
      deferredObject.reject(err);
    }
    deferredObject.resolve(data);
  });
  return deferredObject.promise;
};

/**
 * Search Object for a specific Model *
 * @param {*} modelReference : Model to perform the find on
 * @param {*} objectToFind : Object to find in the model (eg. {name: "name_to_find"})
 */
function find(modelReference, objectToFind) {
  var deferredObject = Q.defer();
  modelReference.find(objectToFind, function(err, objectFound) {
    if (err || !objectFound || !objectFound[0]) {
      deferredObject.reject(err);
    }
    deferredObject.resolve(objectFound[0]);
  });
  return deferredObject.promise;
}

/**
 * Search id for a specific Model
 * @param {*} modelReference : Model to perform the findById on
 * @param {*} idToFind : id to find in the model (eg. ObjectId("5d87b71a9b0ba12ef443976e"))
 */
function findById(modelReference, idToFind) {
  var deferredObject = Q.defer();
  modelReference.findById(idToFind, function(err, objectFound) {
    if (err) {
      deferredObject.reject(err);
    }
    deferredObject.resolve(objectFound);
  });
  return deferredObject.promise;
}

module.exports = {
  save,
  update,
  find,
  findById
};
