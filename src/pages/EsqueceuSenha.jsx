import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setMensagem("");

    try {
      await api.post("/auth/esqueci-senha", { email });
      setEnviado(true);
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      setMensagem("Não foi possível concluir a solicitação. Tente novamente.");
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
              <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
              <path d="m9 11 4 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black">Imuniza+</h1>
        </div>

        {enviado ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Verifique seu e-mail</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Se houver uma conta associada a este e-mail, enviaremos um link para criar uma nova senha.
            </p>
            <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-center text-xl font-bold text-slate-800">Recuperar senha</h2>
            <p className="mb-6 mt-2 text-center text-sm leading-6 text-gray-500">
              Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="recuperacaoEmail" className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  id="recuperacaoEmail"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-md bg-gradient-to-r from-teal-500 to-cyan-500 py-2 text-white transition hover:from-teal-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? "Enviando..." : "Enviar instruções"}
              </button>
            </form>

            {mensagem && <p className="mt-4 text-center text-sm text-red-600">{mensagem}</p>}
            <Link to="/login" className="mt-6 block text-center text-sm text-blue-500 hover:text-blue-600">
              Voltar para o login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
