define(function() {
    "use strict";

    var EntityManager = function() {
        this.entities = {};
    }

    EntityManager.prototype.add = function(entity) {
        this.entities[entity.id] = entity;
    };

    EntityManager.prototype.remove = function(entity) {
        delete this.entities[entity.id];
    };

    EntityManager.prototype.withComponents = function(componentNames) {
        var result = [];
        for (var entityId in this.entities) {
            var entity = this.entities[entityId];
            if (entity.hasComponents(componentNames)) {
                result.push(entity);
            }
        }
        return result;
    };

    return EntityManager;
});