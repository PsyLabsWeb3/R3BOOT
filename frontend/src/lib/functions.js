import Cookies from "js-cookie";

/**
 * Envía el token al backend usando Sanctum y retorna la información del usuario autenticado.
 * @param {string} token - El token JWT recibido tras el registro/login.
 * @returns {Promise<Object>} - Información del usuario autenticado.
 */
export async function getSanctumUser() {
  const token = Cookies.get("token");
  const response = await fetch(
    "http://159.223.111.198:8000/api/get-auth-user",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "No se pudo autenticar con Sanctum.");
  }
  const userData = await response.json();
  return userData;
}

export async function getBalance() {
  const token = Cookies.get("token");
  const response = await fetch("http://159.223.111.198:8000/api/get-balance", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "No se pudo autenticar con Sanctum.");
  }
  const userData = await response.json();
  return userData;
}

export async function getMovements() {
  const token = Cookies.get("token");
  const response = await fetch(
    "http://159.223.111.198:8000/api/get-movements",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "No se pudo autenticar con Sanctum.");
  }
  const userData = await response.json();
  return userData;
}
