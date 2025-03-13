using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Entrevista.Models;

public class Usuario
{
    [JsonConstructor]
    public Usuario(int id, string nombre, string apellido, string correo, int cedula, string contrasena)
    {
        Id = id;
        Nombre = nombre;
        Apellido = apellido;
        Correo = correo;
        Cedula = cedula;
        Contrasena = contrasena;
        UltimoIngreso = DateTime.Now;
        GenerarClasificacion();
        GenerarPuntaje();
    }
    public Usuario(int id, string nombre, string apellido, string correo, int cedula, string contrasena, string? clasificacion, int? puntaje, DateTime ultimoIngreso)
    {
        Id = id;
        Nombre = nombre;
        Apellido = apellido;
        Correo = correo;
        Cedula = cedula;
        Contrasena = contrasena;
        Clasificacion = clasificacion;
        Puntaje = puntaje;
        UltimoIngreso = ultimoIngreso;
    }

    public void Login()
    {
        UltimoIngreso = DateTime.Now;
        GenerarClasificacion();
    }

    public void Update(Usuario usuario)
    {
        Nombre = usuario.Nombre;
        Apellido = usuario.Apellido;
        Correo = usuario.Correo;
        Cedula = usuario.Cedula;
        // Contrasena = usuario.Contrasena;
        GenerarClasificacion();
        GenerarPuntaje();
    }

    public void GenerarPuntaje()
    {
        int puntaje = 0;
        if (Nombre.Length > 10) puntaje += 10;
        else if (Nombre.Length > 5) puntaje += 5;
        if (Correo.Contains("gmail.com")) puntaje += 40;
        else if (Correo.Contains("hotmail.com")) puntaje += 20;
        else puntaje += 10;

        Puntaje = puntaje;
    }

    public void GenerarClasificacion()
    {
        // Hechicero: Último acceso en las últimas 12 horas.
        if (UltimoIngreso > DateTime.Now.AddHours(-12))
        {
            Clasificacion = "Hechicero";
            return;
        }
        // Luchador: Último acceso entre 12 y 48 horas.
        if (UltimoIngreso > DateTime.Now.AddHours(-48))
        {
            Clasificacion = "Luchador";
            return;
        }
        // Explorador: Último acceso entre 2 y 7 días.
        if (UltimoIngreso > DateTime.Now.AddDays(-7))
        {
            Clasificacion = "Explorador";
            return;
        }
        // Olvidado: Último acceso hace más de 7 días.
        Clasificacion = "Olvidado";
    }
    public int Id { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "El nombre no puede exceder 500 caracteres.")]
    public string Nombre { get; private set; } = string.Empty;

    [Required]
    [StringLength(500, ErrorMessage = "El apellido no puede exceder 500 caracteres.")]
    public string Apellido { get; private set; } = string.Empty;

    [Required]
    [StringLength(500, ErrorMessage = "El correo no puede exceder 500 caracteres.")]
    public string Correo { get; private set; } = string.Empty;

    [Required]
    public int Cedula { get; private set; } = 0;
    [Required]
    public string Contrasena { get; private set; } = string.Empty;
    public string? Clasificacion { get; private set; }
    public int? Puntaje { get; private set; }
    public DateTime UltimoIngreso { get; private set; }
}


public class LoginUsuarioRequest()
{
    [Required]
    public string Correo { get; set; } = string.Empty;

    [Required]
    public string Contrasena { get; set; } = string.Empty;
}