using GestaoEventos.Classes;
using GestaoEventos.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;

namespace GestaoEventos.Controllers
{
    /// <summary>
    /// Summary Placeholder
    /// </summary>
    [RoutePrefix("api")]
    public class CadastrosApiController : ApiController
    {
        private GestaoEventosContext db = new GestaoEventosContext();
        #region Usuario
        [HttpPost]
        [Route("CadastrarNovoUsuario")]
        public RetornoViewModel CadastrarNovoUsuario(Usuario usuario)
        {
            try
            {
                if (UsuarioExiste(usuario.Login))
                    throw new Exception("Já existe um usuário cadastrado com o e-mail fornecido. Tente usar outro");

                db.Usuario.Add(usuario);
                db.SaveChanges();
                return new RetornoViewModel { Sucesso = "Usuário cadastrado com sucesso" };
            }
            catch (Exception e)
            {
                return new RetornoViewModel { Erro = e.Message };
            }
        }

        [HttpGet]
        [Route("LogarUsuario")]
        public RetornoViewModel LogarUsuario(string login, string senha)
        {
            try
            {
                var usuario = db.Usuario.Where(x => x.Login == login).FirstOrDefault();
                if (usuario == null)
                    throw new Exception("Usuário não encontrado");
                else
                    if (usuario.Senha != senha)
                    throw new Exception("Senha inválida");

                return new RetornoViewModel() { Entidade = usuario };
            }
            catch (Exception e)
            {
                return new RetornoViewModel { Erro = e.Message };
            }
        }

        [HttpGet]
        [Route("ObterTodosUsuarios")]
        public List<Usuario> ObterTodosUsuarios()
        {
            return db.Usuario.ToList();
        }

        private bool UsuarioExiste(string login)
        {
            return (db.Usuario.Count(x => x.Login.Contains(string.IsNullOrEmpty(login) ? "" : login)) > 0);
        }
        #endregion

        #region Agenda
        [HttpGet]
        [Route("ObterEventos")]
        public List<EventoDTO> ObterEventos(long usuarioId)
        {
            List<Evento> eventos = db.Evento.Include("Convidados").Include("Convidados.Usuario").Where(x => x.Criador.Id == usuarioId).ToList();
            eventos.AddRange(db.Evento.Include("Convidados").Include("Convidados.Usuario").Where(x => x.Convidados.Any(y => y.Usuario.Id == usuarioId) && x.Criador.Id != usuarioId).ToList());
            List<EventoDTO> eventosDTO = new List<EventoDTO>();

            foreach (var evento in eventos)
            {
                eventosDTO.Add(new EventoDTO()
                {
                    id = evento.Id,
                    title = evento.TituloCompromisso,
                    Descricao = evento.Descricao,
                    start = evento.DataInicial,
                    end = evento.DataFinal,
                    CriadorId = evento.Criador != null ? evento.Criador.Id : 0,
                    LoteEventosId = usuarioId,
                    Convidados = evento.Convidados.Select(x => x.Usuario.Id).ToList<long>()
                });
            }
            return eventosDTO;
        }

        public IQueryable<EventoXUsuario> AvaliarDisponibilidadeConvidados(long eventoId, List<long> usuarios, DateTime dataInicial, DateTime dataFinal)
        {
            var usuariosIndisponiveis = db.Evento.Include("Convidados").Include("Convidados.Usuario")
                .Where(x => x.Id != eventoId
                && dataInicial <= x.DataFinal
                && dataFinal >= x.DataInicial);
            var teste = usuariosIndisponiveis.SelectMany(y => y.Convidados.Where(z => usuarios.Contains(z.Usuario.Id)));
            return teste;
        }

        [HttpPost]
        [Route("SalvarEvento")]
        public RetornoViewModel SalvarEvento(EventoDTO eventoDTO)
        {
            try
            {
                Evento evento = new Evento();
                if (eventoDTO.id != 0)
                {
                    evento = db.Evento.Find(eventoDTO.id);
                }
                else
                {
                    evento = new Evento();
                }

                evento.TituloCompromisso = eventoDTO.title;
                evento.Descricao = eventoDTO.Descricao;
                evento.DataInicial = eventoDTO.start;
                evento.DataFinal = eventoDTO.end;
                evento.Criador = db.Usuario.Find(eventoDTO.CriadorId);
                evento.Convidados.Clear();

                foreach (var convidado in eventoDTO.Convidados)
                {
                    Usuario usuario = db.Usuario.Find(convidado);
                    evento.Convidados.Add(new EventoXUsuario()
                    {
                        Usuario = usuario,
                        Evento = evento
                    });
                }
                if (evento.Id == 0) {
                    db.Entry(evento).State = EntityState.Modified;
                }

                db.Evento.Add(evento);
                db.SaveChanges();
                return new RetornoViewModel() { Sucesso = "Evento salvo com sucesso" };
            }
            catch (Exception e)
            {
                return new RetornoViewModel() { Erro = e.Message };
            }
        }

        [HttpPost]
        [Route("ExcluirEvento")]
        public RetornoViewModel ExcluirEvento(long eventoId)
        {
            try
            {
                Evento evento = db.Evento.Find(eventoId);
                db.Evento.Remove(evento);
                db.SaveChanges();
                return new RetornoViewModel() { Sucesso = "Evento removido com sucesso" };
            }
            catch (Exception e)
            {
                return new RetornoViewModel() { Erro = e.Message };
            }
        }

        #endregion

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}