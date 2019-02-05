(function (window, document, $, undefined) {
    'use strict';

    var app = (function () {
        var _private = {};
        var _public = {};

        /* Métodos privados */
        _private.usuarioExiste = (login, f) => appAjax.Post({}, `/api/Usuario/UsuarioExiste?login=${login}`, f);

        _private.cadastrarNovoUsuario = () => {
            appAjax.Post(
                {
                    Nome: $('#new_user_name').val(),
                    Sobrenome: $('#new_user_lastName').val(),
                    Login: $('#new_user_login').val(),
                    Senha: $('#new_user_password').val() 
                }, 
                "/api/Usuario/CadastrarNovoUsuario/",
                (retorno) => {
                    console.log(retorno);
                }
            );
        };

        _private.toggleCadastroLogin = () => {
            $('#login, #cadastro').toggleClass("visible invisibleNone");
            //_private.usuarioExiste("mintchel@gmail.com", (retorno) => {
            //    if (retorno == true) {
            //        console.log(retorno);
            //    }
            //    else {
            //        console.log(retorno);
            //    }
            //});
        };


        /* Métodos públicos */
      
        _public.Initialize = () => {
            $('#btnCadastrarNovo, #btnCancelar').on('click', () => _private.toggleCadastroLogin());
            $('#btnCadastrar').on('click', () => _private.cadastrarNovoUsuario());
        };

        return _public;
    })();

    window.AtualizarConteudoPagina = undefined;
    window.AtualizarConteudoPagina = app.Initialize;
    window.appHome = app;

    $(document).ready(() => appHome.Initialize());

})(window, document, $);
