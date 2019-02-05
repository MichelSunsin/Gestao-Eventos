; (function (window, document, $, undefined) {
    'use strict';

    var app = (() => {

        var _private = {};
        var _public = {};

        /* Métodos Privados */

        _private.AjaxCall = (type, t, e, i, lcache, lasync) => {
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
        _public.Get_NoCacheSync = (t, e, i) => {
            _private.AjaxCall("GET", t, e, i, false, false);
        };

        _public.Get_NoCacheAsync = (t, e, i) => {
            _private.AjaxCall("GET", t, e, i, false, true);
        };

        _public.Post = (t, e, i) => {
            _private.AjaxCall("POST", JSON.stringify(t), e, i, true, false);
        };

        _public.Post_NoCacheAsync = (t, e, i) => {
            _private.AjaxCall("POST", JSON.stringify(t), e, i, false, true);
        };

        return _public;

    })();

    window.appAjax = app;

})(window, document, $);
