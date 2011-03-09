
/**
 *Global Application logic collection, should hold only instances 
 *@type Object
 */
var app = {};
/**
 *Global Application library, holds factory and constructor functions
 *@type Object
 */
var appLib = {};


/**
 *Namespace utility
 *
 *@param ns {String} An array or string of namespaces to create or verify exist
 *@param toApply {Function} Adds 
 *@returns {Object} Last element in a NS
 */
app.namespace = function(ns, toApply){
    var elements = ns.split(".");
    var root = window[elements[0]] = window[elements[0]] || {};
    
    for(var i = 1; i < elements.length; i++){        
        root = root[elements[i]] = root[elements[i]] || {};
    }    
    return root;
}

/**
 *With Namespace/object extension helper
 *
 *Provides a namespace safe mechanism for extending a functions prototype or decorating an object
 */
app.w = function(target, toApply){
    toApply.call(target.prototype);
}

/**
 *Application exception implementation
 *
 *@param {string} Error message
 *@param {Object} A reference/copy of the local this variable for debugging purposes
 */
app.Exception = function(message, scope){
    this.message = message;
    this.scope = scope;        
}

app.Exception.prototype.toString = function(){
    return  "app.Exception( " + this.message + ", ... );"
}

/**
 *@static Global reference to the Canvas 2d context
 *@deprecated
 */
app.CTX = null;
