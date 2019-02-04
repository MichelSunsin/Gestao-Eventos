namespace GestaoEventos.Models
{
    public class EventoXUsuario
    {
        public long Id { get; set; }
        public Evento Evento { get; set; }
        public Usuario Usuario { get; set; }
    }
}