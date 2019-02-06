using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestaoEventos.Classes
{
    public class EventoDTO
    {
        public EventoDTO()
        {
            Convidados = new List<long>();
        }
        public long id { get; set; }
        public string title { get; set; }
        public bool allDay { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        public string Descricao { get; set; }
        public long CriadorId { get; set; }
        public long LoteEventosId { get; set; }
        public List<long> Convidados { get; set; }
    }
}