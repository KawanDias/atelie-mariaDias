import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

export function AdminOrderGenerator() {
    const cardRef = useRef<HTMLDivElement>(null);

    // Estados do Formulário
    const [clientName, setClientName] = useState('Valdineia');
    const [categoryTitle, setCategoryTitle] = useState('Bordados Personalizados');
    const [personName, setPersonName] = useState('Joaquim Miguel');
    const [specifications, setSpecifications] = useState('• Bordado: Nome sobreposto\n• Tamanho 1: 8,5 x 17 cm\n• Tamanho 2: 9 x 18 cm');
    const [unitValues, setUnitValues] = useState('4x Item 1: R$ 25,00\n1x Item 2: R$ 30,00');
    const [totalValue, setTotalValue] = useState('130,00');
    const [deliveryDate, setDeliveryDate] = useState('18 de Agosto');
    const [instagram, setInstagram] = useState('@atelie.mariadias');
    const [qrCodeUrl, setQrCodeUrl] = useState('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://instagram.com/atelie.mariadias');

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
        <div style={{ padding: '2.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#2D2323' }}>
            
            {/* Cabeçalho da Página */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#2D2323', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    ✨ Gerador de Comprovante de Pedido
                </h1>
                <p style={{ color: '#7A6262', margin: 0, fontSize: '0.95rem' }}>
                    Preencha as informações do pedido e gere uma imagem bonita para enviar ao cliente.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
                
                {/* FORMULÁRIO DE PREENCHIMENTO */}
                <div style={{ 
                    background: '#FFFFFF', 
                    padding: '2rem', 
                    borderRadius: '20px', 
                    border: '1px solid #F2E6E6', 
                    boxShadow: '0 10px 30px rgba(163, 88, 88, 0.05)' 
                }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#A35858', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📝 Dados do Pedido
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                                gap: '0.6rem'
                            }}
                        >
                            📸 Baixar Imagem (PNG)
                        </button>
                    </div>
                </div>

                {/* PRÉ-VISUALIZAÇÃO DO CARTÃO DO PEDIDO (CANVAS EXPORTÁVEL) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7A6262', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Pré-visualização da Imagem
                    </span>

                    <div 
                        ref={cardRef} 
                        style={{ 
                            width: '440px', 
                            backgroundColor: '#FAF5F3', 
                            borderRadius: '24px',
                            padding: '24px', 
                            boxSizing: 'border-box',
                            color: '#2D2323',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                            border: '1px solid #EEDADA',
                            position: 'relative'
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
                                fontWeight: 600 
                            }}>
                                Pedido: {clientName}
                            </div>
                        </div>

                        {/* Banner da Categoria */}
                        <div style={{ 
                            backgroundColor: '#FFFFFF', 
                            borderRadius: '16px', 
                            padding: '16px', 
                            textAlign: 'center', 
                            marginBottom: '16px',
                            border: '1px solid #EEDADA',
                            boxShadow: '0 2px 8px rgba(163, 88, 88, 0.04)'
                        }}>
                            <span style={{ fontSize: '0.75rem', color: '#7A6262', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                                Categoria
                            </span>
                            <h2 style={{ margin: 0, color: '#A35858', fontSize: '1.4rem', fontWeight: 700 }}>
                                {categoryTitle}
                            </h2>
                        </div>

                        {/* Grid Nome & Especificações */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div style={cardBlockStyle}>
                                <span style={cardBlockTitleStyle}>Nome na Peça</span>
                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#2D2323', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                    {personName}
                                </p>
                            </div>

                            <div style={cardBlockStyle}>
                                <span style={cardBlockTitleStyle}>Especificações</span>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#524343', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                    {specifications}
                                </p>
                            </div>
                        </div>

                        {/* Grid Itens & Valor Total */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div style={cardBlockStyle}>
                                <span style={cardBlockTitleStyle}>Itens / Qtd.</span>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#524343', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                    {unitValues}
                                </p>
                            </div>

                            <div style={{ ...cardBlockStyle, backgroundColor: '#FFF5F5', borderColor: '#F2D6D6', justifyContent: 'center' }}>
                                <span style={{ ...cardBlockTitleStyle, color: '#A35858' }}>Valor Total</span>
                                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#A35858', textAlign: 'center' }}>
                                    R$ {totalValue}
                                </p>
                            </div>
                        </div>

                        {/* Faixa de Entrega */}
                        <div style={{ 
                            backgroundColor: '#A35858', 
                            color: '#FFFFFF', 
                            borderRadius: '12px', 
                            padding: '10px 14px', 
                            textAlign: 'center', 
                            fontSize: '0.88rem', 
                            fontWeight: 600, 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            🗓️ Entrega prevista: {deliveryDate}
                        </div>

                        {/* Rodapé com Instagram e QR Code */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            paddingTop: '12px', 
                            borderTop: '1px dashed #EEDADA'
                        }}>
                            <div>
                                <span style={{ fontSize: '0.7rem', color: '#7A6262', display: 'block', textTransform: 'uppercase' }}>
                                    Siga no Instagram
                                </span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#A35858' }}>
                                    {instagram}
                                </span>
                            </div>

                            {qrCodeUrl && (
                                <div style={{ background: '#FFFFFF', padding: '4px', borderRadius: '8px', border: '1px solid #EEDADA' }}>
                                    <img 
                                        src={qrCodeUrl} 
                                        alt="QR Code Instagram" 
                                        style={{ width: '52px', height: '52px', display: 'block', borderRadius: '4px' }}
                                    />
                                </div>
                            )}
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
    padding: '12px',
    border: '1px solid #EEDADA',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '85px',
    boxSizing: 'border-box'
};

const cardBlockTitleStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#7A6262',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    display: 'block'
};

export default AdminOrderGenerator;