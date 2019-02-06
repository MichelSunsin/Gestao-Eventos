; (function (window, document, $, undefined) {
    'use strict';

    var app = (function () {
        var _private = {};
        var _public = {};

        /* Variáveis privadas                             */
        /*------------------------------------------------*/
        _private.excluirTipoCompromissoIds = [];
        _private.eventoId = 0;
        _private.criadoPorId = 0;
        _private.empresaId = 0;
        _private.Cores = [
            { cor: '#275a74' },
            { cor: '#327496' },
            { cor: '#3f92bc' },
            { cor: '#004225' },
            { cor: '#059033' },
            { cor: '#87a96b' },
            { cor: '#990000' },
            { cor: '#d40000' },
            { cor: '#e05915' },
            { cor: '#550059' },
            { cor: '#6a488a' },
            { cor: '#916eb3' },
            { cor: '#006666' },
            { cor: '#008d8d' },
            { cor: '#00a5b4' },
            { cor: '#8f4b60' },
            { cor: '#af667d' },
            { cor: '#C38D9E' },
            { cor: '#384041' },
            { cor: '#536060' },
            { cor: '#6e7f80' },
            { cor: '#6a5750' },
            { cor: '#8c7369' },
            { cor: '#a79289' },
            { cor: '#604214' },
            { cor: '#81591c' },
            { cor: '#b17a26' }

        ];

        /*------------------------------------------------*/

        /* Variáveis públicas */

        /* Métodos privados                               */
        /*------------------------------------------------*/
        _private.recarregarEventos = (newEventSource) => {
            debugger;
            let currentEventSource = $('#field_agenda').fullCalendar('getEventSources')[0];
            if (currentEventSource != undefined)
                $('#field_agenda').fullCalendar('removeEventSource', currentEventSource);
            if (newEventSource != undefined && newEventSource != null)
                $('#field_agenda').fullCalendar('addEventSource', newEventSource);
        };

        _private.gerarCor = (idColaborador) => {
            let todasUtilizadas = true;

            let corJaDefinida = _private.Cores.find(x => x.id == idColaborador);
            if (corJaDefinida != undefined && corJaDefinida != null)
                return corJaDefinida.cor;

            for (let i = 0, len = _private.Cores.length; i < len; i++) {
                if (_private.Cores[i].id == undefined) {
                    todasUtilizadas = false;
                    _private.Cores[i].id = idColaborador;
                    return _private.Cores[i].cor;
                }
            }
            if (todasUtilizadas) {
                let red = Math.random() * 205;
                let green = Math.random() * 205;
                let blue = Math.random() * 205;
                return `rgb(${red},${green},${blue})`;
            }
        };

        _private.definirComponentes = () => {
            _private.obterColaboradoresBarraLateral();
            $('#field_agenda > div.fc-toolbar > div.fc-left').append($("<button id='btnAdicionarEvento' class='fc-button fc-state-default' type='button'>Novo Compromisso</button>"));
            $('#btnAdicionarEvento').on('click', function () {
                var date = {
                    id: 0,
                    empresaId: 0,
                    CriadoPorId: 0,
                    _d: new Date()
                };
                _private.AbrirModalEvento(date);
            });
        };

        _private.obterEventos = function (usuarioId, cor) {
            var novosEventos = [];
            var currentDataSource = $('#field_agenda').fullCalendar('getEventSources')[0];
            if (currentDataSource != undefined) {
                let eventosCarregadosAnteriormente = currentDataSource.rawEventDefs.filter(x => x.LoteEventosId == usuarioId);
                if (eventosCarregadosAnteriormente.length == 0) {
                    appAjax.get_NoCacheAsync(undefined, `/api/ObterEventos?usuarioId=${usuarioId}`, (retorno) => {
                        novosEventos = retorno.Entidade;
                        novosEventos.forEach(function (item) {
                            item.color = cor;
                        });
                        Array.prototype.push.apply(currentDataSource.rawEventDefs, novosEventos);
                    });
                }
            }
            else {
                appAjax.get_NoCacheAsync(undefined, `/api/ObterEventos?usuarioId=${usuarioId}`, (retorno) => {
                    debugger;
                    retorno.forEach(function (item) {
                        item.color = cor;
                    });
                    _private.recarregarEventos(retorno);
                });
            }
        };

        _private.removerEventos = (usuarioId) => {
            let currentDataSource = $('#field_agenda').fullCalendar('getEventSources')[0];
            if (currentDataSource != undefined) {
                debugger;
                let eventosCarregadosAnteriormente = currentDataSource.rawEventDefs.filter(x => x.LoteEventosId != usuarioId);
                currentDataSource.rawEventDefs = eventosCarregadosAnteriormente;
                _private.recarregarEventos(eventosCarregadosAnteriormente);
            }
        };

        _private.obterColaboradoresBarraLateral = () => {
            appAjax.get_NoCacheAsync(undefined, "/api/ObterTodosUsuarios/", (retorno) => {
                _private.colaboradores = [];
                retorno.forEach((usuario) => {
                    _private.colaboradores.push({ id: usuario.Id, text: usuario.Nome });
                    let cor = _private.gerarCor(usuario.Id);
                    $('#containerColaboradores').append(`<div href=# class="colaborador" data-id=${usuario.Id} data-selected=false data-cor=${cor}>${usuario.Nome}</div>`);
                    let divColaborador = $(`.colaborador[data-id=${usuario.Id}]`);
                    divColaborador.on('click', () => {
                        divColaborador.data("selected", !divColaborador.data("selected"));
                        if (divColaborador.data("selected") == true) {
                            divColaborador.css('color', 'white');
                            divColaborador.css('background-color', divColaborador.data("cor"));
                            _private.obterEventos(usuario.Id, cor);
                        }
                        else {
                            divColaborador.css('color', 'black');
                            divColaborador.css('background-color', 'white');
                            _private.removerEventos(usuario.Id);
                        }
                    });
                });
            });
        };
        //            $('.btn.btn-primary.btn').hide();
        //            $('.btn.btn-danger.btn.exclude').hide();

        //            _public.Ed_TituloCompromisso = new appComponentesEdit.EditorText({
        //                divId: 'editTituloCompromisso' + key,
        //                required: true
        //            });

        //            _private.excluirTipoCompromissoIds.push(11);
        //            moAgenda.ObterTipoCompromissoExcluirIdsLookup(_private.excluirTipoCompromissoIds, function (retorno) {

        //                var _itens = [];

        //                if (retorno.error == null || retorno.error == undefined) {
        //                    _itens = retorno;
        //                }

        //                _public.Ed_TipoCompromisso = new appComponentesEdit.EditorComboBox({
        //                    divId: 'editTipoCompromisso' + key,
        //                    required: true,
        //                    itens: _itens,
        //                    onSelect: function (e) {
        //                        if (e.target.selectedIndex == 0)
        //                            _public.Ed_ClientesProspects.SetRequired(true);
        //                        else {
        //                            _public.Ed_ClientesProspects.SetRequired(false);
        //                        }
        //                    }
        //                });

        //            });

        //            _public.Ed_CotacaoVinculadaCheckBox = new appComponentesEdit.EditorCheckBox({
        //                divId: 'cotacao-vinculada' + key,
        //                change: function (v) {
        //                    if (v) {
        //                        $('#console-cotacao-vinculada').show();
        //                    } else {
        //                        $('#console-cotacao-vinculada').hide();
        //                    }
        //                }
        //            });

        //            _public.Ed_ClientesProspects = new appComponentesEdit.EditorLookupComPaginacao({
        //                divId: 'editClientesProspects' + key,
        //                required: true,
        //                valueExpr: 'Id',
        //                displayExpr: 'NomeRazaoSocial',
        //                placeholderText: labels['Selecione'].msg,
        //                searchPlaceholder: labels['Pesquisa'].msg,
        //                clearButtonText: labels['Clear'].msg,
        //                metodoLookupStore: moAgenda.ObterClientesProspectsLookup,
        //                metodoByKey: moAgenda.ObterClientesProspectsLookupPorId,
        //                gerenciaDatasource: false,
        //                paginacao: true,
        //                tamanhoPagina: 10,
        //                textoCarregandoNovaPagina: labels['Carregando'].msg,
        //                semDadosText: '',
        //                itemTemplate: function (data) {
        //                    if (data != null) {
        //                        return (
        //                            "<div class='custom-item' style='white-space:normal;'>" +
        //                            "   <div>" +
        //                            "       <p>" + labels['Codigo'].msg + ": <b>" + (data.Codigo != undefined ? data.Codigo : labels['Indefinido'].msg) + "</b></p>" +
        //                            "       <p>" + labels['NomeRazaosocial'].msg + ": <b>" + (data.NomeRazaoSocial != undefined ? data.NomeRazaoSocial : labels['SemNome'].msg) + "</b></p>" +
        //                            "       <p>" + labels['NomeFantasia'].msg + ": <b>" + (data.NomeFantasia != undefined ? data.NomeFantasia : labels['SemNome'].msg) + "</b></p>" +
        //                            "       <p>" + labels['Empresa'].msg + " : <b>" + (data.NomeFantasiaEmpresa != undefined ? data.NomeFantasiaEmpresa : labels['SemNome'].msg) + "</b></p>" +
        //                            "       <p>" + labels['Tipo'].msg + " : <b>" + (data.Tipo != undefined ? data.Tipo : "") + "</b></p>" +
        //                            "   </div>" +
        //                            "</div>"
        //                        );
        //                    }
        //                    else {
        //                        return null;
        //                    }
        //                },
        //                selectionChanged: function (e) {
        //                    if (e.selectedItem != undefined && e.selectedItem != null) {
        //                        var clienteProspectString = e.selectedItem.Id.split("_");
        //                        moAgenda.ObterContatos(clienteProspectString[0], clienteProspectString[1], function (retorno) {
        //                            if (_public.Ed_Contato != undefined) {
        //                                _public.Ed_Contato.SetDataSource(retorno);
        //                                $('#containerContato' + key).show();
        //                            }
        //                            else {
        //                                $('#containerContato' + key).hide();
        //                            }
        //                        });
        //                    }
        //                    else
        //                        $('#containerContato' + key).hide();
        //                }
        //            });

        //            _public.Ed_Contato = new appComponentesEdit.EditorLookup({
        //                divId: 'editContato' + key,
        //                required: false,
        //                valueExpr: 'Id',
        //                displayExpr: 'Nome',
        //                placeholderText: labels['Selecione'].msg,
        //                clearButtonText: labels['Clear'].msg,
        //                searchPlaceholder: labels['Pesquisa'].msg,
        //                itemTemplate: function (data) {
        //                    if (data != null) {
        //                        return (
        //                            "<div class='custom-item' style='white-space:normal;'>" +
        //                            "   <div>" +
        //                            "       <p>" + labels['Contato'].msg + ": <b>" + (data.Nome) + "</b></p>" +
        //                            "       <p>" + labels['Telefone1'].msg + ": <b>" + (data.Telefone1) + "</b></p>" +
        //                            "       <p>" + labels['Telefone2'].msg + ": <b>" + (data.Telefone2) + "</b></p>" +
        //                            "       <p>" + labels['Celular'].msg + ": <b>" + (data.Celular) + "</b></p>" +
        //                            "   </div>" +
        //                            "</div>"
        //                        );
        //                    }
        //                    else {
        //                        return null;
        //                    }
        //                },
        //            });

        //            _public.Ed_Local = new appComponentesEdit.EditorText({
        //                divId: 'editLocal' + key,
        //                required: false
        //            });

        //            _public.Ed_Duracao = new appComponentesEdit.EditorCheckBox({
        //                divId: 'duracao-compromisso' + key,
        //                change: function (e) {
        //                    if (e) {
        //                        var dataInicial = _public.Ed_DataInicial.Get() == "" ? moment() : _public.Ed_DataInicial.Get();
        //                        var dataFinal = _public.Ed_DataFinal.Get() == "" ? moment() : _public.Ed_DataFinal.Get();

        //                        $('#editDataInicial' + key).empty();
        //                        $('#editDataFinal' + key).empty();

        //                        _public.Ed_DataInicial = new appComponentesEdit.EditorData({
        //                            divId: 'editDataInicial' + key,
        //                            required: true,
        //                            orientation: "auto"
        //                        });

        //                        _public.Ed_DataFinal = new appComponentesEdit.EditorData({
        //                            divId: 'editDataFinal' + key,
        //                            required: true,
        //                            orientation: "auto"
        //                        });

        //                        _public.Ed_DataInicial.Set(String(dataInicial));
        //                        _public.Ed_DataFinal.Set(String(dataFinal));
        //                    }
        //                    else {
        //                        var dataInicial = _public.Ed_DataInicial.Get() == "" ? moment() : _public.Ed_DataInicial.Get();
        //                        var dataFinal = _public.Ed_DataFinal.Get() == "" ? moment() : _public.Ed_DataFinal.Get();

        //                        $('#editDataInicial' + key).empty();
        //                        $('#editDataFinal' + key).empty();

        //                        _public.Ed_DataInicial = new appComponentesEdit.EditorDataHora({
        //                            divId: 'editDataInicial' + key,
        //                            palavras: palavrasDateTimePicker,
        //                            required: true,
        //                            sideBySide: true
        //                        });

        //                        _public.Ed_DataFinal = new appComponentesEdit.EditorDataHora({
        //                            divId: 'editDataFinal' + key,
        //                            palavras: palavrasDateTimePicker,
        //                            required: true,
        //                            sideBySide: true
        //                        });

        //                        _public.Ed_DataInicial.Set(String(dataInicial));
        //                        _public.Ed_DataFinal.Set(String(dataFinal));
        //                    }
        //                }
        //            });

        //            _public.Ed_DataInicial = new appComponentesEdit.EditorDataHora({
        //                divId: 'editDataInicial' + key,
        //                palavras: palavrasDateTimePicker,
        //                required: true,
        //                sideBySide: true
        //            });

        //            _public.Ed_DataFinal = new appComponentesEdit.EditorDataHora({
        //                divId: 'editDataFinal' + key,
        //                palavras: palavrasDateTimePicker,
        //                required: true,
        //                sideBySide: true
        //            });

        //            _public.Ed_DuracaoReagendamento = new appComponentesEdit.EditorCheckBox({
        //                divId: 'duracao-compromisso-reagendamento' + key,
        //                change: function (e) {
        //                    if (e) {
        //                        $('#editDataInicialReagendamento' + key).empty();
        //                        $('#editDataFinalReagendamento' + key).empty();

        //                        _public.Ed_DataInicialReagendamento = new appComponentesEdit.EditorData({
        //                            divId: 'editDataInicialReagendamento' + key,
        //                            required: true,
        //                            orientation: "auto"
        //                        });

        //                        _public.Ed_DataFinalReagendamento = new appComponentesEdit.EditorData({
        //                            divId: 'editDataFinalReagendamento' + key,
        //                            required: true,
        //                            orientation: "auto"
        //                        });
        //                    }
        //                    else {
        //                        $('#editDataInicialReagendamento' + key).empty();
        //                        $('#editDataFinalReagendamento' + key).empty();

        //                        _public.Ed_DataInicialReagendamento = new appComponentesEdit.EditorDataHora({
        //                            divId: 'editDataInicialReagendamento' + key,
        //                            palavras: palavrasDateTimePicker,
        //                            required: true,
        //                            sideBySide: true
        //                        });

        //                        _public.Ed_DataFinalReagendamento = new appComponentesEdit.EditorDataHora({
        //                            divId: 'editDataFinalReagendamento' + key,
        //                            palavras: palavrasDateTimePicker,
        //                            required: true,
        //                            sideBySide: true
        //                        });

        //                        _public.Ed_DataInicialReagendamento.Set(moment());
        //                        _public.Ed_DataFinalReagendamento.Set(moment());
        //                    }
        //                }
        //            });

        //            _public.Ed_DataInicialReagendamento = new appComponentesEdit.EditorDataHora({
        //                divId: 'editDataInicialReagendamento' + key,
        //                palavras: palavrasDateTimePicker,
        //                required: true,
        //                sideBySide: true
        //            });

        //            _public.Ed_DataFinalReagendamento = new appComponentesEdit.EditorDataHora({
        //                divId: 'editDataFinalReagendamento' + key,
        //                palavras: palavrasDateTimePicker,
        //                required: true,
        //                sideBySide: true
        //            });

        //            _public.Ed_Convidados = new appComponentesEdit.EditorTagBox({
        //                divId: 'editConvidados' + key,
        //                required: false,
        //                store: [],
        //                valueExpr: 'Id',
        //                displayExpr: 'Nome',
        //                placeholderText: labels['Selecione'].msg,
        //                searchPlaceholder: labels['Pesquisa'].msg,
        //                clearButtonText: labels['Clear'].msg,
        //                metodoLookupStore: moAgenda.ObterConvidados,
        //                metodoByKey: moAgenda.ObterConvidadosPorIds,
        //                gerenciaDatasource: false,
        //                semDadosText: '',
        //                itemTemplate: function (data, itemIndex, element) {
        //                    element.append(appGeneral.ObterHtmlTemplateVendedor(data));
        //                }
        //            });

        //            _public.Ed_StatusCompromisso = new appComponentesEdit.EditorComboBox({
        //                divId: 'editStatusCompromisso' + key,
        //                required: true,
        //                itens: null,
        //                metodoGetData: moAgenda.ObterStatusCompromissoLookup,
        //                onSelect: function (v) {
        //                    switch (v.currentTarget.selectedIndex) {
        //                        case 0:
        //                            {
        //                                $('#containerResultadoCompromisso' + key).hide();
        //                                $('#containerMotivoCancelamento' + key).hide();
        //                                $('.reagendamento' + key).hide();
        //                                $('#containerNotasCompromisso' + key).removeClass('col-md-6');
        //                                $('#containerResultadoCompromisso' + key).removeClass('col-md-6');
        //                                $('#containerNotasCompromisso' + key).addClass('col-md-12');
        //                                $('#containerResultadoCompromisso' + key).addClass('col-md-12');
        //                            }
        //                            break;

        //                        case 1:
        //                            {
        //                                $('#containerResultadoCompromisso' + key).show();
        //                                $('#containerMotivoCancelamento' + key).hide();
        //                                $('.reagendamento' + key).hide();
        //                                $('#containerNotasCompromisso' + key).removeClass('col-md-6');
        //                                $('#containerResultadoCompromisso' + key).removeClass('col-md-6');
        //                                $('#containerNotasCompromisso' + key).addClass('col-md-12');
        //                                $('#containerResultadoCompromisso' + key).addClass('col-md-12');
        //                            }
        //                            break;

        //                        case 2:
        //                            {
        //                                $('#containerResultadoCompromisso' + key).show();
        //                                $('#containerMotivoCancelamento' + key).show();
        //                                if (_public.Ed_MotivoCancelamento.Get() == 2) {
        //                                    if (!$('#btnIrParaReagendamento' + key).is(":visible")) {
        //                                        $('.reagendamento' + key).show();
        //                                    }
        //                                    $('#containerNotasCompromisso' + key).removeClass('col-md-12');
        //                                    $('#containerResultadoCompromisso' + key).removeClass('col-md-12');
        //                                    $('#containerNotasCompromisso' + key).addClass('col-md-6');
        //                                    $('#containerResultadoCompromisso' + key).addClass('col-md-6');
        //                                }

        //                            }
        //                            break;
        //                    }
        //                }
        //            });

        //            _public.Ed_MotivoCancelamento = new appComponentesEdit.EditorComboBox({
        //                divId: 'editMotivoCancelamento' + key,
        //                required: true,
        //                itens: null,
        //                metodoGetData: moAgenda.ObterMotivoCancelamentoLookup,
        //                onSelect: function (e) {
        //                    if (e.target.selectedIndex == 1) {
        //                        if (!$('#btnIrParaReagendamento' + key).is(":visible")) {
        //                            $('.reagendamento' + key).show();
        //                            $('#containerNotasCompromisso' + key).removeClass('col-md-12');
        //                            $('#containerResultadoCompromisso' + key).removeClass('col-md-12');
        //                            $('#containerNotasCompromisso' + key).addClass('col-md-6');
        //                            $('#containerResultadoCompromisso' + key).addClass('col-md-6');
        //                        }
        //                    }
        //                    else {
        //                        $('.reagendamento' + key).hide();
        //                        $('#containerNotasCompromisso' + key).removeClass('col-md-6');
        //                        $('#containerResultadoCompromisso' + key).removeClass('col-md-6');
        //                        $('#containerNotasCompromisso' + key).addClass('col-md-12');
        //                        $('#containerResultadoCompromisso' + key).addClass('col-md-12');
        //                    }
        //                }
        //            });

        //            _public.Ed_NotasCompromisso = new appComponentesEdit.EditorTextArea({
        //                divId: 'editNotasCompromisso' + key,
        //                maxlength: 500,
        //                rows: 6,
        //                resizable: false,
        //                placeholder: labels['Notas'].msg
        //            });

        //            _public.Ed_ResultadoCompromisso = new appComponentesEdit.EditorTextArea({
        //                divId: 'editResultadoCompromisso' + key,
        //                maxlength: 255,
        //                rows: 6,
        //                resizable: false,
        //                required: true,
        //                placeholder: labels['Resultado'].msg
        //            });

        //            $('#containerBtnIrParaReagendamento' + key).append($("<button id='btnIrParaReagendamento" + key + "' class='btn-primary btn' type='button' style='display:none; width:148.23px'>" + labels['VerNovoEvento'].msg + "</button>"));
        //            $('#containerBtnIrParaOrdemServico' + key).append($("<button id='btnIrParaOrdemServico" + key + "' class='btn-primary btn' type='button' style='display:none'>" + labels['VerOrdemServico'].msg + "</button>"));


        //            $('#containerResultadoCompromisso' + key).hide();
        //            $('#containerMotivoCancelamento' + key).hide();
        //        },
        //        metodoMostrar: function () {
        //            if ($('.modal:visible').length) {
        //                $('body').addClass('modal-open');
        //            }

        //            _public.Ed_TituloCompromisso.Focus();

        //            _private.eventoId = evento.id == undefined ? 0 : evento.id;
        //            _private.empresaId = evento.EmpresaId == undefined ? 0 : evento.EmpresaId;
        //            _private.criadoPorId = evento.CriadoPorId == undefined ? moSessao.dataSession.UsuarioId : evento.CriadoPorId;

        //            if (_private.eventoId != 0) {
        //                _public.Ed_TituloCompromisso.Set(evento.title);
        //                _public.Ed_TipoCompromisso.Set(evento.TipoCompromisso);

        //                if (evento.TipoCompromisso != 1)
        //                    _public.Ed_ClientesProspects.SetRequired(false);

        //                _public.Ed_ClientesProspects.Set(evento.ClienteId != null ? evento.ClienteId + "_Cliente" : evento.ProspectId + "_Prospect");
        //                _public.Ed_Contato.Set(evento.ContatoId);
        //                _public.Ed_Local.Set(evento.Local);
        //                _public.Ed_Duracao.Set(evento.allDay);

        //                //if (evento._d != undefined || evento._d != null) {
        //                //    var dt = evento._d;
        //                //    _public.Ed_DataInicial.Set(appComponentesEdit.GetDataFormatadaGridUTCMoment(dt));
        //                //    _public.Ed_DataFinal.Set(appComponentesEdit.GetDataFormatadaGridUTCMoment(dt));
        //                //}

        //                if (evento.start != undefined || evento.start != null) {
        //                    if (evento.allDay)
        //                        _public.Ed_DataInicial.Set(appComponentesEdit.GetDataFormatadaGridUTCMoment(evento.start));
        //                    else
        //                        _public.Ed_DataInicial.Set(evento.start);
        //                }

        //                if (evento.end != undefined || evento.end != null) {
        //                    //if (evento.allDay && evento.end != null && evento.start != evento.end) {
        //                    //    var dt = evento.end._d.addDays(-1);
        //                    //    evento.end._d = dt;
        //                    //}
        //                    if (evento.allDay)
        //                        _public.Ed_DataFinal.Set(appComponentesEdit.GetDataFormatadaGridUTCMoment(evento.end.subtract(1, "days")));
        //                    else
        //                        _public.Ed_DataFinal.Set(evento.end);
        //                }
        //                else {
        //                    if (evento.allDay)
        //                        _public.Ed_DataFinal.Set(appComponentesEdit.GetDataFormatadaGridUTCMoment(evento.start));
        //                    else
        //                        _public.Ed_DataFinal.Set(evento.start);
        //                }

        //                _public.Ed_Convidados.Set(evento.Convidados);
        //                _public.Ed_StatusCompromisso.Set(evento.StatusCompromisso);

        //                switch (parseInt(evento.StatusCompromisso)) {
        //                    case 1:
        //                        {
        //                            $('#containerResultadoCompromisso' + key).hide();
        //                            $('#containerMotivoCancelamento' + key).hide();
        //                            $('.reagendamento' + key).hide();
        //                            $('#containerNotasCompromisso' + key).removeClass('col-md-6');
        //                            $('#containerResultadoCompromisso' + key).removeClass('col-md-6');
        //                            $('#containerNotasCompromisso' + key).addClass('col-md-12');
        //                            $('#containerResultadoCompromisso' + key).addClass('col-md-12');
        //                        }
        //                        break;

        //                    case 2:
        //                        {
        //                            $('#containerResultadoCompromisso' + key).show();
        //                            $('#containerMotivoCancelamento' + key).hide();
        //                            $('.reagendamento' + key).hide();
        //                            $('#containerNotasCompromisso' + key).removeClass('col-md-6');
        //                            $('#containerResultadoCompromisso' + key).removeClass('col-md-6');
        //                            $('#containerNotasCompromisso' + key).addClass('col-md-12');
        //                            $('#containerResultadoCompromisso' + key).addClass('col-md-12');
        //                            _public.Ed_ResultadoCompromisso.Set(evento.ResultadoCompromisso);
        //                        }
        //                        break;

        //                    case 3:
        //                        {
        //                            $('#containerResultadoCompromisso' + key).show();
        //                            $('#containerMotivoCancelamento' + key).show();
        //                            _public.Ed_MotivoCancelamento.Set(evento.MotivoCancelamento);
        //                            _public.Ed_ResultadoCompromisso.Set(evento.ResultadoCompromisso);
        //                            if (evento.MotivoCancelamento != null && evento.MotivoCancelamento == 2 && evento.ReagendamentoId == 0) {
        //                                if (!$('#btnIrParaReagendamento' + key).is(":visible")) {
        //                                    $('.reagendamento' + key).show();
        //                                    $('#containerNotasCompromisso' + key).removeClass('col-md-12');
        //                                    $('#containerResultadoCompromisso' + key).removeClass('col-md-12');
        //                                    $('#containerNotasCompromisso' + key).addClass('col-md-6');
        //                                    $('#containerResultadoCompromisso' + key).addClass('col-md-6');
        //                                }
        //                            }
        //                        }
        //                }

        //                _public.Ed_NotasCompromisso.Set(evento.NotasCompromisso);

        //                if ((_private.criadoPorId != 0) && (_private.criadoPorId == moSessao.dataSession.UsuarioId)) {
        //                    $('.btn.btn-primary.btn:not(#btnIrParaReagendamento' + key + ',#btnIrParaOrdemServico' + key + ')').show();
        //                    $('.btn.btn-danger.btn.exclude').show();
        //                }

        //                if (evento.ReagendamentoId != undefined && evento.ReagendamentoId != null && evento.ReagendamentoId != 0) {
        //                    $('.btn.btn-primary.btn:not(#btnIrParaOrdemservico' + key).hide();
        //                    $('.btn.btn-danger.btn.exclude').hide();
        //                    $('#btnIrParaReagendamento' + key).show();

        //                    $('#btnIrParaReagendamento' + key).on('click', function () {
        //                        $(".bootbox.modal").modal("hide");
        //                        var eventoReagendamento = $('#field_agenda').fullCalendar('getEventSources')[0].events.find(x => x.id == evento.ReagendamentoId);
        //                        if (eventoReagendamento.allDay && eventoReagendamento.end != null && eventoReagendamento.start != eventoReagendamento.end) {
        //                            var dt = eventoReagendamento.end._d.addDays(-1);
        //                            eventoReagendamento.end._d = dt;
        //                        }
        //                        //_private.AbrirModalEvento(eventoReagendamento, new Date().getTime());
        //                    });

        //                    _public.Ed_TituloCompromisso.Disabled(true);
        //                    _public.Ed_TipoCompromisso.Disabled(true);
        //                    _public.Ed_ClientesProspects.Disabled(true);
        //                    _public.Ed_Contato.Disabled(true);
        //                    _public.Ed_Local.Disabled(true);
        //                    _public.Ed_DataInicial.Disabled(true);
        //                    _public.Ed_DataFinal.Disabled(true);
        //                    _public.Ed_Duracao.Disabled(true);
        //                    _public.Ed_Convidados.Disabled(true);
        //                    _public.Ed_StatusCompromisso.Disabled(true);
        //                    _public.Ed_MotivoCancelamento.Disabled(true);
        //                    _public.Ed_ResultadoCompromisso.Disabled(true);
        //                    _public.Ed_NotasCompromisso.Disabled(true);
        //                }

        //                if (evento.OrdemServicoId != undefined && evento.OrdemServicoId != null && evento.OrdemServicoId != 0) {
        //                    $('.btn.btn-primary.btn:not(#btnIrParaReagendamento' + key).hide();
        //                    $('.btn.btn-danger.btn.exclude').hide();
        //                    $('#btnIrParaOrdemServico' + key).show();

        //                    $('#btnIrParaOrdemServico' + key).on('click', function () {
        //                        moSessao.setCookieParametros("agenda-controller*" + + evento.OrdemServicoId);
        //                        window.open('/Manager/OrdemServico', '_blank');
        //                    });

        //                    _public.Ed_TituloCompromisso.Disabled(true);
        //                    _public.Ed_TipoCompromisso.Disabled(true);
        //                    _public.Ed_ClientesProspects.Disabled(true);
        //                    _public.Ed_Contato.Disabled(true);
        //                    _public.Ed_Local.Disabled(true);
        //                    _public.Ed_DataInicial.Disabled(true);
        //                    _public.Ed_DataFinal.Disabled(true);
        //                    _public.Ed_Duracao.Disabled(true);
        //                    _public.Ed_Convidados.Disabled(true);
        //                    _public.Ed_StatusCompromisso.Disabled(true);
        //                    _public.Ed_MotivoCancelamento.Disabled(true);
        //                    _public.Ed_ResultadoCompromisso.Disabled(true);
        //                    _public.Ed_NotasCompromisso.Disabled(true);
        //                }
        //            }
        //            else {
        //                if (evento._d != undefined || evento._d != null) {
        //                    var dt = evento._d;
        //                    _public.Ed_DataInicial.Set(dt);
        //                    _public.Ed_DataFinal.Set(dt);
        //                }
        //                $('.btn.btn-primary.btn:not(#btnIrParaReagendamento' + key + ',#btnIrParaOrdemServico' + key + ')').show();
        //            }
        //        },
        //        metodoDestruir: function () {
        //            if (evento.allDay && evento.end != null && evento.start != evento.end) {
        //                var dt = evento.end.add(1, "days");
        //                evento.end = dt;
        //            }
        //        },
        //        botoes: {
        //            personalizados: {
        //                exclude:
        //                {
        //                    label: labels['Excluir'].msg,
        //                    className: 'btn-danger btn exclude',
        //                    callback: function () {
        //                        if (_private.eventoId != 0) {
        //                            var exclusao = function () {
        //                                moAgenda.ExcluirEvento(_private.eventoId, function (t) {
        //                                    if (t.error != null) {
        //                                        showErrorMessage(t.error);
        //                                        return false;
        //                                    }
        //                                    $(".bootbox.modal").modal("hide");

        //                                    modBootbox.Loading('md_loading_excluir_compromisso');
        //                                    //modBootbox.Loading();

        //                                    var listaColaboradores = _private.componenteListaColaboradores.ObterItens();
        //                                    if (listaColaboradores.length > 0) {
        //                                        var listaSelecionados = listaColaboradores.filter(x => x.selecionado == true);
        //                                        _private.RemoverEventos(listaSelecionados)
        //                                        _private.ObterEventos(listaSelecionados);
        //                                    }

        //                                    showSuccess(t.success);
        //                                });
        //                            };
        //                            modBootbox.criarConfirmacaoExclusao(exclusao);
        //                            return false;
        //                        }
        //                        return true;
        //                    }
        //                },
        //                cancel:
        //                {
        //                    label: labels['Cancelar'].msg,
        //                    className: 'btn-default btn',
        //                    callback: function () {
        //                        return true;
        //                    }
        //                }
        //            }
        //        },
        //        mensagem:
        //            "<div class='row'>" +
        //            "	<div class='col-md-6'>" +
        //            "		<label>" + labels['TituloCompromisso'].msg + "</label>" +
        //            "		<div id='editTituloCompromisso" + key + "'/>" +
        //            "       <br />" +
        //            "		<label>" + labels['TipoCompromisso'].msg + "</label>" +
        //            "       <div id='editTipoCompromisso" + key + "' />" +
        //            "       <br />" +
        //            "       <div class='row' style='display:none'>" +
        //            "           <div class='col-md-6'>" +
        //            "		        <label>" + labels['SeraVinculadoCotacao'].msg + "</label>" +
        //            "           </div>" +
        //            "           <div class='col-md-6'>" +
        //            "		        <div id='cotacao-vinculada" + key + "' />" +
        //            "           </div>" +
        //            "       </div>" +
        //            "		<div id='console-cotacao-vinculada" + key + "' style='display:none'>" +
        //            "			<label>" + labels['Cotacao'].msg + "</label>" +
        //            "			<select id='cotacao-vinculada-select' style='width:98%;' class='form-control'>" +
        //            "				<option value=''> </option>" +
        //            "				<option value='1'>Negócio 01 - Fullarm</option>" +
        //            "				<option value='2'>Negócio 02 - Fullcontrol</option>" +
        //            "				<option value='3'>Negócio 03 - Fulltrack</option>" +
        //            "			</select>" +
        //            "		</div>" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<label>" + labels['ClientesProspects'].msg + "</label>" +
        //            "				<div id='editClientesProspects" + key + "' />" +
        //            "		        <br />" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div class='row' id='containerContato" + key + "' style='display:none; padding-bottom: 15px'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<label>" + labels['Contato'].msg + "</label>" +
        //            "				<div id='editContato" + key + "' />" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<label>" + labels['Local'].msg + "</label>" +
        //            "				<div id='editLocal" + key + "' />" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<br />" +
        //            "       <div class='row'>" +
        //            "           <div class='col-md-1'>" +
        //            "		        <div id='duracao-compromisso" + key + "' />" +
        //            "           </div>" +
        //            "           <div class='col-md-11'>" +
        //            "		        <label style = 'padding-top: 4px'>" + labels['CompromissoDuraDiaTodo'].msg + "</label>" +
        //            "           </div>" +
        //            "       </div>" +
        //            "		<br />" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-6'>" +
        //            "				<label>" + labels['DataInicial'].msg + "</label>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<div id='editDataInicial" + key + "'/>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<br />" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<label>" + labels['DataFinal'].msg + "</label>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div class='row' style='padding-bottom: 15px'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<div id='editDataFinal" + key + "' />" +
        //            "			</div>" +
        //            "		</div>" +
        //            "	</div>" +
        //            "	<div class='col-md-6'>" +
        //            "		    <label>" + labels['Convidados'].msg + "</label>" +
        //            "           <div id='editConvidados" + key + "' />" +
        //            "           <br />" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-6'>" +
        //            "				<label>" + labels['StatusCompromisso'].msg + "</label>" +
        //            "				<br>" +
        //            "				<div id='editStatusCompromisso" + key + "' />" +
        //            "			</div>" +
        //            "			<div id='containerMotivoCancelamento" + key + "' class='col-md-6' style='display:none'>" +
        //            "				<label>" + labels['MotivoCancelamento'].msg + "</label>" +
        //            "				<br>" +
        //            "               <div id='editMotivoCancelamento" + key + "' />" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<br />" +
        //            "		<div class='row'>" +
        //            "			<div id='containerNotasCompromisso" + key + "' class='col-md-12' style='padding-bottom: 5px';>" +
        //            "				<div id='editNotasCompromisso" + key + "' />" +
        //            "			</div>" +
        //            "			<div id='containerResultadoCompromisso" + key + "' class='col-md-12' style='visible: false'>" +
        //            "				<div id='editResultadoCompromisso" + key + "' />" +
        //            "			</div>" +
        //            "		</div>" +
        //            "       <br/> " +
        //            "       <div class='row reagendamento" + key + "' style='display: none'>" +
        //            "           <div class='col-md-1'>" +
        //            "		        <div id='duracao-compromisso-reagendamento" + key + "' />" +
        //            "           </div>" +
        //            "           <div class='col-md-11'>" +
        //            "		        <label style = 'padding-top: 4px'>" + labels['CompromissoDuraDiaTodo'].msg + " (" + labels['Reagendamento'].msg + ")" + "</label>" +
        //            "           </div>" +
        //            "       </div>" +
        //            "		<br />" +
        //            "		<div class='row reagendamento" + key + "' style='display: none'>" +
        //            "			<div class='col-md-6'>" +
        //            "				<label>" + labels['DataInicial'].msg + " (" + labels['Reagendamento'].msg + ")" + "</label>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div class='row reagendamento" + key + "' style='display: none'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<div id='editDataInicialReagendamento" + key + "'/>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<br />" +
        //            "		<div class='row reagendamento" + key + "' style='display: none'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<label>" + labels['DataFinal'].msg + " (" + labels['Reagendamento'].msg + ")" + "</label>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div class='row reagendamento" + key + "' style='display: none'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<div id='editDataFinalReagendamento" + key + "' />" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-12 centerAlign'>" +
        //            "				<div id='containerBtnIrParaReagendamento" + key + "'>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "       <br/ >" +
        //            "       <br/ >" +
        //            "		<div class='row'>" +
        //            "			<div class='col-md-12 centerAlign'>" +
        //            "				<div id='containerBtnIrParaOrdemServico" + key + "'>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "	</div>" +
        //            "		<div class='row' style='display: none'>" +
        //            "			<div class='col-md-12'>" +
        //            "				<label>Deseja criar um novo compromisso com base no atual?</label>" +
        //            "				<input id='toggle-event-reagendamento-compromisso' type='checkbox' data-toggle='toggle' data-size='small' data-on='Sim' data-off='Não'>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "		<div id='areaReagendamento' style='display:none;'>" +
        //            "			<div class='row'>" +
        //            "				<div class='col-md-12'>" +
        //            "					<div id='novoCompromisso' class='form-control' />" +
        //            "				</div>" +
        //            "			</div>" +
        //            "			<br />" +
        //            "			<br />" +
        //            "			<div class='row' id='labelsReagendamento'>" +
        //            "				<div class='col-md-6'>" +
        //            "					<label>Data</label>" +
        //            "				</div>" +
        //            "				<div class='col-md-6'>" +
        //            "					<label>Hora</label>" +
        //            "				</div>" +
        //            "			</div>" +
        //            "			<div class='row' id='txtsReagendamento'>" +
        //            "				<div class='col-md-6'>" +
        //            "					<input type='text' class='form-control'>" +
        //            "				</div>" +
        //            "				<div class='col-md-6'> " +
        //            "					<input type='text' class='form-control'>" +
        //            "				</div> " +
        //            "			</div> " +
        //            "			<br> " +
        //            "			<div class='row' id='clonarConvidados'>" +
        //            "				<div class='form-check'> " +
        //            "					<input class='form-check-input' type='checkbox' value='' id='defaultCheck1' />" +
        //            "					<label class='form-check-label'>Clonar Convidados (Contatos)</label>" +
        //            "				</div>" +
        //            "			</div>" +
        //            "			<div clas='row' id='clonarColaboradores'>" +
        //            "				<div class='form-check'>" +
        //            "					<input class='form-check-input' type='checkbox' value='' id='defaultCheck1' />" +
        //            "					<label class='form-check-label' for='defaultCheck1'>Clonar Convidados (Colaboradores)</label>" +
        //            "				</div>" +
        //            "			</div>" +
        //            "		</div>" +
        //            "	</div>" +
        //            "</div>"
        //    };
        //    modBootbox.criarFormModal(config);

        //    $('.modal-footer').prepend(
        //        '<button type="button" id="btnConfirmar" class="btn btn-primary">' + labels['Confirmar'].msg + '</button>'
        //    );


        //    $('#btnConfirmar').on('click', function () {

        //        var tipoCompromisso = _public.Ed_TipoCompromisso.Get();
        //        var statusCompromisso = _public.Ed_StatusCompromisso.Get();

        //        if (statusCompromisso == 2) {


        //            //antes de prosseguir, valida o evento.
        //            var retValidaEvento = _private.ValidaESalvaEvento();


        //            if (retValidaEvento == true) {
        //                moCompromissoFormulario.ObterFormulariosPorCompromissoAtivoComPergunta(tipoCompromisso, function (retorno) {
        //                    _private.formularios = retorno;
        //                });

        //                //Se tiver formulário chama os mesmos, se n tiver hide no evento.
        //                if (_private.formularios.length > 0) {
        //                    _private.verificaFormulario();
        //                } else {
        //                    bootbox.hideAll();
        //                }
        //            }

        //        } else {

        //            var retValidaEventoAbertoOuCancelado = _private.ValidaESalvaEvento();

        //            if (retValidaEventoAbertoOuCancelado) {
        //                bootbox.hideAll();
        //            }
        //        }

        //        return false;
        //    });
        //};
        _private.abrirModalEvento = (evento) => {
            bootbox.dialog({
                className: "modalAgenda",
                closeButton: true,
                title: "Evento",
                message: `<div style="padding-bottom: 10px">
                              <input type="text" class="form-control required" id="tituloCompromisso" maxlength="50" placeholder="Título do compromisso">
                          </div>
                          <div style="padding-bottom:10px">
                              <textarea class="form-control required" style="resize:none" id="descricao" maxlength="255" placeholder="Descrição"></textarea>
                          </div>
                          <div class="form-group">
                              <div class='input-group date' id='dataInicial'>
                                  <input type='text' class="form-control required"/>
                                  <span class="input-group-addon">
                                      <span class="glyphicon glyphicon-calendar"></span>
                                  </span>
                              </div>
                          </div>
                          <div class="form-group">
                              <div class='input-group date' id='dataFinal'>
                                  <input type='text' class="form-control required"/>
                                  <span class="input-group-addon">
                                      <span class="glyphicon glyphicon-calendar"></span>
                                  </span>
                              </div>
                          </div>
                          <select id="convidados" class="js-example-basic-multiple"></select>`,
                size: "medium",
                buttons: {
                    confirm: {
                        label: 'Salvar',
                        className: 'btn btn-primary',
                        callback: () => {
                            let objeto = {
                                id: _private.eventoId,
                                title: $('#tituloCompromisso').val(),
                                Descricao: $('#descricao').val(),
                                start: $('#dataInicial').data("DateTimePicker").date(),
                                end: $('#dataFinal').data("DateTimePicker").date(),
                                CriadorId: sessionStorage.getItem("usuarioId")
                            };
                            appAjax.post(objeto, "/api/SalvarEvento/", (retorno) => {
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
                        }
                    },
                    cancel:
                    {
                        label: 'Cancelar',
                        className: 'btn btn-default',
                        callback: () => {
                            return true;
                        }
                    }
                },
                onEscape: null,
                animate: true
            }).find("div.modal-dialog")
                .init(function () {
                    //Metodo Iniciar
                    //$('.btn.btn-primary.btn').hide();
                    //$('.btn.btn-danger.btn.exclude').hide();

                    $('#dataInicial').datetimepicker({
                        locale: 'pt-br',
                        useCurrent: true,
                        sideBySide: true,
                        widgetPositioning: {
                            horizontal: 'auto',
                            vertical: 'auto'
                        }
                    });
                    $('#dataFinal').datetimepicker({
                        locale: 'pt-br',
                        useCurrent: true,
                        sideBySide: true,
                        widgetPositioning: {
                            horizontal: 'auto',
                            vertical: 'auto'
                        }
                    });
                    $('#convidados').select2({ data: _private.colaboradores });
                }).unbind('shown.bs.modal').on('shown.bs.modal', function () {
                    //Metodo Mostrar
                    _private.eventoId = evento.id == undefined ? 0 : evento.id;
                    if (_private.eventoId != 0) {
                        $("#tituloCompromisso").val(evento.title);
                        $("#descricao").val(evento.Descricao);
                        $("#dataInicial").data("DateTimePicker").date(evento.start);
                        $("#dataFinal").data("DateTimePicker").date(evento.end);
                    }
                    else {
                        if (evento._d != undefined || evento._d != null) {
                            let dt = new Date(evento._d);
                            $("#dataInicial").data("DateTimePicker").date(dt);
                            $("#dataFinal").data("DateTimePicker").date(dt);
                        }
                    }
                    //$('.bootbox.modal').removeAttr('tabindex');
                }).unbind('hidden.bs.modal').on("hidden.bs.modal", function (e) {
                    //Metodo Destruir

                    // Ajusta o foco quando tem mais de um modal aberto
                    //if (e.target === this) {
                    //    if (typeof dialog !== 'undefined') {
                    //        dialog.remove();
                    //        $(e.target).data('bs.modal', null);
                    //    }
                    //}
                    //if ($('.modal.in').css('display') == 'block') {
                    //    //atenção 2018-06-12
                    //    //$('body').addClass('modal-open');
                    //} else {
                    //    $('body').removeClass('modal-open');
                    //}
                });
        };

        /* Fim Modal Evento ------------------------------*/

        _private.carregarAgenda = () => {
            $('#field_agenda').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay,listMonth'
                },
                locale: 'pt-br',
                timezone: 'pt-br',
                buttonIcons: {
                    prev: 'left-single-arrow',
                    next: 'right-single-arrow',
                    prevYear: 'left-double-arrow',
                    nextYear: 'right-double-arrow'
                }, // show the prev/next text
                displayEventTime: true,
                lazyFetching: false,
                loading: function (isLoading, view) { },
                weekNumbers: true,
                navLinks: true, // can click day/week names to navigate views
                editable: false,
                eventDurationEditable: false,
                nextDayThreshold: "00:00:00",
                views: {
                    listMonth: { buttonText: "Compromissos do mês" }
                },
                allDaySlot: false,
                eventDragStop: function () {
                    $('*').qtip('hide');
                },
                eventDrop: function (evento, delta, revertFunc) {
                },
                eventLimit: true,
                //eventRender: (evento, element, view) => {
                //    let statusCompromisso;
                //    switch (parseInt(evento.StatusCompromisso)) {
                //        case 1:
                //            {
                //                element.find(".fc-title").prepend("<i class='fa fa-calendar'></i> ");
                //                statusCompromisso = "Aberto";
                //                break;
                //            }
                //        case 2:
                //            {
                //                element.find(".fc-title").prepend("<i class='fa fa-check'></i> ");
                //                statusCompromisso = "Concluído";
                //                break;
                //            }
                //        case 3:
                //            {
                //                element.find(".fc-title").prepend("<i class='fa fa-check'></i> ");
                //                statusCompromisso = "Cancelado";
                //                break;
                //            }
                //        default:
                //            break;
                //    }
                //    var local = evento.Local == null ? 'Indefinido' : evento.Local;
                //    if (!evento.allDay) {
                //        let template = "<div style='font-weight:bold;'>" + evento.title + "</div>" +
                //            "<div><span style='font-weight:bold'>Criado por: </span>" + evento.CriadoPorNome + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['NomeRazaosocial'].msg + ": </span>" + evento.RazaoSocial + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['Horario'].msg + ": </span>" + evento.HorarioInicio + " - " + evento.HorarioFim + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['Local'].msg + ": </span>" + local + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['Status'].msg + ": </span>" + statusCompromisso + "</div>";
                //    }
                //    else {
                //        let template = "<div style='font-weight:bold;'>" + evento.title + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['CriadoPor'].msg + ": </span>" + evento.CriadoPorNome + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['NomeRazaosocial'].msg + ": </span>" + evento.RazaoSocial + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['Local'].msg + ": </span>" + local + "</div>" +
                //            "<div><span style='font-weight:bold'>" + labels['Status'].msg + ": </span>" + statusCompromisso + "</div>";

                //    }
                //    element.qtip({
                //        content: { text: template },
                //        overwrite: true,
                //        position: {
                //            container: $('.fc-day-grid-event fc-h-event fc-event fc-start fc-end'),
                //            viewport: $(window),
                //            target: 'mouse',
                //            adjust: { x: 5, y: 5 }
                //        },
                //        style: 'qtip-bootstrap'
                //    });
                //},
                eventClick: function (evento, jsEvent, view) {
                    _private.abrirModalEvento(evento);
                },
                dayClick: function (date, jsevent, view) {
                    var dt = moment(date._d).locale('pt-br').utc().format('YYYY/MM/DD');
                    date._d = dt;
                    _private.abrirModalEvento(date);
                }
            });
        };

        /* Métodos públicos */

        _public.Initialize = function () {
            _private.carregarAgenda();
            _private.definirComponentes();
        };

        return _public;
    })();

    window.AtualizarConteudoPagina = undefined;
    window.AtualizarConteudoPagina = app.Initialize;
    window.appAgenda = app;

    $(document).ready(() => appAgenda.Initialize());

})(window, document, $);
