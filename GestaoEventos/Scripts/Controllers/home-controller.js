﻿(function (window, document, $, undefined) {
    'use strict';

    var app = (function () {
        var _private = {};
        var _public = {};

        /* Métodos privados */
        _private.alerta = (tipo, mensagem) => {
            $('.alert').alert('close');
            $('body').prepend(`<div class="alert alert-${tipo} alert-dismissable" data-dismiss="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                ${mensagem}
                             </div>`);
            $('.alert').show();
        };

        _private.limparCampos = () => $('input').val('');

        _private.cadastrarNovoUsuario = () => {
            let usuario = {
                Nome: $('#new_user_name').val(),
                Sobrenome: $('#new_user_lastName').val(),
                Login: $('#new_user_login').val(),
                Senha: $('#new_user_password').val()
            };

            if (usuario.Nome == "") {
                _private.alerta("warning", "Nome é obrigatório");
                $('#new_user_name').focus();
                return false;
            }

            if (usuario.Sobrenome == "") {
                _private.alerta("warning", "Sobrenome é obrigatório");
                $('#new_user_lastName').focus();
                return false;
            }

            if (usuario.Login == "") {
                _private.alerta("warning", "Login é obrigatório");
                $('#new_user_login').focus();
                return false;
            }
            if (usuario.Senha == "") {
                _private.alerta("warning", "Senha é obrigatória");
                $('#new_user_password').focus();
                return false;
            }
            appAjax.post(usuario, "/api/CadastrarNovoUsuario/", (retorno) => {
                if (retorno.Erro != null) {
                    switch (retorno.Erro) {
                        case "Já existe um usuário cadastrado com o e-mail fornecido. Tente usar outro": {
                            _private.alerta("warning", retorno.Erro);
                            $('#new_user_login').focus();
                            return false;
                        }
                        default: return false;
                    }
                }
                _private.alerta("success", retorno.Sucesso);
                _private.limparCampos();
                _private.toggleCadastroLogin();
            });
        };

        _private.logar = () => {
            let usuario = {
                Login: $('#user_name').val(),
                Senha: $('#user_password').val()
            };
            appAjax.get_NoCacheAsync(undefined, `/api/LogarUsuario?login=${usuario.Login}&senha=${usuario.Senha}`, (retorno) => {
                if (retorno.Erro != null) {
                    _private.alerta("warning", retorno.Erro);
                    $('#new_user_login').focus();
                    return false;
                }
                sessionStorage.setItem('usuarioId', retorno.Entidade.Id);
                window.location.href = "/Agenda";
            });
        };

        _private.toggleCadastroLogin = () => $('#login, #cadastro').toggleClass("visible invisibleNone");

        /* Métodos públicos */

        _public.Initialize = () => {
            sessionStorage.clear();
            $('#btnCadastrarNovo, #btnCancelar').on('click', () => _private.toggleCadastroLogin());
            $('#btnCadastrar').on('click', () => _private.cadastrarNovoUsuario());
            $('#btnLogin').on('click', () => _private.logar());
        };

        return _public;
    })();

    window.AtualizarConteudoPagina = undefined;
    window.AtualizarConteudoPagina = app.Initialize;
    window.appHome = app;

    $(document).ready(() => appHome.Initialize());

})(window, document, $);
