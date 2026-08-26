import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem("");
    setErro("");

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      await api.post("/auth/redefinir-senha", {
        token,
        novaSenha: senha,
        confirmarSenha,
      });
      setMensagem("Senha redefinida com sucesso. Você já pode entrar.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setErro(error.response?.data?.message || "Link inválido ou expirado. Solicite uma nova recuperação.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="m18 2 4 4" /><path d="m17 7 3-3" />
              <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1.1-2.5 0-3.4L15 5" />
              <path d="m9 11 4 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black">Imuniza+</h1>
        </div>

        <h2 className="text-center text-xl font-bold text-slate-800">Criar nova senha</h2>
        <p className="mb-6 mt-2 text-center text-sm text-gray-500">Escolha uma senha segura para acessar sua conta.</p>

        {!token ? (
          <>
            <p className="text-center text-sm text-red-600">Este link de recuperação está incompleto.</p>
            <Link to="/esqueceu-senha" className="mt-6 block text-center text-sm font-semibold text-teal-600 hover:text-teal-700">
              Solicitar novo link
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">Nova senha</label>
              <input
                type="password"
                id="novaSenha"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700">Confirmar nova senha</label>
              <input
                type="password"
                id="confirmarNovaSenha"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-md bg-gradient-to-r from-teal-500 to-cyan-500 py-2 text-white transition hover:from-teal-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? "Salvando..." : "Redefinir senha"}
            </button>

            {erro && <p className="text-center text-sm text-red-600">{erro}</p>}
            {mensagem && <p className="text-center text-sm text-emerald-600">{mensagem}</p>}
          </form>
        )}

        <Link to="/login" className="mt-6 block text-center text-sm text-blue-500 hover:text-blue-600">
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
