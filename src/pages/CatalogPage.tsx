import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import { getProducts } from '../services/productService';
import type { Product } from '../types';

function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlBusca = searchParams.get('busca') || '';

    const [searchTerm, setSearchTerm] = useState(urlBusca);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent'>('recent');

    // Estados para o Modal de Peça Personalizada
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [customData, setCustomData] = useState({
        tema: '',
        tamanho: '',
        cor: '',
        observacoes: ''
    });

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    useEffect(() => {
        setSearchTerm(urlBusca);
    }, [urlBusca]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            setSearchParams({ busca: value });
        } else {
            setSearchParams({});
        }
    };

    const handleSendToWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        const phoneNumber = "5542984230849"; 
        
        const message = `✨ *Novo Pedido de Peça Personalizada* ✨%0A%0A` +
            `- *Tema / Estampa:* ${customData.tema}%0A` +
            `- *Tamanho:* ${customData.tamanho}%0A` +
            `- *Cor Predominante:* ${customData.cor}%0A` +
            `- *Observações:* ${customData.observacoes || 'Nenhuma'}`;

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        setIsCustomModalOpen(false);
    };

    const filteredProducts = useMemo(() => {
        let filtered: Product[] = products;

        if (urlBusca) {
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(urlBusca.toLowerCase()) ||
                    p.description.toLowerCase().includes(urlBusca.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        const sorted = [...filtered];
        if (sortBy === 'price-asc') {
            sorted.sort((a, b) => parseFloat(a.price.replace('R$ ', '').replace(',', '.')) - parseFloat(b.price.replace('R$ ', '').replace(',', '.')));
        } else if (sortBy === 'price-desc') {
            sorted.sort((a, b) => parseFloat(b.price.replace('R$ ', '').replace(',', '.')) - parseFloat(a.price.replace('R$ ', '').replace(',', '.')));
        }

        return sorted;
    }, [products, urlBusca, selectedCategory, sortBy]);

    const categories = ['Enxoval de Bebê', 'Batizado', 'Toalhas Personalizadas', 'Acessórios & Maternidade', 'Decoração do Quartinho'];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem', color: '#b58b8b' }}>Carregando catálogo...</div>;
    }

    return (
        <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', color: '#5e4e4e', fontWeight: 400, marginBottom: '0.4rem' }}>
                    {urlBusca ? `Resultados para "${urlBusca}"` : 'Nosso Catálogo'}
                </h2>
                <p style={{ color: '#8c7373', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                    Peças bordadas à mão, personalizadas para trazer amor e elegância ao quartinho do seu filho.
                </p>
            </div>

            {/* Banner de Destaque para Peças Personalizadas */}
            <div style={{
                background: 'linear-gradient(135deg, #fdf6f6 0%, #f4e8e8 100%)',
                border: '1px solid #e8dada',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '2rem',
                boxShadow: '0 4px 20px rgba(230, 200, 200, 0.15)'
            }}>
                <h3 style={{ color: '#5e4e4e', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                    ✨ Quer uma peça exclusiva e feita sob medida?
                </h3>
                <p style={{ color: '#8c7373', fontSize: '0.92rem', maxWidth: '550px', margin: '0 auto 1.2rem auto', lineHeight: '1.4' }}>
                    Escolha o tema, o tamanho e as cores ideais. Nós preparamos o seu orçamento personalizado direto pelo WhatsApp!
                </p>
                <button
                    onClick={() => setIsCustomModalOpen(true)}
                    style={{
                        background: '#b58b8b',
                        color: '#fff',
                        border: 'none',
                        padding: '0.7rem 1.8rem',
                        borderRadius: '25px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(181, 139, 139, 0.3)',
                        transition: 'background 0.2s'
                    }}
                >
                    Personalizar Peça Agora
                </button>
            </div>

            {/* Painel de Filtros Organizado */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem', 
                background: '#ffffff', 
                padding: '1.2rem 1.5rem', 
                borderRadius: '20px', 
                border: '1px solid #f2e6e6',
                boxShadow: '0 4px 20px rgba(230, 200, 200, 0.12)',
                marginBottom: '1.5rem' 
            }}>
                {/* Linha 1: Pílulas de Categoria */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{ 
                            padding: '0.4rem 0.9rem', 
                            fontSize: '0.82rem', 
                            borderRadius: '20px',
                            border: '1px solid #e8dada',
                            cursor: 'pointer',
                            background: !selectedCategory ? '#b58b8b' : '#faf6f6', 
                            color: !selectedCategory ? '#fff' : '#7a6666',
                            fontWeight: !selectedCategory ? 600 : 400
                        }}
                    >
                        ✨ Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ 
                                padding: '0.4rem 0.9rem', 
                                fontSize: '0.82rem', 
                                borderRadius: '20px',
                                border: '1px solid #e8dada',
                                cursor: 'pointer',
                                background: selectedCategory === cat ? '#b58b8b' : '#faf6f6', 
                                color: selectedCategory === cat ? '#fff' : '#7a6666',
                                fontWeight: selectedCategory === cat ? 600 : 400
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Linha Divisória Delicada */}
                <div style={{ height: '1px', background: '#f4e8e8', width: '100%' }}></div>

                {/* Linha 2: Busca (Ocupando espaço) + Ordenação */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: '#faf6f6', 
                        border: '1px solid #e8dada', 
                        borderRadius: '15px', 
                        padding: '0.4rem 1rem', 
                        flex: '1',
                        minWidth: '260px',
                        height: '38px' 
                    }}>
                        <span style={{ marginRight: '0.5rem', fontSize: '0.85rem' }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Buscar peça por nome ou descrição..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                boxShadow: 'none',
                                fontSize: '0.85rem',
                                color: '#7a6666',
                                width: '100%'
                            }}
                        />
                    </div>

                    <div>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                background: '#faf6f6',
                                border: '1px solid #e8dada',
                                padding: '0.4rem 1rem',
                                borderRadius: '15px',
                                fontSize: '0.85rem',
                                color: '#7a6666',
                                outline: 'none',
                                cursor: 'pointer',
                                height: '38px'
                            }}
                        >
                            <option value="recent">Mais Recentes</option>
                            <option value="price-asc">Menor Preço</option>
                            <option value="price-desc">Maior Preço</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ paddingLeft: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ color: '#a38f8f', fontSize: '0.85rem' }}>
                    {filteredProducts.length} produto(s) encontrado(s)
                </span>
            </div>

            <div className="grid products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#a38f8f' }}>
                        <p style={{ fontSize: '1.1rem' }}>Nenhum produto encontrado com esses critérios.</p>
                    </div>
                )}
            </div>

            {/* Modal Reutilizado para Pedido Personalizado */}
            <Modal 
                isOpen={isCustomModalOpen} 
                title="Criar Peça Personalizada" 
                onClose={() => setIsCustomModalOpen(false)}
            >
                <form onSubmit={handleSendToWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#7a6666', marginBottom: '0.3rem' }}>Tema / Estampa desejada *</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Ursinho marinheiro, Floral rosa..." 
                            value={customData.tema}
                            onChange={(e) => setCustomData({...customData, tema: e.target.value})}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e8dada', outline: 'none', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#7a6666', marginBottom: '0.3rem' }}>Tamanho / Medidas *</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Berço americano, Toalha banho 70x140cm..." 
                            value={customData.tamanho}
                            onChange={(e) => setCustomData({...customData, tamanho: e.target.value})}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e8dada', outline: 'none', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#7a6666', marginBottom: '0.3rem' }}>Cor Predominante / Paleta *</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Azul marinho e dourado, Rosa bebê..." 
                            value={customData.cor}
                            onChange={(e) => setCustomData({...customData, cor: e.target.value})}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e8dada', outline: 'none', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#7a6666', marginBottom: '0.3rem' }}>Observações adicionais</label>
                        <textarea 
                            rows={3}
                            placeholder="Algum detalhe extra, nome do bebê a ser bordado, etc." 
                            value={customData.observacoes}
                            onChange={(e) => setCustomData({...customData, observacoes: e.target.value})}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e8dada', outline: 'none', fontSize: '0.9rem', resize: 'vertical' }}
                        />
                    </div>

                    <button 
                        type="submit"
                        style={{
                            background: '#b58b8b',
                            color: '#fff',
                            border: 'none',
                            padding: '0.9rem',
                            borderRadius: '10px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.95rem',
                            boxShadow: '0 4px 12px rgba(181, 139, 139, 0.25)',
                            transition: 'background 0.2s'
                        }}
                    >
                        💬 Enviar Orçamento no WhatsApp
                    </button>
                </form>
            </Modal>
        </section>
    );
}

export default CatalogPage;