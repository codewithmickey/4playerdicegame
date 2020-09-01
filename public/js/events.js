/***************************************************************
*
*   Events
*
***************************************************************/
var Events;
(Events = function() {
}).prototype = {
    addEventListener: function(type, method, scope, context) {
        //console.log(type, method, scope, context,"from add evts class")
        var listeners, handlers;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])){
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : window);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    },
    dispatchEvent: function(type, data, context) {
        //console.log(type, data, context,"from evts class")
        var listeners, handlers, i, n, handler;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])){
            return;
        }
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (typeof(context)!=="undefined" && context !== handler.context) continue;
            if (handler.method.call(
                handler.scope, this, type, data
            )===false) {
                return false;
            }
        }
        return true;
    }
};