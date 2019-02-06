﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestaoEventos.Models
{
    [Table("Evento")]
    public class Evento
    {
        public long Id { get; set; }
        public string Descricao { get; set; }
        public DateTime DataInicial { get; set; }
        public DateTime DataFinal { get; set; }
        public Usuario Criador { get; set; }
        public List<EventoXUsuario> Convidados { get; set; }
    }
}