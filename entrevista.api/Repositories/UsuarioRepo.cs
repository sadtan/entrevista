using Entrevista.Models;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using ZstdSharp;

namespace Entrevista.Repos;

public class UsuarioRepo
{
    private readonly string _connectionString;
    public UsuarioRepo(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new ArgumentNullException(nameof(configuration), "Connection string is missing.");
    }

    public IEnumerable<Usuario> GetAll()
    {
        var usuarios = new List<Usuario>();
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("SELECT Id, Nombre, Apellido, Correo, Cedula, Contrasena, Clasificacion, Puntaje, UltimoIngreso FROM usuario", connection);
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    var usuario = new Usuario
                    (
                        reader.GetInt32("Id"),
                        reader.GetString("Nombre"),
                        reader.GetString("Apellido"),
                        reader.GetString("Correo"),
                        reader.GetInt32("Cedula"),
                        "",
                        reader["Clasificacion"] as string,
                        (reader["Puntaje"] as int?).GetValueOrDefault(),
                        reader.GetDateTime("UltimoIngreso")
                    );
                    usuario.GenerarClasificacion(); // 
                    usuario.GenerarPuntaje(); // 
                    usuarios.Add(usuario);
                }
            }
        }
        return usuarios;
    }

    public Usuario? Login(string correo, string contrasena)
    {

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("SELECT Id, Nombre, Apellido, Correo, Cedula, Contrasena, Clasificacion, Puntaje, UltimoIngreso FROM Usuario" +
                                          " WHERE Contrasena = @Contrasena AND Correo = @Correo", connection);

            command.Parameters.AddWithValue("@Contrasena", contrasena);
            command.Parameters.AddWithValue("@Correo", correo);

            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new Usuario
                    (
                        reader.GetInt32("Id"),
                        reader.GetString("Nombre"),
                        reader.GetString("Apellido"),
                        reader.GetString("Correo"),
                        reader.GetInt32("Cedula"),
                        reader.GetString("Contrasena"),
                        reader["Clasificacion"] as string,
                        (reader["Puntaje"] as int?).GetValueOrDefault(),
                        reader.GetDateTime("UltimoIngreso")
                    );
                }
                return null;
            }
        }
    }

    public Usuario? GetById(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("SELECT Id, Nombre, Apellido, Correo, Cedula, Contrasena, Clasificacion, Puntaje, UltimoIngreso FROM Usuario WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new Usuario
                    (
                        reader.GetInt32("Id"),
                        reader.GetString("Nombre"),
                        reader.GetString("Apellido"),
                        reader.GetString("Correo"),
                        reader.GetInt32("Cedula"),
                        reader.GetString("Contrasena"),
                        reader["Clasificacion"] as string,
                        (reader["Puntaje"] as int?).GetValueOrDefault(),
                        reader.GetDateTime("UltimoIngreso")
                    );
                }
                return null;
            }
        }
    }

    public Usuario Add(Usuario usuario)
    {
        AsegurarUsuarioInexistente(usuario.Correo);

        using (var connection = new SqlConnection(_connectionString))
        {

            connection.Open();
            var command = new SqlCommand(
                "INSERT INTO Usuario (Nombre, Apellido, Correo, Cedula, Contrasena, Clasificacion, Puntaje, UltimoIngreso)" +
                "VALUES (@Nombre, @Apellido, @Correo, @Cedula, @Contrasena, @Clasificacion, @Puntaje, @UltimoIngreso); " +
                "SELECT SCOPE_IDENTITY();",
                connection);

            command.Parameters.AddWithValue("@Nombre", usuario.Nombre);
            command.Parameters.AddWithValue("@Apellido", usuario.Apellido);
            command.Parameters.AddWithValue("@Correo", usuario.Correo);
            command.Parameters.AddWithValue("@Cedula", usuario.Cedula);
            command.Parameters.AddWithValue("@Contrasena", usuario.Contrasena);
            command.Parameters.AddWithValue("@Clasificacion", usuario.Clasificacion);
            command.Parameters.AddWithValue("@Puntaje", usuario.Puntaje);
            command.Parameters.AddWithValue("@UltimoIngreso", usuario.UltimoIngreso);

            usuario.Id = Convert.ToInt32(command.ExecuteScalar());
            return usuario;
        }
    }

    public bool Update(int id, Usuario usuarioActualizado)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand(
                "UPDATE Usuario SET" +
                " Nombre = @Nombre" +
                " ,Apellido = @Apellido" +
                " ,Correo = @Correo" +
                " ,Cedula = @Cedula" +
                " ,Contrasena = @Contrasena" +
                " ,Clasificacion = @Clasificacion" +
                " ,Puntaje = @Puntaje" +
                " ,UltimoIngreso = @UltimoIngreso" +
                " WHERE Id = @Id",
                connection);

            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@Nombre", usuarioActualizado.Nombre);
            command.Parameters.AddWithValue("@Apellido", usuarioActualizado.Apellido);
            command.Parameters.AddWithValue("@Correo", usuarioActualizado.Correo);
            command.Parameters.AddWithValue("@Cedula", usuarioActualizado.Cedula);
            command.Parameters.AddWithValue("@Contrasena", usuarioActualizado.Contrasena);
            command.Parameters.AddWithValue("@Clasificacion", usuarioActualizado.Clasificacion);
            command.Parameters.AddWithValue("@Puntaje", usuarioActualizado.Puntaje);
            command.Parameters.AddWithValue("@UltimoIngreso", usuarioActualizado.UltimoIngreso);

            int rowsAffected = command.ExecuteNonQuery();
            return rowsAffected > 0;
        }
    }

    public bool Delete(int id)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("DELETE FROM Usuario WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);

            int rowsAffected = command.ExecuteNonQuery();
            return rowsAffected > 0;
        }
    }

    public void AsegurarUsuarioInexistente(string correo)
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();
            var command = new SqlCommand("SELECT correo FROM Usuario WHERE Correo = @Correo", connection);
            command.Parameters.AddWithValue("@Correo", correo);

            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    throw new HttpRequestException("Un usuario con este correo ya existe.");
                }
            }
        }
    }
}