import React, { useState, useRef, useEffect } from 'react';

export default function ExportDropdown({
    onExportPrincipal,
    labelPrincipal = "Exportar PDF",
    opcoes = [],
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-flex rounded-xl shadow-sm" ref={menuRef}>
            {/* Botão Ação Principal (Ex: PDF) */}
            <button
                type="button"
                onClick={onExportPrincipal}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-l-xl transition-all flex items-center gap-2"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="12" y2="18" />
                    <line x1="15" y1="15" x2="12" y2="18" />
                </svg>
                {labelPrincipal}
            </button>

            {/* Botão de Seta para Abrir as Opções Secundárias */}
            {opcoes.length > 0 && (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-2.5 rounded-r-xl border-l border-slate-700 transition-all flex items-center justify-center"
                    title="Mais formatos de exportação"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>
            )}

            {/* Menu Suspenso */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-lg z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {opcoes.map((opcao, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                opcao.onClick();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            {opcao.icon && <span>{opcao.icon}</span>}
                            {opcao.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}