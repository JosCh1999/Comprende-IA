import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const Register = () => {
  const [inputs, setInputs] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });
  const [mensaje, setMensaje] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { nombre, correo, contraseña } = inputs;

  const HandleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (nombre !== "" && correo !== "" && contraseña !== "") {
      const Usuario = {
        nombre,
        correo,
        contraseña,
      };
      setLoading(true);
      try {
        const { data } = await axios.post("http://localhost:4000/register", Usuario);
        setMensaje(data.mensaje);
        setTimeout(() => {
          setMensaje("");
          navigate("/login");
        }, 1500);
      } catch (error) {
        console.error(error);
        setMensaje("Hubo un error en el registro.");
        setTimeout(() => {
          setMensaje("");
        }, 1500);
      }
      setInputs({ nombre: "", correo: "", contraseña: "" });
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={onSubmit}>
        <h2 className={styles.authTitle}>Crear una Cuenta</h2>
        {mensaje && <p>{mensaje}</p>}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="nombre">Nombre Completo</label>
          <input
            className={styles.inputField}
            onChange={HandleChange}
            value={nombre}
            name="nombre"
            id="nombre"
            type="text"
            placeholder="Tu nombre completo"
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="correo">Correo Electrónico</label>
          <input
            className={styles.inputField}
            onChange={HandleChange}
            value={correo}
            name="correo"
            id="correo"
            type="email"
            placeholder="ejemplo@correo.com"
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="contraseña">Contraseña</label>
          <input
            className={styles.inputField}
            onChange={HandleChange}
            value={contraseña}
            name="contraseña"
            id="contraseña"
            type="password"
            placeholder="Crea una contraseña segura"
            autoComplete="off"
            required
          />
        </div>
        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>
        <p className={styles.switchAuth}>
          ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
