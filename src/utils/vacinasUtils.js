export const getStatus = (vacina) => {
    if (!vacina) return { label: "Sem dados", cor: "slate" };

    const hoje = new Date();
    const dataValidade = new Date(vacina.validade ? vacina.validade.split('T')[0] + "T12:00:00" : "2100-01-01T12:00:00"); // Se não houver validade, assume uma data futura

    // 1. Crítico: Estoque zerado ou vacina já venceu
    if (vacina.quantidade_estoque <= 0 || dataValidade < hoje) {
        return { label: "Crítico", cor: "red" };
    }

    // 2. Atenção: Estoque igual ou abaixo do mínimo definido para alerta
    if (vacina.quantidade_estoque <= vacina.minimo_alerta) {
        return { label: "Atenção", cor: "amber" };
    }

    // 3. Regular: Tudo em ordem
    return { label: "Regular", cor: "green" };
};

export function vacinasDisponiveis(vacinas) {
    const vacinasDisponiveis = Array.isArray(vacinas)
        ? vacinas
        : (vacinas && Array.isArray(vacinas.vacinas) ? vacinas.vacinas : []);

    return vacinasDisponiveis.filter(vacina => {
        const status = getStatus(vacina);
        return status.label !== "Crítico"; // Retorna apenas vacinas que não estão em estado crítico
    });
}