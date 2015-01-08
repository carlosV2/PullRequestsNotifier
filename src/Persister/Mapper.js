(function (Persister, Util) {
    // Set the object namespace
    Persister.Mapper = {};

    // Entitites mappings
    var mappings = {

        // Mapping for Entity.Repository
        Repository: {
            key: 'repositories',
            fields: [
                {name: 'id',            id: true},
                {name: 'name',          type: 'literal'},
                {name: 'organization',  type: 'Organization', nullable: true},
                {name: 'discriminator', type: 'literal'},
                {name: 'labels',        type: 'Label[]'},
                {name: 'account',       type: 'Account'}
            ]
        },

        // Mapping for Entity.Organization
        Organization: {
            key: 'organizations',
            fields: [
                {name: 'id',   id: true},
                {name: 'name', type: 'literal'}
            ]
        },

        // Mapping for Entity.Account
        Account: {
            key: 'accounts',
            fields: [
                {name: 'id',           id: true},
                {name: 'name',         type: 'literal'},
                {name: 'type',         type: 'literal'},
                {name: 'token',        type: 'literal'},
                {name: 'repositories', type: 'Repository[]'}
            ]
        },

        // Mapping for Entity.Label
        Label: {
            key: 'labels',
            fields: [
                {name: 'id',    id: true},
                {name: 'name',  type: 'literal'},
                {name: 'color', type: 'literal'}
            ]
        }
    };

    /**
     * Function to get the entity's ID
     * @param  object       map    Mapping object
     * @param  object       entity Entity to get it's ID
     * @return Util.Promise        Promise object
     */
    function getIdFromMapAndEntity(map, entity)
    {
        for (var i in map.fields) {
            if (map.fields[i].id) {
                var fieldName = '_' + map.fields[i].name;

                if (fieldName in entity) {
                    return Util.Promise.buildResolved(entity[fieldName]);
                } else {
                    return Util.Promise.buildRejected(
                        'persister.mapper.unrecognizedFieldOnSource',
                        map,
                        entity
                    );
                }
            }
        }

        return Util.Promise.buildRejected(
            'persister.mapper.idFieldNotFound',
            map,
            entity
        );
    }

    /**
     * Function to get the mapping for a given entity
     * @param  object       entity Entity to get the mapping for
     * @return Util.Promise        Promise object
     */
    function getMappingFromEntity(entity)
    {
        for (var type in Entity) {
            if (entity instanceof Entity[type]) {
                var map = mappings[type];

                if (map) {
                    return Util.Promise.buildResolved(map);
                } else {
                    return Util.Promise.buildRejected(
                        'persister.mapper.unrecognizedType',
                        type
                    );
                }
            }
        }

        return Util.Promise.buildRejected(
            'persister.mapper.unrecognizedEntity',
            entity
        );
    }

    /**
     * Function to get the mapping for a given type
     * @param  object       type Entity type
     * @return Util.Promise      Promise object
     */
    function getMappingFromType(type)
    {
        for (var i in Entity) {
            if (Entity[i] === type) {
                var map = mappings[i];

                if (map) {
                    return Util.Promise.buildResolved(map);
                } else {
                    return Util.Promise.buildRejected(
                        'persister.mapper.unrecognizedType',
                        type
                    );
                }
            }
        }

        return Util.Promise.buildRejected(
            'persister.mapper.unrecognizedType',
            type
        );
    }

    /**
     * Function to build and save an entity object
     * @param  object       map    Mapping object
     * @param  object       entity Entity object to be stored
     * @return Util.Promise        Promise object
     */
    function buildObjectFromMapAndEntity(map, entity)
    {
        var promise = new Util.Promise();
        var fields = map.fields;
        var object = {};
        var objectId = null;
        var processedEntities = {};

        if (map.key in processedEntities) {
            for (var i in processedEntities[map.key]) {
                if (entity === processedEntities[map.key][i].entity) {
                    if (processedEntities[map.key][i].id) {
                        return
                    }
                }
            }
        }

        function nextProperty(i)
        {
            if (i < fields.length) {
                var field = fields[i];
                var fieldName = '_' + field.name;

                if (!(fieldName in entity)) {
                    return promise.reject('persister.mapper.unrecognizedFieldOnSource', entity, field.name);
                } else if (field.id) {
                    if (!entity[fieldName]) {
                        entity[fieldName] = Util.UUID.generate();
                    }

                    objectId = entity[fieldName];
                    object[fieldName] = objectId;

                    nextProperty(i + 1);
                } else if(field.type === 'literal' || (field.nullable && entity[fieldName] === null)) {
                    object[fieldName] = entity[fieldName];

                    nextProperty(i + 1);
                } else if (field.type.substr(field.type.length - 2) === '[]') {
                    var promises = [];

                    for (var j in entity[fieldName]) {
                        promises.push(Persister.Mapper.add(entity[fieldName][j]));
                    }

                    promises.getCombinedPromise()
                        .done(function (/* ids */) {
                            object[fieldName] = Array.prototype.slice.call(arguments);

                            nextProperty(i + 1);
                        })
                        .fail(null, promise.reject)
                    ;
                } else if (!field.nullable && entity[fieldName] === null) {
                    return promise.reject('persister.mapper.nullOnNotNullable', entity, fieldName);
                } else {
                    Persister.Mapper.add(entity[fieldName])
                        .done(function (objectId) {
                            object[fieldName] = objectId;

                            nextProperty(i + 1);
                        })
                        .fail(null, promise.reject)
                    ;
                }
            } else {
                if (!objectId) {
                    return promise.reject('persister.mapper.invalidObjectId', entity, objectId);
                }

                promise.resolve(objectId, object);
            }
        }

        // Let it set callbacks for the promise
        setTimeout(nextProperty.bind(this, 0), 1);

        return promise;
    }

    /**
     * Function to build an entity from an stored object
     * @param  object       type   Entity type to be built
     * @param  object       map    Mapping object
     * @param  object       object Object to be converted
     * @return Util.Promise        Promise object
     */
    function buildEntityFromTypeMapAndObject(type, map, object)
    {
        var promise = new Util.Promise();
        var fields = map.fields;
        var entity = new type();

        function nextProperty(i)
        {
            if (i < fields.length) {
                var field = fields[i];
                var fieldName = '_' + field.name;

                if (!(fieldName in entity)) {
                    return promise.reject('persister.mapper.unrecognizedFieldOnTarget', entity, object, field.name);
                } else if (!(fieldName in object)) {
                    return promise.reject('persister.mapper.unrecognizedFieldOnSource', entity, object, field.name);
                } else if (field.id || field.type === 'literal' || (field.nullable && object[fieldName] === null)) {
                    entity[fieldName] = object[fieldName];

                    nextProperty(i + 1);
                } else if (!field.nullable && object[fieldName] === null) {
                    return promise.reject('persister.mapper.nullOnNotNullable', object, fieldName);
                } else if (field.type.substr(field.type.length - 2) === '[]') {
                    var type = field.type.substr(0, field.type.length - 2);
                    var promises = [];

                    for (var j in object[fieldName]) {
                        promises.push(Persister.Mapper.find(Entity[type], object[fieldName][j]));
                    }

                    promises.getCombinedPromise()
                        .done(function (/* entities */) {
                            entity[fieldName] = Array.prototype.slice.call(arguments);
                            nextProperty(i + 1);
                        })
                        .fail(null, promise.reject)
                    ;
                } else {
                    Persister.Mapper.find(Entity[field.type], object[fieldName])
                        .done(function (referencedEntity) {
                            entity[fieldName] = referencedEntity;

                            nextProperty(i + 1);
                        })
                        .fail(null, promise.reject)
                    ;
                }
            } else {
                promise.resolve(entity);
            }
        }

        // Let it set callbacks for the promise
        setTimeout(nextProperty.bind(this, 0), 1);

        return promise;
    }

    /**
     * Function to build a list of entities from a collection of objects
     * @param  object       type       Entity type to be built
     * @param  object       map        Mapping object
     * @param  object[]     collection Collection of objects
     * @return Util.Promise            Promise object
     */
    function buildEntitiesFromMapAndCollection(type, map, collection)
    {
        var promise = new Util.Promise();
        var entities = [];

        function nextObject(i)
        {
            if (i < collection.length) {
                buildEntityFromTypeMapAndObject(type, map, collection[i])
                    .done(function (entity) {
                        entities.push(entity);

                        nextObject(i + 1);
                    })
                    .fail(null, promise.reject)
                ;
            } else {
                promise.resolve(entities);
            }
        }

        // Let it set callbacks for the promise
        setTimeout(nextObject.bind(this, 0), 1);

        return promise;
    }

    /**
     * Function to get all items of a given type
     * @param  object       type Entity to be build
     * @return Util.Promise      Promise object
     */
    Persister.Mapper.findAll = function (type)
    {
        return getMappingFromType(type)
            .done(function (map) {
                return Persister.Repository.findAll(map.key)
                    .done(function (collection) {
                        return buildEntitiesFromMapAndCollection(type, map, collection);
                    })
                ;
            })
        ;
    };

    /**
     * Function to get a single element under a key
     * @param  object       type  Entity to be build
     * @param  string       index Element to find
     * @return Util.Promise       Promise object
     */
    Persister.Mapper.find = function (type, index)
    {
        return getMappingFromType(type)
            .done(function (map) {
                return Persister.Repository.find(map.key, index)
                    .done(function (object) {
                        if (object) {
                            return buildEntityFromTypeMapAndObject(type, map, object);
                        } else {
                            return null;
                        }
                    })
                ;
            })
        ;
    };

    /**
     * Function to add values under a key
     * @param  object       entity Entity to be stored
     * @return Util.Promise        Promise object
     */
    Persister.Mapper.add = function (entity)
    {
        return getMappingFromEntity(entity)
            .done(function (map) {
                return buildObjectFromMapAndEntity(map, entity)
                    .done(function (id, object) {
                        return Persister.Repository.add(map.key, id, object)
                            .done(function () {
                                return id;
                            })
                        ;
                    })
                ;
            })
        ;
    };

    /**
     * NOTE: Under review. Cascade functionality should be cleverly added
     *
     * Function to remove an entity from the storage
     * @param  object       entity Entity to be removed
     * @return Util.Promise        Promise object
     */
    Persister.Mapper.remove = function (entity)
    {
        return getMappingFromEntity(entity)
            .done(function (map) {
                return getIdFromMapAndEntity(map, entity)
                    .done(function (id) {
                        return Persister.Repository.remove(map.key, id);
                    })
                ;
            })
        ;
    };
})(window.Persister = window.Persister || {}, window.Util);
