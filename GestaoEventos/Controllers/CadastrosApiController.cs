using GestaoEventos.Classes;
using GestaoEventos.Models;
using System;
using System.Collections.Generic;
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
                return new RetornoViewModel { Successo = "Usuário cadastrado com sucesso" };
            }
            catch (Exception e)
            {
                return new RetornoViewModel { Erro = e.Message };
            }
        }

        [HttpPost]
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

                return new RetornoViewModel();
            }
            catch (Exception e)
            {
                return new RetornoViewModel { Erro = e.Message };
            }
        }

        [HttpGet]
        [Route("ObterTodosUsuarios")]
        public List<Usuario> ObterTodos()
        {
            return db.Usuario.ToList();
        }
        //// GET: api/Usuarios/5
        //[ResponseType(typeof(Usuario))]
        //public IHttpActionResult GetUsuario(long id)
        //{
        //    Usuario usuario = db.Usuarios.Find(id);
        //    if (usuario == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(usuario);
        //}

        //// PUT: api/Usuarios/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutUsuario(long id, Usuario usuario)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != usuario.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(usuario).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!UsuarioExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST: api/Usuarios
        //[ResponseType(typeof(Usuario))]
        //public IHttpActionResult PostObter(Usuario usuario)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    //db.Usuarios.Add(usuario);
        //    //db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = usuario.Id }, usuario);
        //}

        //// DELETE: api/Usuarios/5
        //[ResponseType(typeof(Usuario))]
        //public IHttpActionResult DeleteUsuario(long id)
        //{
        //    Usuario usuario = db.Usuarios.Find(id);
        //    if (usuario == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Usuarios.Remove(usuario);
        //    db.SaveChanges();

        //    return Ok(usuario);
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UsuarioExiste(string login)
        {
            return (db.Usuario.Count(x => x.Login.Contains(string.IsNullOrEmpty(login) ? "" : login)) > 0);
        }
    }
}