import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

export function AdminOrderGenerator() {
    const cardRef = useRef<HTMLDivElement>(null);

    // Estados do Formulário
    const [clientName, setClientName] = useState('');
    const [categoryTitle, setCategoryTitle] = useState('');
    const [personName, setPersonName] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [unitValues, setUnitValues] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [instagram, setInstagram] = useState('@atelie.mariadias');
   

    // Função para baixar a imagem em alta qualidade
    const handleDownloadImage = async () => {
        if (!cardRef.current) return;
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
            const link = document.createElement('a');
            link.download = `Pedido_${clientName.replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Erro ao gerar imagem:', err);
        }
    };

    return (
        <div style={{ 
            padding: '1.5rem 1rem', 
            maxWidth: '1280px', 
            margin: '0 auto', 
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
            color: '#2D2323',
            boxSizing: 'border-box' 
        }}>
            
            {/* Cabeçalho da Página */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: '#2D2323', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    ✨ Gerador de Comprovante de Pedido
                </h1>
                <p style={{ color: '#7A6262', margin: 0, fontSize: '0.9rem' }}>
                    Preencha as informações do pedido e gere uma imagem bonita para enviar ao cliente.
                </p>
            </div>

            {/* Grid principal do Admin (Formulário x Preview) */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.5rem', 
                alignItems: 'start' 
            }}>
                
                {/* FORMULÁRIO DE PREENCHIMENTO */}
                <div style={{ 
                    background: '#FFFFFF', 
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    border: '1px solid #F2E6E6', 
                    boxShadow: '0 10px 30px rgba(163, 88, 88, 0.05)',
                    boxSizing: 'border-box'
                }}>
                    <h3 style={{ margin: '0 0 1.25rem 0', color: '#A35858', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📝 Dados do Pedido
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#524343', marginBottom: '0.4rem' }}>
                                    Nome do Cliente
                                </label>
                                <input 
                                    type="text" 
                                    value={clientName} 
                                    onChange={(e) => setClientName(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#524343', marginBottom: '0.4rem' }}>
                                    Categoria / Título
                                </label>
                                <input 
                                    type="text" 
                                    value={categoryTitle} 
                                    onChange={(e) => setCategoryTitle(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#524343', marginBottom: '0.4rem' }}>
                                    Nome na Peça
                                </label>
                                <textarea 
                                    rows={3}
                                    value={personName} 
                                    onChange={(e) => setPersonName(e.target.value)}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#524343', marginBottom: '0.4rem' }}>
                                    Valor Total (R$)
                                </label>
                                <input 
                                    type="text" 
                                    value={totalValue} 
                                    onChange={(e) => setTotalValue(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#524343', marginBottom: '0.4rem' }}>
                                Especificações (Medidas / Detalhes)
                            </label>
                            <textarea 
                                rows={3}
                                value={specifications} 
                                onChange={(e) => setSpecifications(e.target.value)}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#524343', marginBottom: '0.4rem' }}>
                                Itens / Quantidades
                            </label>
                            <textarea 
                                rows={2}
                                value={unitValues} 
                                onChange={(e) => setUnitValues(e.target.value)}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#524343', marginBottom: '0.4rem' }}>
                                Data Prevista de Entrega
                            </label>
                            <input 
                                type="text" 
                                value={deliveryDate} 
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <button 
                            onClick={handleDownloadImage}
                            style={{ 
                                marginTop: '0.5rem', 
                                padding: '1rem', 
                                background: '#A35858', 
                                color: '#FFFFFF', 
                                border: 'none', 
                                borderRadius: '12px', 
                                fontWeight: 600, 
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 14px rgba(163, 88, 88, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.6rem',
                                width: '100%'
                            }}
                        >
                            📸 Baixar Imagem (PNG)
                        </button>
                    </div>
                </div>

                {/* PRÉ-VISUALIZAÇÃO DO CARTÃO DO PEDIDO (CANVAS EXPORTÁVEL) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7A6262', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Pré-visualização da Imagem
                    </span>

                    <div 
                        ref={cardRef} 
                        style={{ 
                            width: '100%', 
                            maxWidth: '440px', 
                            backgroundColor: '#FAF5F3', 
                            borderRadius: '24px',
                            padding: '20px', 
                            boxSizing: 'border-box',
                            color: '#2D2323',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                            border: '1px solid #EEDADA',
                            position: 'relative',
                            overflowWrap: 'break-word'
                        }}
                    >
                        {/* Topo / Marca */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <span style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 700, 
                                letterSpacing: '2px', 
                                color: '#A35858', 
                                textTransform: 'uppercase' 
                            }}>
                                Ateliê Maria Dias
                            </span>
                            <div style={{ 
                                margin: '8px auto 0 auto', 
                                display: 'inline-block', 
                                backgroundColor: '#A35858', 
                                color: '#FFFFFF', 
                                padding: '4px 16px', 
                                borderRadius: '20px', 
                                fontSize: '0.85rem', 
                                fontWeight: 600,
                                maxWidth: '100%',
                                wordBreak: 'break-word'
                            }}>
                                Pedido: {clientName}
                            </div>
                        </div>

                        {/* Banner da Categoria */}
                        <div style={{ 
                            backgroundColor: '#FFFFFF', 
                            borderRadius: '16px', 
                            padding: '14px', 
                            textAlign: 'center', 
                            marginBottom: '16px',
                            border: '1px solid #EEDADA',
                            boxShadow: '0 2px 8px rgba(163, 88, 88, 0.04)'
                        }}>
                            <span style={{ fontSize: '0.75rem', color: '#7A6262', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                                Categoria
                            </span>
                            <h2 style={{ margin: 0, color: '#A35858', fontSize: '1.25rem', fontWeight: 700, wordBreak: 'break-word' }}>
                                {categoryTitle}
                            </h2>
                        </div>

                        {/* Grid Nome & Especificações */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                            <div style={cardBlockStyle}>
                                <span style={cardBlockTitleStyle}>Nome na Peça</span>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#2D2323', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: '1.4', wordBreak: 'break-word' }}>
                                    {personName}
                                </p>
                            </div>

                            <div style={cardBlockStyle}>
                                <span style={cardBlockTitleStyle}>Especificações</span>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#524343', whiteSpace: 'pre-line', lineHeight: '1.4', wordBreak: 'break-word' }}>
                                    {specifications}
                                </p>
                            </div>
                        </div>

                        {/* Grid Itens & Valor Total */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                            <div style={cardBlockStyle}>
                                <span style={cardBlockTitleStyle}>Itens / Qtd.</span>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#524343', whiteSpace: 'pre-line', lineHeight: '1.4', wordBreak: 'break-word' }}>
                                    {unitValues}
                                </p>
                            </div>

                            <div style={{ ...cardBlockStyle, backgroundColor: '#FFF5F5', borderColor: '#F2D6D6', justifyContent: 'center' }}>
                                <span style={{ ...cardBlockTitleStyle, color: '#A35858' }}>Valor Total</span>
                                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#A35858', textAlign: 'center' }}>
                                    R$ {totalValue}
                                </p>
                            </div>
                        </div>

                        {/* Faixa de Entrega */}
                        <div style={{ 
                            backgroundColor: '#A35858', 
                            color: '#FFFFFF', 
                            borderRadius: '12px', 
                            padding: '10px 12px', 
                            textAlign: 'center', 
                            fontSize: '0.85rem', 
                            fontWeight: 600, 
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            flexWrap: 'wrap'
                        }}>
                            🗓️ Entrega prevista: {deliveryDate}
                        </div>

                        {/* Rodapé com Instagram e QR Code */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            paddingTop: '12px', 
                            borderTop: '1px dashed #EEDADA',
                            gap: '8px'
                        }}>
                            <div style={{ minWidth: 0 }}>
                                <span style={{ fontSize: '0.68rem', color: '#7A6262', display: 'block', textTransform: 'uppercase' }}>
                                    Siga no Instagram
                                </span>
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#A35858', wordBreak: 'break-all' }}>
                                    {instagram}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Estilos Reutilizáveis
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid #E5D5D5',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#FAFAFA',
    color: '#2D2323'
};

const cardBlockStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '10px',
    border: '1px solid #EEDADA',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80px',
    boxSizing: 'border-box'
};

const cardBlockTitleStyle: React.CSSProperties = {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#7A6262',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
    display: 'block'
};

export default AdminOrderGenerator;