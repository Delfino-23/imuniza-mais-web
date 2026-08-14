import { useState } from 'react';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === 'admin@imunizamais.com' && senha === 'TrocarSenha123') {
            setMensagem('Login realizado com sucesso!');
            onLogin();
        } else {
            setMensagem('E-mail ou senha incorretos.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-md">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="m18 2 4 4" />
                            <path d="m17 7 3-3" />
                            <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
                            <path d="m9 11 4 4" />
                        </svg>
                    </div>

                    <h2 className="text-center text-2xl font-bold text-black">
                        Imuniza+
                    </h2>

                </div>
                <p className="text-center text-gray-500 mb-6">
                    Faça login para continuar
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="loginEmail"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="loginSenha" className="block text-sm font-medium text-gray-700">
                            Senha:
                        </label>
                        <input
                            type="password"
                            id="loginSenha"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div class="flex justify-between gap-4 text-sm text-blue-500">
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                            Esqueceu a senha?
                        </a>

                        <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                            Cadastre-se
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 py-2 rounded-md transition text-white hover:from-teal-600 hover:to-cyan-600"
                    >
                        Entrar
                    </button>
                </form>

                {mensagem && (
                    <div className="mt-4 text-center text-sm text-red-600">
                        {mensagem}
                    </div>
                )}
            </div>
        </div>
    );
}