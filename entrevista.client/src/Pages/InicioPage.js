import "./InicioPage.css";

import * as React from "react";
import { useState, useEffect } from "react";

async function iniciarUsuario(correo, contrasena) {
  return new Promise(async (resolve, reject) => {
    const loginResponse = fetch("http://localhost:5048/api/usuarios/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo,
        contrasena,
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

async function registrarUsuario(usuario) {
  console.log(
    JSON.stringify({
      usuario,
    })
  );
  return new Promise(async (resolve, reject) => {
    const loginResponse = fetch("http://localhost:5048/api/usuarios", {
      method: "post",
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

export default function InicioPage({ onActualizarUsuario }) {
  const [loanAmmount, setLoanAmmount] = useState("50");
  const [loanAmmountStr, setLoanAmmountStr] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [usuario, setUsuario] = useState(null);
  const [usuarioRegistro, setUsuarioRegistro] = useState({
    id: 0,
    nombre: "nombre 1",
    apellido: "apellido",
    correo: "a@gmail.com",
    cedula: 1234,
    contrasena: "",
  });

  const handleUsuarioRegistroChange = (e) => {
    var { name, value, type, checked } = e.target;

    setUsuarioRegistro((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoanAmmountStrChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
  };
  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
  };
  const handleContrasenaChange = (e) => {
    const value = e.target.value;
    setContrasena(value);
  };

  useEffect(() => {
    setLoanAmmountStr(formatMoney(loanAmmount));
  }, [loanAmmount]);

  const onSubmitInicio = async (e) => {
    e.preventDefault();
    console.log("::iniciando sesion");
    try {
      const usr = await iniciarUsuario(correo, contrasena);
      console.log(usr);
      sessionStorage.setItem("usuario", JSON.stringify(usr));
      setUsuario(usr);
      onActualizarUsuario();
      window.location.href = "/usuarios";
    } catch (err) {
      alert(err);
    }
  };

  const onSubmitRegistro = async (e) => {
    e.preventDefault();
    console.log("::iniciando sesion");
    try {
      const usr = await registrarUsuario(usuarioRegistro);
      console.log(usr);
      sessionStorage.setItem("usuario", JSON.stringify(usr));
      setUsuario(usr);
      onActualizarUsuario();
      window.location.href = "/usuarios";
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div id="content-container">
      <div className="calc-resume">
        <form onSubmit={onSubmitInicio}>
          <div className="calc-inputs">
            <div className="calc-input">
              <label htmlFor="ammount-input">Correo</label>
              <div className="styled-input">
                <input
                  name="ammount"
                  id="ammount-input"
                  required={true}
                  type="email"
                  value={correo}
                  onChange={handleCorreoChange}
                ></input>
              </div>
            </div>
            <div className="calc-input">
              <label htmlFor="ammount-input">Contraseña</label>
              <div className="styled-input">
                <input
                  name="ammount"
                  id="ammount-input"
                  type="password"
                  required={true}
                  value={contrasena}
                  onChange={handleContrasenaChange}
                ></input>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "6px",
                justifyContent: "space-between",
              }}
            >
              <div className="calc-input" style={{ minWidth: "48%" }}>
                <button type="submit" className="btn-login">
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </form>

        <form onSubmit={onSubmitRegistro}>
          <div className="calc-inputs">
            <div className="calc-input">
              <label htmlFor="ammount-input">Nombre</label>
              <div className="styled-input">
                <input
                  required={true}
                  name="nombre"
                  id="usuario-registro-input"
                  type="text"
                  value={usuarioRegistro["nombre"]}
                  onChange={handleUsuarioRegistroChange}
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
                  value={usuarioRegistro["apellido"]}
                  onChange={handleUsuarioRegistroChange}
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
                  value={usuarioRegistro["correo"]}
                  onChange={handleUsuarioRegistroChange}
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
                  value={usuarioRegistro["cedula"]}
                  onChange={handleUsuarioRegistroChange}
                ></input>
              </div>
            </div>

            <div className="calc-input">
              <label htmlFor="ammount-input">Contraseña</label>
              <div className="styled-input">
                <input
                  name="contrasena"
                  id="ammount-input"
                  type="password"
                  required={true}
                  value={usuarioRegistro["contrasena"]}
                  onChange={handleUsuarioRegistroChange}
                ></input>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "6px",
                justifyContent: "space-between",
              }}
            >
              <div className="calc-input" style={{ minWidth: "48%" }}>
                <button className="btn-signup">Registrarme</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}
