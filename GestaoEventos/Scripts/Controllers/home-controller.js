(function (window, document, $, undefined) {
    'use strict';

    var app = (function () {
        var _private = {};
        var _public = {};

        /* Métodos privados */
        _private.ObterUsuariosPorLogin = function (f) {
            appAjax.CallAjaxMethod_Post({ Id: 1, Nome: "Michel" }, "/api/Usuarios/ObterUsuariosPorLogin", f);
        };

        /* Métodos públicos */
        _public.toggleCadastro = () => {
            $('#login, #cadastro').toggleClass("visible invisibleNone");
            _private.ObterUsuariosPorLogin((retorno) => {
                console.log(retorno);
            });
            return false;
        };

        _public.Initialize = () => {
            $('#btnCadastro, #btnVoltar').on('click', () => _public.toggleCadastro());
        };

        return _public;
    })();

    window.AtualizarConteudoPagina = undefined;
    window.AtualizarConteudoPagina = app.Initialize;
    window.appHome = app;

    $(document).ready(() => appHome.Initialize());

})(window, document, $);
