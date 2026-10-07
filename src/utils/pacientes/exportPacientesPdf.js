import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportarParaPdf = (listaCompleta) => {
    // Tratamento defensivo: garante que tenhamos um Array puro
    const lista = Array.isArray(listaCompleta)
        ? listaCompleta
        : listaCompleta?.pacientes || listaCompleta?.data || [];

    const doc = new jsPDF();

    // Cabeçalho do Documento
    doc.setFontSize(16);
    doc.text('Pacientes cadastrados', 14, 15);
    doc.setFontSize(10);
    doc.text('Lista completa de pacientes no sistema', 14, 22);

    // Mapeia garantindo os fallbacks de campos
    const linhas = lista.map((p) => {
        const nomePaciente = p.nome || 'Não informado';
        const cpf = p.cpf || 'Não informado';
        const nascimento = p.data_nascimento || p.dataNascimento
            ? new Date(p.data_nascimento || p.dataNascimento).toLocaleDateString('pt-BR')
            : 'Não informado';
        const telefone = p.telefone || p.celular || 'Não informado';

        return [nomePaciente, cpf, nascimento, telefone];
    });

    // Desenha a tabela no PDF
    autoTable(doc, {
        startY: 28,
        head: [['PACIENTE', 'CPF', 'DATA DE NASCIMENTO', 'TELEFONE']],
        body: linhas,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 9 },
        columnStyles: {
            2: { halign: 'center' }, // Centraliza a Data de Nascimento
            3: { halign: 'center' }  // Centraliza o Telefone
        }
    });

    doc.save(`Pacientes_Cadastrados_${new Date().toISOString().slice(0, 10)}.pdf`);
};