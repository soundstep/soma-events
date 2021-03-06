describe("soma-events.js | test dom", function () {

    var count,
        dispatcher,
        browser = BrowserDetect.browser,
        version = BrowserDetect.version;

    var empty = emptyHandler.bind(this);
    var increase = increaseHandler.bind(this);
    var increase2 = increaseHandler2.bind(this);
    var fail = failHandler.bind(this);
    var second = secondHandler.bind(this);
    var prevent = preventHandler.bind(this);

    beforeEach(function () {
        dispatcher = document.getElementById("div");
        count = 0;
    });

    afterEach(function () {
        dispatcher.removeEventListener("type", empty, true);
        dispatcher.removeEventListener("type", increase, true);
        dispatcher.removeEventListener("type", increase2, true);
        dispatcher.removeEventListener("type", fail, true);
        dispatcher.removeEventListener("type", second, true);
        dispatcher.removeEventListener("type", prevent, true);
        dispatcher.removeEventListener("other", increase, true);
        dispatcher = null;
        body = null;
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

    /* DOM */

    it("test_single_add_listener", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_multiple_add_listener", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.addEventListener("type", increase, true);
        dispatcher.addEventListener("type", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_add_listener_with_different_type", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.addEventListener("other", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_add_listener_with_different_handler", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.addEventListener("type", empty, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_single_remove_listener", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.removeEventListener("type", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(0);
    });

    it("test_multiple_remove_listener", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.addEventListener("type", increase, true);
        dispatcher.addEventListener("type", increase, true);
        dispatcher.removeEventListener("type", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(0);
    });

    it("test_single_remove_listener_does_not_dispatch", function () {
        dispatcher.addEventListener("type", fail, true);
        dispatcher.removeEventListener("type", fail, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(0);
    });

    it("test_multiple_remove_listener_does_not_dispatch", function () {
        dispatcher.addEventListener("type", fail, true);
        dispatcher.removeEventListener("type", fail, true);
        dispatcher.removeEventListener("type", fail, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(0);
    });

    it("test_remove_listener_with_different_type", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.removeEventListener("other", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_remove_listener_with_different_handler", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.removeEventListener("type", empty, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_single_dispatch", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(1);
    });

    it("test_multiple_dispatch", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        dispatcher.dispatchEvent(new soma.Event("type"));
        dispatcher.dispatchEvent(new soma.Event("type"));
        expect(count).toEqual(3);
    });

    it("test_dispatch_with_different_type", function () {
        dispatcher.addEventListener("type", increase, true);
        dispatcher.addEventListener("type", increase2, true);
        dispatcher.dispatchEvent(new soma.Event("type"));
        dispatcher.dispatchEvent(new soma.Event("other"));
        expect(count).toEqual(2);
    });

    it("test_prevent_default_cancelable_true", function () {
        var event = new soma.Event("type", null, false, true);
        dispatcher.addEventListener("type", prevent, true);
        dispatcher.dispatchEvent(event);
        expect(event.isDefaultPrevented()).toBeTruthy();
    });

    it("test_prevent_default_cancelable_false", function () {
        var event = new soma.Event("type", null, false, false);
        dispatcher.addEventListener("type", prevent, true);
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
        dispatcher.addEventListener("type", prevent, true);
        var result = dispatcher.dispatchEvent(event);
        if ( (browser === "Explorer" && version == 9) || (browser === "Explorer" && version == 10) || browser === "Firefox" && version <= 3.6) {
            expect(result).toBeTruthy();
        }
        else expect(result).toBeFalsy();
    });

    it("test_params_string", function () {
        var event = new soma.Event("type", "str");
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        }, true);
        dispatcher.dispatchEvent(event);
        expect(result).toEqual("str");
    });

    it("test_params_number", function () {
        var event = new soma.Event("type", 123);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        }, true);
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(123);
    });

    it("test_params_boolean", function () {
        var event = new soma.Event("type", true);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        }, true);
        dispatcher.dispatchEvent(event);
        expect(result).toBeTruthy();
    });

    it("test_params_array", function () {
        var p = [1, "str", true, {data:"data"}];
        var event = new soma.Event("type", p);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        }, true);
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(p);
    });

    it("test_params_object", function () {
        var p = {data:"data"};
        var event = new soma.Event("type", p);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        }, true);
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(p);
    });

    it("test_params_function", function () {
        var p = function(){};
        var event = new soma.Event("type", p);
        var result = null;
        dispatcher.addEventListener("type", function(event) {
            result = event.params;
        }, true);
        dispatcher.dispatchEvent(event);
        expect(result).toEqual(p);
    });

});

