if (!soma) {
    // load for node.js
    var soma = require("../../src/soma-events.js");
}

describe("infuse.js | test dispatcher", function () {

    var dispatcher,
        count;

    var empty = emptyHandler.bind(this);
    var increase = increaseHandler.bind(this);
    var increase2 = increaseHandler2.bind(this);
    var fail = failHandler.bind(this);
    var second = secondHandler.bind(this);
    var prevent = preventHandler.bind(this);

    beforeEach(function () {
        dispatcher = new soma.EventDispatcher();
        count = 0;
    });

    afterEach(function () {
        if (dispatcher) dispatcher.dispose();
        dispatcher = null;
    });

    function emptyHandler(event) {

    };

    function increaseHandler(event) {
        count++;
    };

    function increaseHandler2(event) {
        count++;
    };

    function failHandler(event) {
        expect(false).toBeTruthy();
        count++;
    };

    function secondHandler(event) {
        expect(count).toEqual(1);
        count++;
    };

    function preventHandler(event) {
        event.preventDefault();
    };

    /* DISPATCHER */

    it("test_single_create_dispatcher", function () {
        expect(dispatcher).not.toBeNull();
        expect(dispatcher).not.toBeUndefined();
        expect(dispatcher instanceof soma.EventDispatcher).toBeTruthy();
    });

    it("test_multiple_create_dispatcher", function () {
        var dispatcher1 = new soma.EventDispatcher();
        var dispatcher2 = new soma.EventDispatcher();
        expect(dispatcher1 instanceof soma.EventDispatcher).toBeTruthy();
        expect(dispatcher2 instanceof soma.EventDispatcher).toBeTruthy();
        expect(dispatcher1 === dispatcher2).toBeFalsy();
    });

    it("test_single_add_listener", function () {
        dispatcher.addEventListener("type", increase);
        var E = dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_multiple_add_listener", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("type", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_add_listener_with_different_type", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("other", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_add_listener_with_different_handler", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("type", empty);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_single_has_listener", function () {
        dispatcher.addEventListener("type", empty);
        expect(dispatcher.hasEventListener("type")).toBeTruthy();
    });

    it("test_multiple_has_listener", function () {
        dispatcher.addEventListener("type", empty);
        dispatcher.addEventListener("type", empty);
        dispatcher.addEventListener("type", empty);
        expect(dispatcher.hasEventListener("type")).toBeTruthy();
    });

    it("test_multiple_has_listener_with_different_type", function () {
        dispatcher.addEventListener("type", empty);
        dispatcher.addEventListener("other", empty);
        expect(dispatcher.hasEventListener("type")).toBeTruthy();
    });

    it("test_multiple_has_listener_with_different_handler", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("other", empty);
        expect(dispatcher.hasEventListener("type")).toBeTruthy();
    });

    it("test_single_remove_listener", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.removeEventListener("type", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(dispatcher.hasEventListener("type")).toBeFalsy();
        expect(count).toEqual(0);
    });

    it("test_multiple_remove_listener", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("type", increase);
        dispatcher.removeEventListener("type", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(dispatcher.hasEventListener("type")).toBeFalsy();
        expect(count).toEqual(0);
    });

    it("test_single_remove_listener_does_not_dispatch", function () {
        dispatcher.addEventListener("type", fail);
        dispatcher.removeEventListener("type", fail);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(0);
    });

    it("test_multiple_remove_listener_does_not_dispatch", function () {
        dispatcher.addEventListener("type", fail);
        dispatcher.removeEventListener("type", fail);
        dispatcher.removeEventListener("type", fail);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(0);
    });

    it("test_remove_listener_with_different_type", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.removeEventListener("other", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_remove_listener_with_different_handler", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.removeEventListener("type", empty);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_single_dispatch", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_multiple_dispatch", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        dispatcher.dispatchEvent(new soma.Event("type"));
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(3);
    });

    it("test_dispatch_with_different_type", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("type", increase2);
        dispatcher.dispatchEvent(new soma.Event("type"));
        dispatcher.dispatchEvent(new soma.Event("other"));
        expect(count).toEqual(2);
    });

    it("test_priority_default", function () {
        dispatcher.addEventListener("type", increase);
        dispatcher.addEventListener("type", second);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(2);
    });

    it("test_priority_positive", function () {
        dispatcher.addEventListener("type", second);
        dispatcher.addEventListener("type", increase, 1);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(2);
    });

    it("test_priority_negative", function () {
        dispatcher.addEventListener("type", second, -1);
        dispatcher.addEventListener("type", increase);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(2);
    });

    it("test_priority_positive_and_negative", function () {
        dispatcher.addEventListener("type", second, -1);
        dispatcher.addEventListener("type", increase, 1);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(2);
    });

    it("test_dispose", function () {
        dispatcher.addEventListener("type", fail);
        dispatcher.addEventListener("type", fail);
        dispatcher.dispose();
        expect(count).toEqual(0);
        expect(dispatcher.hasEventListener("type")).toBeFalsy();
    });

    it("test_prevent_default_cancelable_true", function () {
        var event = new soma.Event("type", null, false, true);
        dispatcher.addEventListener("type", prevent);
        dispatcher.dispatchEvent(event);
        expect(event.isDefaultPrevented()).toBeTruthy();
    });

    it("test_prevent_default_cancelable_false", function () {
        var event = new soma.Event("type", null, false, false);
        dispatcher.addEventListener("type", prevent);
        dispatcher.dispatchEvent(event);
        expect(event.isDefaultPrevented()).toBeFalsy();
    });

    it("test_dispatch_return_true", function () {
        var event = new soma.Event("type", null, true, true);
        var result = dispatcher.dispatchEvent(event);
        expect(result).toBeTruthy();
    });

    it("test_dispatch_prevented_return_false", function () {
        var event = new soma.Event("type", null, true, true);
        dispatcher.addEventListener("type", prevent);
        var result = dispatcher.dispatchEvent(event);
        expect(result).toBeFalsy();
    });

    it("test_params_string", function () {
        var event = new soma.Event("type", "str");
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        });
        dispatcher.dispatchEvent(event);
        expect(result).toEqual("str");
    });

    it("test_params_number", function () {
        var event = new soma.Event("type", 123);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        });
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(123);
    });

    it("test_params_boolean", function () {
        var event = new soma.Event("type", true);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        });
        dispatcher.dispatchEvent(event);
        expect(result).toBeTruthy();
    });

    it("test_params_array", function () {
        var p = [1, "str", true, {data:"data"}];
        var event = new soma.Event("type", p);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        });
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(p);
    });

    it("test_params_object", function () {
        var p = {data:"data"};
        var event = new soma.Event("type", p);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        });
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(p);
    });

    it("test_params_function", function () {
        var p = function(){};
        var event = new soma.Event("type", p);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        });
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(p);
    });

    it("test_dispatchEvent_event_undefined", function () {
        var error;
        try {
            dispatcher.dispatchEvent(undefined);
        } catch (err) {
            error = err;
        }
        expect(error).not.toBeUndefined();
        expect(error).not.toBeNull();
        expect(error instanceof Error).toBeTruthy();
    });

    it("test_dispatchEvent_event_null", function () {
        var error;
        try {
            dispatcher.dispatchEvent(null);
        } catch (err) {
            error = err;
        }
        expect(error).not.toBeUndefined();
        expect(error).not.toBeNull();
        expect(error instanceof Error).toBeTruthy();
    });

});

//});
