import React, { useState } from 'react';

function RepairsPage() {
    const [tipoServico, setTipoServico] = useState<'Conserto' | 'Ajuste'>('Conserto');
    const [descricao, setDescricao] = useState('');

    const handleSendToWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        const phoneNumber = "5542984230849"; 

        const message = `✨ *Solicitação de ${tipoServico} / Ajuste* ✨%0A%0A` +
            `- *Tipo:* ${tipoServico}%0A` +
            `- *Detalhes:* ${descricao || 'Nenhuma observação informada'}`;

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <section style={{ padding: '3rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', color: '#5e4e4e', fontWeight: 400, marginBottom: '0.4rem' }}>
                    Consertos e Ajustes
                </h2>
                <p style={{ color: '#8c7373', fontSize: '0.95rem', maxWidth: '550px', margin: '0 auto', lineHeight: '1.5' }}>
                    Precisa reformar uma peça, ajustar o tamanho ou fazer um reparo? Conte pra gente o que precisa e continuaremos o atendimento pelo WhatsApp!
                </p>
            </div>

            <div style={{ 
                background: '#ffffff', 
                padding: '2.5rem', 
                borderRadius: '20px', 
                border: '1px solid #f2e6e6',
                boxShadow: '0 4px 20px rgba(230, 200, 200, 0.12)' 
            }}>
                <form onSubmit={handleSendToWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Escolha entre Conserto ou Ajuste */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: '#5e4e4e', marginBottom: '0.5rem', fontWeight: 500 }}>
                            O que você precisa? *
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setTipoServico('Conserto')}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e8dada',
                                    background: tipoServico === 'Conserto' ? '#b58b8b' : '#faf6f6',
                                    color: tipoServico === 'Conserto' ? '#fff' : '#7a6666',
                                    fontWeight: tipoServico === 'Conserto' ? 600 : 400,
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                🪡 Conserto (Reparos gerais)
                            </button>
                            <button
                                type="button"
                                onClick={() => setTipoServico('Ajuste')}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e8dada',
                                    background: tipoServico === 'Ajuste' ? '#b58b8b' : '#faf6f6',
                                    color: tipoServico === 'Ajuste' ? '#fff' : '#7a6666',
                                    fontWeight: tipoServico === 'Ajuste' ? 600 : 400,
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ✂️ Ajuste (Modificações)
                            </button>
                        </div>
                    </div>

                    {/* Descrição livre */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: '#5e4e4e', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Descreva brevemente o que precisa *
                        </label>
                        <textarea 
                            rows={4}
                            required
                            placeholder="Conte um pouco sobre o que precisa ser feito..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '0.8rem', 
                                borderRadius: '12px', 
                                border: '1px solid #e8dada', 
                                outline: 'none', 
                                fontSize: '0.9rem', 
                                color: '#7a6666',
                                background: '#faf6f6',
                                resize: 'vertical' 
                            }}
                        />
                    </div>

                    {/* Botão de Envio com o tom do Ateliê */}
                    <button 
                        type="submit"
                        style={{
                            background: '#b58b8b',
                            color: '#fff',
                            border: 'none',
                            padding: '0.9rem',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(181, 139, 139, 0.25)',
                            transition: 'background 0.2s'
                        }}
                    >
                        💬 Continuar Atendimento no WhatsApp
                    </button>
                </form>
            </div>
        </section>
    );
}

export default RepairsPage;