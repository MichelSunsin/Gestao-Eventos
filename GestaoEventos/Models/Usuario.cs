using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestaoEventos.Models
{
    public class Usuario
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Login { get; set; }
        public string Senha { get; set; }
    }
}