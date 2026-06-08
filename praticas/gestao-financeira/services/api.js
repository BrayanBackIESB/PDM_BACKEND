// services/api.js

/**
 * URL base da API.
 *
 * - No emulador Android, "localhost" do app aponta para o próprio emulador,
 *   por isso usamos 10.0.2.2 (IP especial que o Android mapeia para o
 *   localhost da máquina hospedeira).
 * - Em device físico, troque para o IP da sua máquina na rede local
 *   (ex.: http://192.168.0.10:3000) — descubra com `ipconfig` no Windows.
 * - Para iOS Simulator, "http://localhost:3000" funciona normalmente.
 *
 * Você pode sobrescrever via variável de ambiente do Expo (EXPO_PUBLIC_API_URL).
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000";

// Token JWT atual em memória. É definido pelo AuthContext após o login e
// reaproveitado em todas as requisições autenticadas.
let authToken = null;

/**
 * Define (ou limpa) o token JWT usado nas requisições autenticadas.
 * @param {string|null} token
 */
export function setAuthToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      message = data.error ?? JSON.stringify(data);
    } catch {
      try {
        message = (await response.text()) || message;
      } catch {
        // mantém a mensagem padrão
      }
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

/**
 * Monta a query string ?month=&year= a partir de um filtro opcional.
 * @param {{ month?: number|null, year?: number|null }} [filter]
 */
function buildTransactionQuery(filter) {
  if (!filter) return "";
  const parts = [];
  if (filter.month) parts.push(`month=${encodeURIComponent(filter.month)}`);
  if (filter.year) parts.push(`year=${encodeURIComponent(filter.year)}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

export const api = {
  // --- Autenticação ---
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me"),

  // --- Categorias ---
  listCategories: () => request("/categories"),
  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id, d) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  // --- Transações ---
  listTransactions: (filter) =>
    request(`/transactions${buildTransactionQuery(filter)}`),
  createTransaction: (data) =>
    request("/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id, d) =>
    request(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteTransaction: (id) =>
    request(`/transactions/${id}`, { method: "DELETE" }),
};
