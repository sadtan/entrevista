import "./UsuariosPage.css";

import { Pen16Regular, Delete16Regular } from "@fluentui/react-icons";

import * as React from "react";
import { useState, useEffect } from "react";

async function cargarUsuarios() {
  return new Promise(async (resolve, reject) => {
    var response = await fetch("http://localhost:5048/api/usuarios");
    response = await response.json();
    console.log(response);
    resolve(response);
  }); 
}

async function actualizarUsuario(id, usuario) {
  return new Promise(async (resolve, reject) => {
    const registerResponse = fetch(`http://localhost:5048/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...usuario,
      }),
    }).then(async (res) => {
      if (res.ok) {
        resolve(await res.json());
      } else
        res.text().then((text) => {
          reject(text.substring(text.indexOf(":") + 2, text.indexOf("\n")));
        });
    });
  });
}

async function eliminarUsuario(id) {
  return new Promise(async (resolve, reject) => {
    const deleteResponse = fetch(`http://localhost:5048/api/usuarios/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then(async (res) => {
      if (res.ok) {
        alert("Usuario eliminado.");
        resolve("ok");
      } else
        res.text().then((text) => {
          reject(text.substring(text.indexOf(":") + 2, text.indexOf("\n")));
        });
    });
  });
}

export default function UsuariosPage() {
  const [mostrarFormmulario, setMostrarFormulario] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAActualizadId, setUsuarioAActualizadId] = useState(0);

  const [usuario, setUsuario] = useState({
    id: 0,
    nombre: "",
    apellido: "",
    correo: "",
    cedula: 0,
    contrasena: ".",
  });

  const asegurarSesion = () => {
    const sessionUsuario = sessionStorage.getItem("usuario");
    console.log(typeof sessionUsuario);
    if (!sessionUsuario) {
      console.log("Usuario no existe");
      window.location.href = "/";
    }
  };

  const handleUsuarioChange = (e) => {
    var { name, value, type, checked } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAbrirFormulario = (usuarioId) => {
    var usr = usuarios.find((u) => u.id == usuarioId);
    if (!usr) return;
    window.scrollTo(0, 0);
    setMostrarFormulario(true);
    setUsuarioAActualizadId(usr["id"]);
    setUsuario({
      id: usr["id"],
      nombre: usr["nombre"],
      apellido: usr["apellido"],
      correo: usr["correo"],
      cedula: usr["cedula"],
      contrasena: ".",
    });
  };

  const handleEliminarUsuario = async(id) => {
      await eliminarUsuario(id);
      await actualizarUsuarios();
  }

  const actualizarUsuarios = async () => {
    const response = await cargarUsuarios();
    setUsuarios(response);
  };

  useEffect(() => {
    asegurarSesion();
    actualizarUsuarios();
  }, []);

  const onSubmitActualizar = async (e) => {
    e.preventDefault();
    console.log("::actualizando usuario");
    try {
      const usr = await actualizarUsuario(usuarioAActualizadId, usuario);
      console.log(usr);
      setUsuario(usr);
      await actualizarUsuarios();
      setMostrarFormulario(false);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div id="content-container">
      <form
        onSubmit={onSubmitActualizar}
        style={{
          margin: "42px 0",
          borderBottom: "1px solid black",
          borderTop: "1px solid black",

          padding: "42px 0",
          display: mostrarFormmulario ? "block" : "none",
        }}
      >
        <span style={{ fontWeight: "bold", marginBottom: "6px" }}>
          Actualizad usuario: {usuarioAActualizadId}
        </span>
        <div className="calc-inputs">
          <div className="calc-input">
            <label htmlFor="ammount-input">Nombre</label>
            <div className="styled-input">
              <input
                required={true}
                name="nombre"
                id="usuario-registro-input"
                type="text"
                value={usuario["nombre"]}
                onChange={handleUsuarioChange}
              ></input>
            </div>
          </div>

          <div className="calc-input">
            <label htmlFor="ammount-input">Apellido</label>
            <div className="styled-input">
              <input
                required={true}
                name="apellido"
                id="apellido-registro-input"
                type="text"
                value={usuario["apellido"]}
                onChange={handleUsuarioChange}
              ></input>
            </div>
          </div>

          <div className="calc-input">
            <label htmlFor="ammount-input">Correo</label>
            <div className="styled-input">
              <input
                required={true}
                name="correo"
                id="correo-registro-input"
                type="email"
                value={usuario["correo"]}
                onChange={handleUsuarioChange}
              ></input>
            </div>
          </div>

          <div className="calc-input">
            <label htmlFor="ammount-input">Cedula</label>
            <div className="styled-input">
              <span className="input-symbol">C.C</span>
              <input
                required={true}
                name="cedula"
                id="cedula-registro-input"
                type="number"
                value={usuario["cedula"]}
                onChange={handleUsuarioChange}
              ></input>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "6px",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <div className="calc-input" style={{ width: "120px" }}>
              <button className="btn-signup">Actualizar</button>
            </div>
          </div>
        </div>
      </form>

      <div className="calc-table">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Cedula</th>
              <th>Puntaje</th>
              <th>Clasificación</th>
              <th>Ingresó</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={"usuario" + usuario["id"]}>
                <td>
                  <span className="usuario-acciones">
                    <button
                      onClick={() => handleAbrirFormulario(usuario["id"])}
                      style={{ paddingTop: "4px" }}
                    >
                      <Pen16Regular />
                    </button>
                    <button onClick={() => handleEliminarUsuario(usuario["id"])}
                    style={{ paddingTop: "4px" }}>
                      <Delete16Regular />
                    </button>
                  </span>
                </td>
                <td>{usuario["id"]}</td>
                <td>{usuario["nombre"]}</td>
                <td>{usuario["apellido"]}</td>
                <td>{usuario["correo"]}</td>
                <td>{usuario["cedula"]}</td>
                <td>{usuario["puntaje"]}</td>
                <td>{usuario["clasificacion"]}</td>
                <td>{usuario["ultimoIngreso"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
