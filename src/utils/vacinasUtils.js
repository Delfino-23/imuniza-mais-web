export function getStatus(vacina) {
    const hoje = new Date();
    const validade = new Date(vacina.validade);
    const diasParaVencer = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

    // Mapeia tanto quantidade_estoque (API) quanto doses (Mocks/Fallback)
    const qtdDoses = Number(vacina.quantidade_estoque ?? vacina.doses ?? 0);
    const estoqueMinimo = Number(vacina.estoque_minimo ?? vacina.minDoses ?? 20);

    if (diasParaVencer < 0) {
        return { label: "Crítico", cor: "red", motivo: "Vacina vencida" };
    }
    if (qtdDoses === 0) {
        return { label: "Crítico", cor: "red", motivo: "Estoque zerado" };
    }
    if (diasParaVencer <= 30) {
        return { label: "Crítico", cor: "red", motivo: `Vence em ${diasParaVencer} dias` };
    }
    if (qtdDoses <= estoqueMinimo) {
        return { label: "Atenção", cor: "amber", motivo: "Abaixo do estoque mínimo" };
    }

    return { label: "Regular", cor: "green", motivo: "Lote em dia" };
}

export function vacinasDisponiveis(vacinas) {
    const vacinasDisponiveis = Array.isArray(vacinas)
        ? vacinas
        : (vacinas && Array.isArray(vacinas.vacinas) ? vacinas.vacinas : []);

    return vacinasDisponiveis.filter(vacina => {
        const status = getStatus(vacina);
        return status.label !== "Crítico"; // Retorna apenas vacinas que não estão em estado crítico
    });
}