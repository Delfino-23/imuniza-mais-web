// ============================================================
// mockData.js — Dados estáticos para prototipagem do Imuniza+
// Substitua estas estruturas por chamadas à API REST futuramente
// ============================================================

export const pacientes = [
  { id: 1, nome: "Maria Silva Santos", cpf: "123.456.789-00", nascimento: "1985-03-12", sexo: "F", telefone: "(11) 98765-4321", endereco: "Rua das Flores, 123 - São Paulo, SP" },
  { id: 2, nome: "João Carlos Oliveira", cpf: "987.654.321-00", nascimento: "1990-07-25", sexo: "M", telefone: "(11) 91234-5678", endereco: "Av. Paulista, 456 - São Paulo, SP" },
  { id: 3, nome: "Ana Paula Ferreira", cpf: "456.789.123-00", nascimento: "1978-11-08", sexo: "F", telefone: "(11) 99876-5432", endereco: "Rua Augusta, 789 - São Paulo, SP" },
  { id: 4, nome: "Carlos Eduardo Lima", cpf: "321.654.987-00", nascimento: "2000-02-14", sexo: "M", telefone: "(11) 97654-3210", endereco: "Rua Consolação, 321 - São Paulo, SP" },
  { id: 5, nome: "Fernanda Costa Souza", cpf: "654.321.098-00", nascimento: "1995-09-30", sexo: "F", telefone: "(11) 96543-2109", endereco: "Rua da Liberdade, 654 - São Paulo, SP" },
  { id: 6, nome: "Roberto Alves Pereira", cpf: "789.012.345-00", nascimento: "1965-05-17", sexo: "M", telefone: "(11) 95432-1098", endereco: "Av. Brasil, 987 - São Paulo, SP" },
  { id: 7, nome: "Luciana Mendes Rocha", cpf: "012.345.678-00", nascimento: "1988-12-03", sexo: "F", telefone: "(11) 94321-0987", endereco: "Rua XV de Novembro, 12 - São Paulo, SP" },
];

export const vacinas = [
  { id: 1, nome: "COVID-19 (Pfizer)", fabricante: "Pfizer-BioNTech", lote: "PFZ-2024-001", validade: "2025-08-15", doses: 150, dosesMin: 50 },
  { id: 2, nome: "Influenza Quadrivalente", fabricante: "Sanofi Pasteur", lote: "SAN-2024-045", validade: "2025-04-30", doses: 12, dosesMin: 30 },
  { id: 3, nome: "Hepatite B", fabricante: "Butantan", lote: "BUT-2024-112", validade: "2025-12-01", doses: 300, dosesMin: 50 },
  { id: 4, nome: "Febre Amarela", fabricante: "Bio-Manguinhos/Fiocruz", lote: "FIO-2024-067", validade: "2025-06-20", doses: 25, dosesMin: 30 },
  { id: 5, nome: "Tétano e Difteria (dT)", fabricante: "Butantan", lote: "BUT-2024-089", validade: "2026-03-10", doses: 200, dosesMin: 50 },
  { id: 6, nome: "Varicela (Catapora)", fabricante: "GlaxoSmithKline", lote: "GSK-2024-033", validade: "2025-09-25", doses: 8, dosesMin: 20 },
];

export const aplicacoes = [
  { id: 1, pacienteId: 1, pacienteNome: "Maria Silva Santos", vacinaId: 1, vacinaNome: "COVID-19 (Pfizer)", lote: "PFZ-2024-001", data: "2025-01-15", dose: "2ª Dose", profissional: "Enf. Ana Costa" },
  { id: 2, pacienteId: 2, pacienteNome: "João Carlos Oliveira", vacinaId: 2, vacinaNome: "Influenza Quadrivalente", lote: "SAN-2024-045", data: "2025-01-15", dose: "Dose Única", profissional: "Enf. Pedro Souza" },
  { id: 3, pacienteId: 3, pacienteNome: "Ana Paula Ferreira", vacinaId: 3, vacinaNome: "Hepatite B", lote: "BUT-2024-112", data: "2025-01-14", dose: "1ª Dose", profissional: "Enf. Ana Costa" },
  { id: 4, pacienteId: 4, pacienteNome: "Carlos Eduardo Lima", vacinaId: 5, vacinaNome: "Tétano e Difteria (dT)", lote: "BUT-2024-089", data: "2025-01-14", dose: "Reforço", profissional: "Enf. Maria Lima" },
  { id: 5, pacienteId: 5, pacienteNome: "Fernanda Costa Souza", vacinaId: 4, vacinaNome: "Febre Amarela", lote: "FIO-2024-067", data: "2025-01-13", dose: "Dose Única", profissional: "Enf. Pedro Souza" },
  { id: 6, pacienteId: 6, pacienteNome: "Roberto Alves Pereira", vacinaId: 1, vacinaNome: "COVID-19 (Pfizer)", lote: "PFZ-2024-001", data: "2025-01-13", dose: "Dose de Reforço", profissional: "Enf. Maria Lima" },
  { id: 7, pacienteId: 7, pacienteNome: "Luciana Mendes Rocha", vacinaId: 6, vacinaNome: "Varicela (Catapora)", lote: "GSK-2024-033", data: "2025-01-12", dose: "1ª Dose", profissional: "Enf. Ana Costa" },
];

// Helpers de status de vacinas
export const getVacinaStatus = (vacina) => {
  const hoje = new Date();
  const validade = new Date(vacina.validade);
  const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
  const estoqueнизкий = vacina.doses < vacina.dosesMin;
  const vencendoBreve = diffDias <= 60 && diffDias > 0;
  const vencida = diffDias <= 0;

  if (vencida) return { label: "Vencida", cor: "red" };
  if (estoqueниский || vencendoBreve) return { label: estoqueниский ? "Estoque Baixo" : "Vence em Breve", cor: "amber" };
  return { label: "Regular", cor: "green" };
};

// Compatível com nome correto (sem erro de digitação acima)
export const getStatus = (vacina) => {
  const hoje = new Date();
  const validade = new Date(vacina.validade);
  const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
  const estoqueBaixo = vacina.doses < vacina.dosesMin;
  const vencendoBreve = diffDias <= 60 && diffDias > 0;
  const vencida = diffDias <= 0;

  if (vencida) return { label: "Vencida", cor: "red" };
  if (estoqueBaixo && vencendoBreve) return { label: "Crítico", cor: "red" };
  if (estoqueBaixo) return { label: "Estoque Baixo", cor: "amber" };
  if (vencendoBreve) return { label: "Vence em Breve", cor: "amber" };
  return { label: "Regular", cor: "green" };
};

export const DOSES_OPCOES = ["1ª Dose", "2ª Dose", "3ª Dose", "Dose Única", "Dose de Reforço"];
