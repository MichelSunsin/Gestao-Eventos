using System.ComponentModel.DataAnnotations.Schema;

namespace GestaoEventos.Models
{
    public class EventoXUsuario
    {
        public long Id { get; set; }
        //[ForeignKey("Evento")]
        //public long? EventoId { get; set; }
        public Evento Evento { get; set; }
        //[ForeignKey("Usuario")]
        //public long? UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}