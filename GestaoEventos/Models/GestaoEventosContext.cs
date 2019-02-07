using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace GestaoEventos.Models
{
    public class GestaoEventosContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public GestaoEventosContext() : base("name=GestaoEventosContext")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Evento>()
                .HasMany(x => x.Convidados).WithOptional(y => y.Evento).WillCascadeOnDelete(true);

            //modelBuilder.Entity<EventoXUsuario>()
                //.HasOptional<Evento>(s => s.Evento)
                //.WithMany()
                //.WillCascadeOnDelete(false);
            //modelBuilder.Entity<EventoXUsuario>()
                //.HasOptional<Usuario>(s => s.Usuario)
                //.WithMany()
                //.WillCascadeOnDelete(false);
        }

        public System.Data.Entity.DbSet<GestaoEventos.Models.Usuario> Usuario { get; set; }
        public System.Data.Entity.DbSet<GestaoEventos.Models.Evento> Evento { get; set; }
        public System.Data.Entity.DbSet<GestaoEventos.Models.EventoXUsuario> EventoXUsuario { get; set; }
    }
}
