import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const Login = () => {
  const [inputs, setInputs] = useState({ correo: "", contraseña: "" });
  const [mensaje, setMensaje] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { correo, contraseña } = inputs;

  const HandleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (correo !== "" && contraseña !== "") {
      const Usuario = {
        correo,
        contraseña,
      };
      setLoading(true);
      try {
        const { data } = await axios.post("http://localhost:4000/login", Usuario);
        localStorage.setItem("token", data?.usuario.token);
        localStorage.setItem("userId", data?.usuario.id);
        setMensaje(data.mensaje);
        setTimeout(() => {
          setMensaje("");
          navigate("/welcome");
        }, 1500);
      } catch (error) {
        console.error(error);
        setMensaje("Correo o contraseña incorrecta");
        setTimeout(() => {
          setMensaje("");
        }, 1500);
      }
      setInputs({ correo: "", contraseña: "" });
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={onSubmit}>
        <h2 className={styles.authTitle}>Inicio de Sesión</h2>
        {mensaje && <p>{mensaje}</p>}
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
            placeholder="Tu contraseña"
            autoComplete="off"
            required
          />
        </div>
        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
        <p className={styles.switchAuth}>
          ¿No tienes una cuenta? <a href="/">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
