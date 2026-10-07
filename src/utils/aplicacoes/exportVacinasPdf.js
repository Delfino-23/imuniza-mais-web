import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportarParaPdf = (listaCompleta, vacinas = []) => {
    const doc = new jsPDF();

    // Cabeçalho do Documento
    doc.setFontSize(16);
    doc.text('Histórico de Aplicações', 14, 15);
    doc.setFontSize(10);
    doc.text('Todas as vacinações registradas no sistema', 14, 22);

    // Mapeia garantindo todos os fallbacks do componente React
    const linhas = listaCompleta.map((a) => {
        // 1. Paciente
        const nomePaciente = a.Paciente?.nome || a.paciente_nome || a.paciente || 'Não informado';

        // 2. Vacina (com busca na lista de vacinas caso só tenha vacina_id)
        const vacinaRelacionada = Array.isArray(vacinas)
            ? vacinas.find((v) => v.id === (a.vacina_id || a.Vacina?.id))
            : null;
        const nomeVacina = a.Vacina?.nome || a.vacina_nome || a.vacina || vacinaRelacionada?.nome || 'Não informada';

        // 3. Lote
        const loteVacina =
            a.lote ||
            a.Vacina?.lote ||
            a.Vacina?.numero_lote ||
            a.vacina_lote ||
            vacinaRelacionada?.lote ||
            vacinaRelacionada?.numero_lote ||
            '-';

        // 4. Dose, Profissional e Data
        const dose = a.dose || '-';
        const profissional = a.profissional_responsavel || a.profissional || '-';
        const rawData = a.data_aplicacao || a.data;
        const dataFormatada = rawData ? new Date(rawData).toLocaleDateString('pt-BR') : '-';

        return [nomePaciente, nomeVacina, loteVacina, dose, profissional, dataFormatada];
    });

    // Desenha a tabela no PDF
    autoTable(doc, {
        startY: 28,
        head: [['PACIENTE', 'VACINA', 'LOTE', 'DOSE', 'PROFISSIONAL', 'DATA']],
        body: linhas,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 9 },
        columnStyles: {
            3: { halign: 'center' }, // Centraliza a Dose
            5: { halign: 'right' }   // Alinha a Data à direita
        }
    });

    doc.save(`Historico_Aplicacoes_${new Date().toISOString().slice(0, 10)}.pdf`);
};