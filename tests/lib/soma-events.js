/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * The Original Code is soma-events.js.
 *
 * The Initial Developer of the Original Code is Romuald Quantin
 * romu@soundstep.com (www.soundstep.com)
 *
 * Initial Developer are Copyright (C) 2008-2012 Soundstep. All Rights Reserved.
 */
;(function (soma, undefined) {
	"use strict";

	soma.events = {};
	soma.events.version = "0.0.1";

	soma.Event = function (type, params, bubbles, cancelable) {
		var e = soma.Event.createGenericEvent(type, bubbles, cancelable);
		if (params !== null && params !== undefined) {
			e.params = params;
		}
		e.isCloned = false;
		e.clone = this.clone.bind(e);
		e.isIE9 = this.isIE9;
		e.isDefaultPrevented = this.isDefaultPrevented;
		if (this.isIE9() || !e.preventDefault || (e.getDefaultPrevented === undefined && e.defaultPrevented === undefined )) {
			e.preventDefault = this.preventDefault.bind(e);
		}
		if (this.isIE9()) e.IE9PreventDefault = false;
		return e;
	};

	soma.Event.prototype.clone = function () {
		var e = soma.Event.createGenericEvent(this.type, this.bubbles, this.cancelable);
		e.params = this.params;
		e.isCloned = true;
		e.clone = this.clone;
		e.isDefaultPrevented = this.isDefaultPrevented;
		e.isIE9 = this.isIE9;
		if (this.isIE9()) e.IE9PreventDefault = this.IE9PreventDefault;
		return e;
	};

	soma.Event.prototype.preventDefault = function () {
		if (!this.cancelable) return false;
		this.defaultPrevented = true;
		if (this.isIE9()) this.IE9PreventDefault = true;
		return this;
	};

	soma.Event.prototype.isDefaultPrevented = function () {
		if (!this.cancelable) return false;
		if (this.isIE9()) {
			return this.IE9PreventDefault;
		}
		if (this.defaultPrevented !== undefined) {
			return this.defaultPrevented;
		} else if (this.getDefaultPrevented !== undefined) {
			return this.getDefaultPrevented();
		}
		return false;
	};

	soma.Event.createGenericEvent = function (type, bubbles, cancelable) {
	    var event;
	    bubbles = bubbles !== undefined ? bubbles : true;
	    if (document.createEvent) {
		    event = document.createEvent("Event");
		    event.initEvent(type, !!bubbles, !!cancelable);
	    } else if (document.createEventObject) {
		    event = document.createEventObject();
		    event.type = type;
		    event.bubbles = !!bubbles;
		    event.cancelable = !!cancelable;
	    } else {
		    event = new EventObject(type, !!bubbles, !!cancelable);
	    }
	    return event;
	};

	soma.Event.prototype.isIE9 = function() {
	    return document.body.style.scrollbar3dLightColor !== undefined && document.body.style.opacity !== undefined;
    };

	soma.Event.prototype.toString = function() {
		return "[soma.Event]";
	};

	var EventObject = function(type, bubbles, cancelable) {
		this.type = type;
	    this.bubbles = !!bubbles;
	    this.cancelable = !!cancelable;
		this.defaultPrevented = false;
	    this.currentTarget = null;
	    this.target = null;
	};

	soma.EventDispatcher = function () {
		this.listeners = [];
	};

	soma.EventDispatcher.prototype.addEventListener = function(type, listener, priority) {
		if (!this.listeners || !type || !listener) return;
		if (isNaN(priority)) priority = 0;
		for (var i=0; i<this.listeners.length; i++) {
			var eventObj = this.listeners[i];
			if (eventObj.type === type && eventObj.listener === listener) {
				return;
			}
		}
		this.listeners.push({type: type, listener: listener, priority: priority, scope:this});
	};

	soma.EventDispatcher.prototype.removeEventListener = function(type, listener) {
		if (!this.listeners || !type || !listener) return;
		var i = this.listeners.length;
		while(i-- > 0) {
			var eventObj = this.listeners[i];
			if (eventObj.type === type && eventObj.listener === listener) {
				this.listeners.splice(i, 1);
			}
		}
	};

	soma.EventDispatcher.prototype.hasEventListener = function(type) {
		if (!this.listeners || !type) return false;
		var i = 0;
		var l = this.listeners.length;
		for (; i < l; ++i) {
			var eventObj = this.listeners[i];
			if (eventObj.type === type) {
				return true;
			}
		}
		return false;
	};

	soma.EventDispatcher.prototype.dispatchEvent = function(event) {
		if (!this.listeners || !event) throw new Error("Error in EventDispatcher (dispatchEvent), one of the parameters is null or undefined.");
		var events = [];
		var i;
		for (i = 0; i < this.listeners.length; i++) {
			var eventObj = this.listeners[i];
			if (eventObj.type === event.type) {
				events.push(eventObj);
			}
		}
		events.sort(function(a, b) {
			return b.priority - a.priority;
		});
		for (i = 0; i < events.length; i++) {
            events[i].listener.apply((event.srcElement) ? event.srcElement : event.currentTarget, [event]);
		}
		return !event.isDefaultPrevented();
	};

	soma.EventDispatcher.prototype.dispose = function() {
		this.listeners = null;
	};

	soma.EventDispatcher.prototype.toString = function() {
		return "[soma.EventDispatcher]";
	};

	// register for AMD module
	if (typeof define === 'function' && define.amd) {
		define("soma-events", soma);
	};

	// export for node.js
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = soma;
		}
		exports.soma = soma;
	};

})(this['soma'] = this['soma'] || {});

