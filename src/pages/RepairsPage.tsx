import React, { useState } from 'react';

function RepairsPage() {
    const [tipoServico, setTipoServico] = useState<'Conserto' | 'Ajuste'>('Conserto');
    const [descricao, setDescricao] = useState('');

    const handleSendToWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        const phoneNumber = "5542984230849"; 

        const rawMessage = 
            `✨ *Solicitação de ${tipoServico} / Ajuste* ✨\n\n` +
            `- *Tipo:* ${tipoServico}\n` +
            `- *Detalhes:* ${descricao || 'Nenhuma observação informada'}`;

        const encodedMessage = encodeURIComponent(rawMessage);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <section style={{ padding: '2.5rem 1.25rem 4rem 1.25rem', maxWidth: '780px', margin: '0 auto' }}>
            {/* CSS Responsivo e Estilos da Página */}
            <style>{`
                .repairs-card {
                    background: #ffffff;
                    padding: 2.5rem 2rem;
                    border-radius: 24px;
                    border: 1px solid #F0E3E3;
                    box-shadow: 0 8px 30px rgba(163, 88, 88, 0.06);
                }

                .service-option-btn {
                    flex: 1;
                    min-width: 200px;
                    padding: 0.9rem 1rem;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .form-textarea {
                    width: 100%;
                    padding: 1rem;
                    border-radius: 14px;
                    border: 1px solid #F0E3E3;
                    outline: none;
                    font-size: 0.95rem;
                    color: #2D2323;
                    background: #FAF2F2;
                    resize: vertical;
                    box-sizing: border-box;
                    font-family: inherit;
                    transition: border-color 0.2s ease, background 0.2s ease;
                }

                .form-textarea:focus {
                    border-color: #A35858;
                    background: #FFFFFF;
                }

                .submit-btn {
                    background: #A35858;
                    color: #ffffff;
                    border: none;
                    padding: 1rem 1.5rem;
                    border-radius: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    font-size: 1rem;
                    box-shadow: 0 6px 18px rgba(163, 88, 88, 0.25);
                    transition: transform 0.2s ease, background 0.2s ease;
                    width: 100%;
                }

                .submit-btn:hover {
                    background: #8e4b4b;
                    transform: translateY(-2px);
                }

                /* Ajustes Mobile */
                @media (max-width: 768px) {
                    .repairs-card {
                        padding: 1.75rem 1.25rem;
                        border-radius: 20px;
                    }

                    .service-option-btn {
                        min-width: 100%;
                    }
                }
            `}</style>

            {/* Cabeçalho */}
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.1rem', color: '#2D2323', fontWeight: 700, marginBottom: '0.6rem' }}>
                    🪡 Consertos e Ajustes
                </h2>
                <p style={{ color: '#625353', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
                    Precisa reformar uma peça especial, ajustar o tamanho ou fazer um reparo? Conte pra gente o que precisa e continuaremos o atendimento diretamente pelo WhatsApp!
                </p>
            </div>

            {/* Card do Formulário */}
            <div className="repairs-card">
                <form onSubmit={handleSendToWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    
                    {/* Seletor Conserto / Ajuste */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', color: '#2D2323', marginBottom: '0.75rem', fontWeight: 600 }}>
                            O que você precisa? <span style={{ color: '#A35858' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setTipoServico('Conserto')}
                                className="service-option-btn"
                                style={{
                                    border: tipoServico === 'Conserto' ? '2px solid #A35858' : '1px solid #F0E3E3',
                                    background: tipoServico === 'Conserto' ? '#FAF2F2' : '#ffffff',
                                    color: tipoServico === 'Conserto' ? '#A35858' : '#625353',
                                    fontWeight: tipoServico === 'Conserto' ? 700 : 500,
                                }}
                            >
                                🪡 Conserto (Reparos gerais)
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setTipoServico('Ajuste')}
                                className="service-option-btn"
                                style={{
                                    border: tipoServico === 'Ajuste' ? '2px solid #A35858' : '1px solid #F0E3E3',
                                    background: tipoServico === 'Ajuste' ? '#FAF2F2' : '#ffffff',
                                    color: tipoServico === 'Ajuste' ? '#A35858' : '#625353',
                                    fontWeight: tipoServico === 'Ajuste' ? 700 : 500,
                                }}
                            >
                                ✂️ Ajuste (Modificações)
                            </button>
                        </div>
                    </div>

                    {/* Descrição livre */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', color: '#2D2323', marginBottom: '0.75rem', fontWeight: 600 }}>
                            Descreva brevemente o que precisa <span style={{ color: '#A35858' }}>*</span>
                        </label>
                        <textarea 
                            rows={4}
                            required
                            placeholder="Ex: Preciso fazer a barra de uma calça, ajustar a cintura de um vestido, trocar zíper..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="form-textarea"
                        />
                    </div>

                    {/* Botão WhatsApp */}
                    <button type="submit" className="submit-btn">
                        💬 Continuar Atendimento no WhatsApp
                    </button>
                </form>
            </div>
        </section>
    );
}

export default RepairsPage;