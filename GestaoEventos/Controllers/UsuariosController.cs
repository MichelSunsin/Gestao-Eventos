using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using GestaoEventos.Models;

namespace GestaoEventos.Controllers
{
    /// <summary>
    /// Summary Placeholder
    /// </summary>
    //[RoutePrefix("api/Usuarios")]
    public class UsuariosController : ApiController
    {
        private GestaoEventosContext db = new GestaoEventosContext();

        // GET: api/Usuarios
        [HttpGet]
        [Route("api/NotificationAPI")]
        public List<Usuario> ObterUsuariosPorLogin(long Id)
        {
            //using (db)
            //{
            //    db.Usuarios.SqlQuery()
            //}
            return db.Usuarios.ToList();
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
        [ResponseType(typeof(Usuario))]
        public IHttpActionResult PostObter(Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //db.Usuarios.Add(usuario);
            //db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = usuario.Id }, usuario);
        }

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

        private bool UsuarioExists(long id)
        {
            return db.Usuarios.Count(e => e.Id == id) > 0;
        }
    }
}