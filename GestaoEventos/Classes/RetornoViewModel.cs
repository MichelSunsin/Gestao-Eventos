using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestaoEventos.Classes
{
    public class RetornoViewModel
    {
        public object Entidade { get; set; }
        public string Sucesso { get; set; }
        public string Erro { get; set; }
    }
}