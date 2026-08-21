import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function MeusAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        async function carregarAgendamentos() {
            try {
                const token = localStorage.getItem('@imuniza:token');

                // Envia o token de autenticação no header Bearer
                const response = await api.get('/agendamentos/meus-agendamentos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setAgendamentos(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        }

        carregarAgendamentos();
    }, []);

    return (
        <div>
            <h2>Meus Agendamentos</h2>
            <ul>
                {agendamentos.map((item) => (
                    <li key={item.id}>
                        {item.vacina} - {item.posto} ({new Date(item.data_agendamento).toLocaleDateString('pt-BR')})
                    </li>
                ))}
            </ul>
        </div>
    );
}