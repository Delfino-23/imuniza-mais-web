import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cadastro({ onLogin }) {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === 'admin@imunizamais.com' && senha === 'TrocarSenha123') {
            setMensagem('Login realizado com sucesso!');
            onLogin();
            navigate('/dashboard');
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
                        <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700">
                            Nome Completo:
                        </label>
                        <input
                            type="text"
                            id="NomeCompleto"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            value={nomeCompleto}
                            onChange={(e) => setNomeCompleto(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                            CPF:
                        </label>
                        <input
                            type="text"
                            id="cpf"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                            Senha (Mínimo 8 Caracteres):
                        </label>
                        <input
                            type="password"
                            id="senha"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                            Confirmar Senha:
                        </label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-center gap-4 text-sm text-black">
                        Já tem acesso?
                        <Link to="/login" className="text-sm text-blue-500 hover:text-blue-600">
                            Entrar
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 py-2 rounded-md transition text-white hover:from-teal-600 hover:to-cyan-600"
                    >
                        Criar Acesso
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