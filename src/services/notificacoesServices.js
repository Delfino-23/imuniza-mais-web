import api from './api.js';

export const notificacoesServices = {
    listar: async (params = {}) => {
        const response = await api.get('/notificacoes', { params });
        return response.data;
    },

    contarNaoLidas: async () => {
        const response = await api.get('/notificacoes/nao-lidas/contagem');
        return response.data.total;
    },

    marcarComoLida: async (id) => {
        const response = await api.patch(`/notificacoes/${id}/lida`);
        return response.data;
    },

    marcarTodasComoLidas: async () => {
        const response = await api.patch('/notificacoes/ler-todas')
    }
};