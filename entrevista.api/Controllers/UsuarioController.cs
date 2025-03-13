using Microsoft.AspNetCore.Mvc;
using Entrevista.Models;
using Entrevista.Controllers;
using System.Collections.Generic;
using System.Linq;
using Entrevista.Repos;

namespace Entrevista.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly UsuarioRepo _repo;
    public UsuariosController(UsuarioRepo repo)
    {
        _repo = repo;
    }

    // GET: api/usuarios
    [HttpGet]
    public ActionResult<IEnumerable<Usuario>> GetAll()
    {
        return Ok(_repo.GetAll());
    }

    // GET: api/usuario/1
    [HttpGet("{id}")]
    public ActionResult<Usuario> GetById(int id)
    {
        var usuario = _repo.GetById(id);
        if (usuario is null) return NotFound();
        return Ok(usuario);
    }

    // GET: api/usuario/login
    [HttpPost("login")]
    public ActionResult<Usuario> Login(LoginUsuarioRequest request)
    {

        var usuario = _repo.Login(request.Correo, request.Contrasena);
        if (usuario is null) throw new HttpRequestException("El usuario no existe, correo o contraseña incorrectos.");

        usuario.Login();
        _repo.Update(usuario.Id, usuario);

        return Ok(usuario);
    }

    // POST: api/usuarios
    [HttpPost]
    public ActionResult<Usuario> Create([FromBody] Usuario nuevoUsuario)
    {
        nuevoUsuario = new Usuario(0, nuevoUsuario.Nombre, nuevoUsuario.Apellido, nuevoUsuario.Correo, nuevoUsuario.Cedula, nuevoUsuario.Contrasena);
        nuevoUsuario = _repo.Add(nuevoUsuario);
        return CreatedAtAction(nameof(GetById), new { id = nuevoUsuario.Id }, nuevoUsuario);
    }

    // PUT: api/usuario/1
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Usuario usuarioActualizado)
    {
        var usuario = _repo.GetById(id);
        if (usuario is null) return NotFound();

        if (usuarioActualizado.Correo != usuario.Correo)
            _repo.AsegurarUsuarioInexistente(usuarioActualizado.Correo);
        usuario.Update(usuarioActualizado);

        if (!_repo.Update(id, usuario))
            return NotFound();

        return Ok(usuario);
    }

    // DELETE: api/usuarios/1
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (!_repo.Delete(id)) return NotFound();
        return NoContent();
    }
}

