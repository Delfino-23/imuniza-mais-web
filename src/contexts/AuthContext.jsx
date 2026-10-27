import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "@imuniza:token";
const USER_KEY = "@imuniza:user";

function readSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const serializedUser = localStorage.getItem(USER_KEY);

  if (!token || !serializedUser) {
    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(serializedUser);
    if (!user || typeof user !== "object") {
      throw new Error("Os dados salvos do usuário são inválidos.");
    }

    return { token, user };
  } catch (error) {
    console.error("Não foi possível restaurar a sessão salva:", error);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setSession({ token, user });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setSession({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        isAuthenticated: Boolean(session.token && session.user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return context;
}
