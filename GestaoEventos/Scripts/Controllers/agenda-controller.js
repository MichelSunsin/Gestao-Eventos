; (function (window, document, $, undefined) {
    'use strict';

    var app = (function () {
        var _private = {};
        var _public = {};

        /* Variáveis privadas                             */
        /*------------------------------------------------*/
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
        _private.alerta = (tipo, mensagem) => {
            $('.alert').alert('close');
            $('body').prepend(`<div class="alert alert-${tipo} alert-dismissable" data-dismiss="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                ${mensagem}
                             </div>`);
            $('.alert').show();
        };

        _private.recarregarEventos = (newEventSource) => {
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
        };

        _private.obterEventos = (usuarioId, cor) => {
            let currentDataSource = $('#field_agenda').fullCalendar('getEventSources')[0];
            if (currentDataSource != undefined) {
                let eventosCarregadosAnteriormente = currentDataSource.rawEventDefs.filter(x => x.LoteEventosId == usuarioId);
                if (eventosCarregadosAnteriormente.length == 0) {
                    appAjax.get_NoCacheAsync(undefined, `/api/ObterEventos?usuarioId=${usuarioId}`, (retorno) => {
                        retorno.forEach((item) => {
                            item.color = cor;
                        });
                        Array.prototype.push.apply(currentDataSource.rawEventDefs, retorno);
                        _private.recarregarEventos(currentDataSource.rawEventDefs);
                    });
                }
            }
            else {
                appAjax.get_NoCacheAsync(undefined, `/api/ObterEventos?usuarioId=${usuarioId}`, (retorno) => {
                    retorno.forEach((item) => {
                        item.color = cor;
                    });
                    _private.recarregarEventos(retorno);
                });
            }
        };

        _private.removerEventos = (usuarioId) => {
            let currentDataSource = $('#field_agenda').fullCalendar('getEventSources')[0];
            if (currentDataSource != undefined) {
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

        _private.abrirModalEvento = (evento) => {
            if (evento.id == undefined) {
                evento.id = 0;
            }
            bootbox.dialog({
                className: "modalAgenda",
                closeButton: true,
                title: "Evento",
                message: `<div style="padding-bottom: 10px">
                              <label>Título do compromisso</label>
                              <input type="text" class="form-control required" id="tituloCompromisso" maxlength="50" placeholder="Título do compromisso">
                          </div>
                          <div style="padding-bottom:10px">
                              <label>Descrição</label>
                              <textarea class="form-control required" style="resize:none" id="descricao" maxlength="255" placeholder="Descrição"></textarea>
                          </div>
                          <div class="form-group">
                              <label>Data inicial</label>
                              <div class='input-group date' id='dataInicial'>
                                  <input type='text' class="form-control required"/>
                                  <span class="input-group-addon">
                                      <span class="glyphicon glyphicon-calendar"></span>
                                  </span>
                              </div>
                          </div>
                          <div class="form-group">
                              <label>Data final</label>
                              <div class='input-group date' id='dataFinal'>
                                  <input type='text' class="form-control required"/>
                                  <span class="input-group-addon">
                                      <span class="glyphicon glyphicon-calendar"></span>
                                  </span>
                              </div>
                          </div>
                          <div>
                              <label>Convidados</label>
                              <select id="convidados" class="js-example-basic-multiple" multiple='multiple' style='width:100%'></select>
                          </div>`,
                size: "medium",
                buttons: {
                    confirm: {
                        label: 'Salvar',
                        className: 'btn btn-primary',
                        callback: () => {
                            let objeto = {
                                id: evento.id,
                                title: $('#tituloCompromisso').val(),
                                Descricao: $('#descricao').val(),
                                start: new Date($('#dataInicial').data("DateTimePicker").date()),
                                end: new Date($('#dataFinal').data("DateTimePicker").date()),
                                CriadorId: sessionStorage.getItem("usuarioId")
                            };
                            let listaConvidados = [];
                            $('#convidados').val().forEach((item) => {
                                listaConvidados.push(parseInt(item));
                            });
                            objeto.Convidados = listaConvidados;
                            appAjax.post(objeto, "/api/SalvarEvento/", (retorno) => {
                                if (retorno.Erro != null) {
                                    _private.alerta("warning", retorno.Erro);
                                    return false;
                                }
                                _private.alerta("success", retorno.Sucesso);
                                $('.colaborador').each((i, obj) => {
                                    if ($(obj).data('selected') == true) {
                                        let usuarioId = $(obj).data('id');
                                        let cor = $(obj).data('cor');
                                        _private.removerEventos(usuarioId);
                                        _private.obterEventos(usuarioId, cor);
                                    }
                                });
                            });
                        }
                    },
                    exclude:
                    {
                        label: 'Excluir',
                        className: 'btn btn-danger',
                        callback: () => {
                            appAjax.post(undefined, `/api/ExcluirEvento?eventoId=${evento.id}`, (retorno) => {
                                if (retorno.Erro != null) {
                                    _private.alerta("warning", retorno.Erro);
                                    return false;
                                }
                                _private.alerta("success", retorno.Sucesso);
                                $('.colaborador').each((i, obj) => {
                                    if ($(obj).data('selected') == true) {
                                        let usuarioId = $(obj).data('id');
                                        let cor = $(obj).data('cor');
                                        _private.removerEventos(usuarioId);
                                        _private.obterEventos(usuarioId, cor);
                                    }
                                });
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
                .init(() => {
                    //Metodo Iniciar
                    //$('.btn.btn-primary.btn').hide();
                    if (evento.id == 0)
                        $('.btn.btn-danger').hide();

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
                    $('#convidados').select2({ data: _private.colaboradores.filter(x => x.id != sessionStorage.getItem("usuarioId")) });
                }).unbind('shown.bs.modal').on('shown.bs.modal', () => {
                    //Metodo Mostrar
                    if (evento.id != 0) {
                        $("#tituloCompromisso").val(evento.title);
                        $("#descricao").val(evento.Descricao);
                        $("#dataInicial").data("DateTimePicker").date(evento.start);
                        $("#dataFinal").data("DateTimePicker").date(evento.end == null ? evento.start : evento.end);
                        $('#convidados').val(evento.Convidados).trigger('change');
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
                timezone: 'America/Sao_Paulo',
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
                eventClick: (evento, jsEvent, view) => {
                    _private.abrirModalEvento(evento);
                },
                dayClick: (date, jsevent, view) => {
                    var dt = moment(date._d).locale('pt-br').utc().format('YYYY/MM/DD');
                    date._d = dt;
                    _private.abrirModalEvento(date);
                }
            });
        };

        /* Métodos públicos */

        _public.Initialize = () => {
            if (sessionStorage.getItem("usuarioId") == null) {
                window.location.href = "/";
            }
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
