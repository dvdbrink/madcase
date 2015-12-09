define(function() {
    "use strict";

    var _nextEntityId = 0;

    function Entity() {
        this.id = _nextEntityId++;
        this.components = {};
    }

    Entity.prototype.addComponent = function(component) {
        this.components[component.name] = component;
    };

    Entity.prototype.hasComponent = function(componentName) {
        return this.components[componentName] !== undefined;
    };

    Entity.prototype.hasComponents = function(componentNames) {
        for (var componentName of componentNames) {
            if (!this.hasComponent(componentName)) {
                return false;
            }
        }
        return true;
    };

    Entity.prototype.getComponent = function(componentName) {
        return this.components[componentName];
    };

    return Entity;
});