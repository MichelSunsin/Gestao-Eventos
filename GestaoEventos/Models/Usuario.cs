using System.ComponentModel.DataAnnotations.Schema;

namespace GestaoEventos.Models
{
    [Table("Usuario")]
    public class Usuario
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Login { get; set; }
        public string Senha { get; set; }
    }
}