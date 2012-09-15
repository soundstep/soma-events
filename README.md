soma-events
===========

Event shim and dispatcher to use the DOM 3 event syntax everywhere.

# what is useful for?

One of the core aspect of writing a maintainable and scalable code is to [decouple](http://en.wikipedia.org/wiki/Loose_coupling) the modules of your application so they are not tied together. If a module can't "talk" directly to another, you will need to find a way to notify other elements, this is called an [Observer Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript).

*"The motivation behind using the observer pattern is where you need to maintain consistency between related objects without making classes tightly coupled. For example, when an object needs to be able to notify other objects without making assumptions regarding those objects."* Addy Osmani

soma-events will provide a solid Observer Pattern to your application. The library is also following as much as possible the DOM 3 Event specification. In other words, soma-events is using a very standard syntax.

In general aspect, events can be used as a communication process between DOM elements as they will traverse the DOM ([event flow](http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)). With that said, soma-events will also make you able to use the same API to dispatch and listen to events in your application without necessarily depends on the DOM, this is why the library is also working with node.js.

## installation

Just grab the script (soma-events.js) from the repo for a normal use.

Or install it with npm for node.js:

	npm install soma-events

## introduction

This small libraries will make able to:

1. create custom native events using a wrapper function for all environments
2. use native custom event with the DOM (addEventListener, removeEventListener, dispatchEvent)
4. use a custom dispatcher if needed (both in node.js or a browser application)
3. solve inconsistencies between browsers

## native custom DOM events

A event can be created in different manner:

With internet explorer:

	var event = document.createEventObject();
	event.type = "myEventType";

With others:

	var event = document.createEvent("Event");
	event.initEvent("myEventType");

With node.js you can't create an event as there might no be a DOM and document.

## create custom events for all environments

Using the soma.Event function, you can create custom events with a single syntax.
These events will work with the DOM, with the custom dispatcher (soma.EventDispatcher) and with node.js.

	var event = new soma.Event("myEventType");

The event returns by the function is not an custom object (except for node.js). The event object is the real Event object that you get using document.createEventObject or document.createEvent native functions.

The event constructor can take 4 parameters:

	1. the event type (string)
	2. custom data (anything)
	3. bubbles (boolean)
	4. cancelable (boolean)

## using the events with the DOM

Once the event is created, you can use the DOM to dispatch the event.

	var div = document.getElementById("myDiv");
	div.dispatchEvent(new soma.Event("myEventType"));

You can also use the DOM functions to listen to it.

	// create function that receives the event notification
	function handleEvent(event) {
		console.log(event);
	};
	// get a DOM Element to use as a dispatcher
	var div = document.getElementById("myDiv");
	// listen to an event
	div.addEventListener("myEventType", handleEvent);
	// dispatch an event (you can any use DOM element because of the [event flow](http://www.w3.org/TR/DOM-Level-3-Events/#event-flow))
	div.dispatchEvent(new soma.Event("myEventType"));
	// remove the listener
	div.removeEventListener("myEventType", handleEvent);

## send parameters

You can send parameters with the events, useful to send data to the listeners.

	// create a custom dispatcher
	var dispatcher = new soma.EventDispatcher();
	dispatcher.addEventListener("eventType", function(event) {
		// get the data
		console.log(event.params);
	});
	var event = new soma.Event("eventType", {data:"myStuff"});
	dispatcher.dispatchEvent(event);

## custom dispatcher

You can also create a custom dispatcher if you don't have to rely to the DOM. This will be useful in both application that runs in the browser or in node.js.

The custom dispatcher is working in all common browsers, and in Internet Explorer from IE7 to actual.

	// create function that receives the event notification
	function handleEvent(event) {
		console.log(event);
	};
	// create a custom dispatcher
	var dispatcher = new soma.EventDispatcher();
	// listen to an event
	dispatcher.addEventListener("myEventType", handleEvent);
	// dispatch an event (you can any DOM element, not especially the same one)
	dispatcher.dispatchEvent(new soma.Event("myEventType"));
	// remove the listener
	dispatcher.removeEventListener("myEventType", handleEvent);

## additions to the custom dispatcher

The custom event dispatcher also add some useful methods. These methods are not part of the DOM 3 specification, you won't be able to use them if you are using a DOM element as a dispatcher.

* priorities

A priority number can be set when you add a listener, the highest will receive a notification first, regardless of when it is added to the dispatcher.

	// create handlers
	function firstEventHandler(event) {
		console.log("received first");
	}
	function secondEventHandler(event) {
		console.log("received after the first");
	}
	// create a custom dispatcher
	var dispatcher = new soma.EventDispatcher();
	// add listeners
	dispatcher.addEventListener("eventType", secondEventHandler, -1);
	dispatcher.addEventListener("eventType", firstEventHandler, 1);

* hasEventListener

A simple way to check if the dispatcher already has a listener

	// create a custom dispatcher
	var dispatcher = new soma.EventDispatcher();
	// add listeners
	dispatcher.addEventListener("eventType", eventHandler);
	dispatcher.hasEventListener("eventType"); // return true

* dispose

A way to tear down a custom dispatcher so it can be garbage collected.

	// create a custom dispatcher
	var dispatcher = new soma.EventDispatcher();
	dispatcher.dispose();
	dispatcher = null;

## scope and binding

soma-events also provide a way to bind the event handler to a new scope.

When you receive a event notification, for example dispatched from the DOM, the "this" in the handler will be bound to the Element. You can control and reassign the "this" value by using the bind method on any function.

[More information about the bind method](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind).

	function handleEvent(event) {
		console.log("Got the desired this:", this);
	}
	dispatcher.addEventListener("myEventType", handleEvent.bind(this));

Important note when you remove listeners: the bind method creates a new function, so if you try to remove a listener, it will just not work.

The following will NOT remove the listener (because the function are different):

	dispatcher.addEventListener("myEventType", handleEvent.bind(this));
	dispatcher.removeEventListener("myEventType", handleEvent.bind(this));

Solution:

	var boundHandler = handleEvent.bind(this);
	dispatcher.addEventListener("myEventType", boundHandler);
	dispatcher.removeEventListener("myEventType", boundHandler);

## prevent default

soma-events is solving a lot inconsistencies between browsers when you want to use the native preventDefault function.

The usage is still the following (even with a custom dispatcher):

	function handleEvent(event) {
        event.preventDefault();
    }

The way to check if an event has been "default prevented" differs between browsers, in some cases, will even return a wrong value.

To solve this problem, the event wrapper provides a function that will be consistent, I advice to use that one event if it is not part of the DOM specification.

	function handleEvent(event) {
	    console.log(event.isDefaultPrevented());
	}

Note: don't forget, an event needs to be set as "cancelable" in order to be "default prevented". That is a normal native DOM event behavior.

	// the latest parameter is the cancelable flag
	var event = new soma.Event("eventType", null, true, true);

## examples

A browser example with the DOM.

	<!DOCTYPE html>
	<html>
	<head>
		<title></title>
	</head>
	<body id="body">

	<div id="div"></div>

	<script type="text/javascript" src="src/soma-events.js"></script>
	<script type="text/javascript">
		;(function() {
			var element = document.getElementById("body");
			var otherElement = document.getElementById("div");
			var EventTypes = {
				START: "start"
			}
			var Application = function() {
				var model = new Model();
				otherElement.dispatchEvent(new soma.Event(EventTypes.START, {myStuff:"myStuff"}));
			};
			var Model = function() {
				element.addEventListener(EventTypes.START, function(event) {
					console.log("application started with:", event.params.myStuff);
				});
			};
			var app = new Application();
		})();
	</script>

	</body>
	</html>

A browser example with a custom dispatcher (syntax are the same).

	<!DOCTYPE html>
	<html>
	<head>
		<title></title>
	</head>
	<body>

	<script src="soma-events.js"></script>
	<script>
		;(function() {
			var dispatcher = new soma.EventDispatcher();
			var EventTypes = {
				START: "start"
			}
			var Application = function() {
				var model = new Model();
				dispatcher.dispatchEvent(new soma.Event(EventTypes.START, {myStuff:"myStuff"}));
			};
			var Model = function() {
				dispatcher.addEventListener(EventTypes.START, function(event) {
					console.log("application started with:", event.params.myStuff);
				});
			};
			var app = new Application();
		})();
	</script>

	</body>
	</html>

Here is a small node.js example

	var Event = require('soma-events').Event;
	var EventDispatcher = require('soma-events').EventDispatcher;

	var dispatcher = new EventDispatcher();

	var EventTypes = {
		START: "start"
	}

	var Application = function() {
		var model = new Model();
		dispatcher.dispatchEvent(new Event(EventTypes.START, {myStuff:"myStuff"}));
	};

	var Model = function() {
		dispatcher.addEventListener(EventTypes.START, function(event) {
			console.log("application started with:", event.params.myStuff);
		});
	};

	var app = new Application();

## License

Copyright (c) | 2012 | soma-events | Romuald Quantin | www.soundstep.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.