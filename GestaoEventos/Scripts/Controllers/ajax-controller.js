; (function (window, document, $, undefined) {
    'use strict';

    var app = (() => {

        var _private = {};
        var _public = {};

        /* Métodos Privados */

        _private.ajaxCall = (type, t, e, i, lcache, lasync) => {
            $.ajax({
                type: type,
                url: e,
                data: t,
                contentType: "application/json",
                dataType: "json",
                cache: lcache,
                async: lasync,
                success: i,
                error: (t, e, i) => window.alert(t.responseText)
            });
        };
        
        /* Métodos Públicos */
        _public.get_NoCacheSync = (t, e, i) => {
            _private.ajaxCall("GET", t, e, i, false, false);
        };

        _public.get_NoCacheAsync = (t, e, i) => {
            _private.ajaxCall("GET", t, e, i, false, true);
        };

        _public.post = (t, e, i) => {
            _private.ajaxCall("POST", JSON.stringify(t), e, i, true, false);
        };

        _public.post_NoCacheAsync = (t, e, i) => {
            _private.ajaxCall("POST", JSON.stringify(t), e, i, false, true);
        };

        return _public;

    })();

    window.appAjax = app;

})(window, document, $);
