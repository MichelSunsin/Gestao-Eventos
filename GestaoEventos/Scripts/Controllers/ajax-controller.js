; (function (window, document, $, undefined) {
    'use strict';

    var app = (function () {

        var _private = {};
        var _public = {};

        /* Métodos Privados */

        _private.CallAjax = (type, t, e, i, lcache, lasync) => {
            debugger;
            $.ajax({
                type: type,
                url: e,
                data: t,
                contentType: "application/json",
                dataType: "json",
                cache: lcache,
                async: lasync,
                success: i,
                error: (t, e, i) => {
                    if (t.status == 401) {
                        window.location.reload();
                        return !0;
                    }
                    window.alert(t.responseText);
                }
            });
        };
        
        /* Métodos Públicos */
        _public.CallAjaxNoCacheSyncMethod_Get = (t, e, i) => {
            _private.CallAjax("GET", t, e, i, false, false);
        };

        _public.CallAjaxNoCacheAsyncMethod_Get = (t, e, i) => {
            _private.CallAjax("GET", t, e, i, false, true);
        };

        _public.CallAjaxMethod_Post = (t, e, i) => {
            _private.CallAjax("POST", JSON.stringify(t), e, i, true, false);
        };

        _public.CallAjaxMethodNoCacheAsyncMethod_Post = (t, e, i) => {
            _private.CallAjax("POST", JSON.stringify(t), e, i, false, true);
        };

        return _public;

    })();

    window.appAjax = app;

})(window, document, $);
