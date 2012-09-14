(function(e,t){"use strict";e.events={},e.events.version="0.5.0",Function.prototype.bind||(Function.prototype.bind=function(t){var n=this;if(typeof n!="function")throw new Error("Error, you must bind a function.");var r=Array.prototype.slice.call(arguments,1),i=function(){if(this instanceof i){var e=function(){};e.prototype=n.prototype;var s=new e,o=n.apply(s,r.concat(Array.prototype.slice.call(arguments)));return Object(o)===o?o:s}return n.apply(t,r.concat(Array.prototype.slice.call(arguments)))};return i}),e.Event=function(n,r,i,s){var o=e.Event.createGenericEvent(n,i,s);r!==null&&r!==t&&(o.params=r),o.isCloned=!1,o.clone=this.clone.bind(o),o.isIE9=this.isIE9,o.isDefaultPrevented=this.isDefaultPrevented;if(this.isIE9()||!o.preventDefault||o.getDefaultPrevented===t&&o.defaultPrevented===t)o.preventDefault=this.preventDefault.bind(o);return this.isIE9()&&(o.IE9PreventDefault=!1),o},e.Event.prototype.clone=function(){var t=e.Event.createGenericEvent(this.type,this.bubbles,this.cancelable);return t.params=this.params,t.isCloned=!0,t.clone=this.clone,t.isDefaultPrevented=this.isDefaultPrevented,t.isIE9=this.isIE9,this.isIE9()&&(t.IE9PreventDefault=this.IE9PreventDefault),t},e.Event.prototype.preventDefault=function(){return this.cancelable?(this.defaultPrevented=!0,this.isIE9()&&(this.IE9PreventDefault=!0),this):!1},e.Event.prototype.isDefaultPrevented=function(){return this.cancelable?this.isIE9()?this.IE9PreventDefault:this.defaultPrevented!==t?this.defaultPrevented:this.getDefaultPrevented!==t?this.getDefaultPrevented():!1:!1},e.Event.createGenericEvent=function(e,r,i){var s;return r=r!==t?r:!0,typeof document=="object"&&document.createEvent?(s=document.createEvent("Event"),s.initEvent(e,!!r,!!i)):typeof document=="object"&&document.createEventObject?(s=document.createEventObject(),s.type=e,s.bubbles=!!r,s.cancelable=!!i):s=new n(e,!!r,!!i),s},e.Event.prototype.isIE9=function(){return typeof document!="object"?!1:document.body.style.scrollbar3dLightColor!==t&&document.body.style.opacity!==t},e.Event.prototype.toString=function(){return"[soma.Event]"};var n=function(e,t,n){this.type=e,this.bubbles=!!t,this.cancelable=!!n,this.defaultPrevented=!1,this.currentTarget=null,this.target=null};e.EventDispatcher=function(){this.listeners=[]},e.EventDispatcher.prototype.addEventListener=function(e,t,n){if(!this.listeners||!e||!t)return;isNaN(n)&&(n=0);for(var r=0;r<this.listeners.length;r++){var i=this.listeners[r];if(i.type===e&&i.listener===t)return}this.listeners.push({type:e,listener:t,priority:n,scope:this})},e.EventDispatcher.prototype.removeEventListener=function(e,t){if(!this.listeners||!e||!t)return;var n=this.listeners.length;while(n-->0){var r=this.listeners[n];r.type===e&&r.listener===t&&this.listeners.splice(n,1)}},e.EventDispatcher.prototype.hasEventListener=function(e){if(!this.listeners||!e)return!1;var t=0,n=this.listeners.length;for(;t<n;++t){var r=this.listeners[t];if(r.type===e)return!0}return!1},e.EventDispatcher.prototype.dispatchEvent=function(e){if(!this.listeners||!e)throw new Error("Error in EventDispatcher (dispatchEvent), one of the parameters is null or undefined.");var t=[],n;for(n=0;n<this.listeners.length;n++){var r=this.listeners[n];r.type===e.type&&t.push(r)}t.sort(function(e,t){return t.priority-e.priority});for(n=0;n<t.length;n++)t[n].listener.apply(e.srcElement?e.srcElement:e.currentTarget,[e]);return!e.isDefaultPrevented()},e.EventDispatcher.prototype.dispose=function(){this.listeners=null},e.EventDispatcher.prototype.toString=function(){return"[soma.EventDispatcher]"},typeof define=="function"&&define.amd&&define("soma-events",e),typeof exports!="undefined"&&(typeof module!="undefined"&&module.exports&&(exports=module.exports=e),exports.soma=e)})(this.soma=this.soma||{})