import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import { getProducts } from '../services/productService';
import type { Product } from '../types';

type SortOption = 'price-asc' | 'price-desc' | 'recent';

function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlBusca = searchParams.get('busca') || '';

    const [searchTerm, setSearchTerm] = useState(urlBusca);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('recent');

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

    // Helper para converter strings de preço (ex: "R$ 1.250,50" ou "120,00") em números válidos
    const parsePrice = (priceStr: string): number => {
        if (!priceStr) return 0;
        const cleanStr = priceStr
            .replace(/[^\d,-]/g, '') // Remove R$ e espaços
            .replace(/\./g, '')       // Remove pontos de milhar
            .replace(',', '.');      // Converte vírgula decimal em ponto
        return parseFloat(cleanStr) || 0;
    };

    const handleSendToWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        const phoneNumber = "5542984230849";
        
        const rawMessage = 
            `✨ *Novo Pedido de Peça Personalizada* ✨\n\n` +
            `- *Tema / Estampa:* ${customData.tema}\n` +
            `- *Tamanho:* ${customData.tamanho}\n` +
            `- *Cor Predominante:* ${customData.cor}\n` +
            `- *Observações:* ${customData.observacoes || 'Nenhuma'}`;

        const encodedMessage = encodeURIComponent(rawMessage);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        
        // Limpa formulário e fecha o modal
        setCustomData({ tema: '', tamanho: '', cor: '', observacoes: '' });
        setIsCustomModalOpen(false);
    };

    const filteredProducts = useMemo(() => {
        let filtered: Product[] = products;

        if (urlBusca) {
            const query = urlBusca.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query)
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        const sorted = [...filtered];
        if (sortBy === 'price-asc') {
            sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        } else if (sortBy === 'price-desc') {
            sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        }

        return sorted;
    }, [products, urlBusca, selectedCategory, sortBy]);

    const categories = ['Enxoval de Bebê', 'Batizado', 'Toalhas Personalizadas', 'Acessórios & Maternidade', 'Decoração do Quartinho'];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem', color: '#A65B5B', fontWeight: 600 }}>Carregando catálogo...</div>;
    }

    return (
        <section style={{ padding: '3rem 1.5rem 4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Cabeçalho do Catálogo */}
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.2rem', color: '#2A1B1B', fontWeight: 600, marginBottom: '0.6rem' }}>
                    {urlBusca ? `Resultados para "${urlBusca}"` : 'Nosso Catálogo'}
                </h2>
                <p style={{ color: '#4A3C3C', fontSize: '1rem', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
                    Peças bordadas à mão, personalizadas para trazer amor e elegância ao quartinho do seu filho.
                </p>
            </div>

            {/* Banner de Destaque */}
            <div style={{
                background: 'linear-gradient(135deg, #FFF5F5 0%, #F8ECE8 100%)',
                border: '1px solid #E8D5D5',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                marginBottom: '2.5rem',
                boxShadow: '0 8px 24px rgba(80, 50, 50, 0.06)'
            }}>
                <h3 style={{ color: '#2A1B1B', fontSize: '1.45rem', marginBottom: '0.6rem', fontWeight: 600 }}>
                    ✨ Quer uma peça exclusiva e feita sob medida?
                </h3>
                <p style={{ color: '#4A3C3C', fontSize: '0.98rem', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
                    Escolha o tema, o tamanho e as cores ideais. Nós preparamos o seu orçamento personalizado direto pelo WhatsApp!
                </p>
                <button
                    onClick={() => setIsCustomModalOpen(true)}
                    style={{
                        background: '#A65B5B',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.85rem 2.2rem',
                        borderRadius: '14px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(166, 91, 91, 0.2)',
                        transition: 'transform 0.2s, background 0.2s'
                    }}
                >
                    Personalizar Peça Agora
                </button>
            </div>

            {/* Painel de Filtros */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.2rem', 
                background: '#ffffff', 
                padding: '1.5rem', 
                borderRadius: '20px', 
                border: '1px solid #E8D5D5',
                boxShadow: '0 8px 24px rgba(80, 50, 50, 0.05)',
                marginBottom: '2rem' 
            }}>
                {/* Linha 1: Pílulas de Categoria */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{ 
                            padding: '0.5rem 1.1rem', 
                            fontSize: '0.88rem', 
                            borderRadius: '20px',
                            border: !selectedCategory ? '1px solid #A65B5B' : '1px solid #E8D5D5',
                            cursor: 'pointer',
                            background: !selectedCategory ? '#A65B5B' : '#FFF5F5', 
                            color: !selectedCategory ? '#ffffff' : '#4A3C3C',
                            fontWeight: !selectedCategory ? 600 : 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        ✨ Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ 
                                padding: '0.5rem 1.1rem', 
                                fontSize: '0.88rem', 
                                borderRadius: '20px',
                                border: selectedCategory === cat ? '1px solid #A65B5B' : '1px solid #E8D5D5',
                                cursor: 'pointer',
                                background: selectedCategory === cat ? '#A65B5B' : '#FFF5F5', 
                                color: selectedCategory === cat ? '#ffffff' : '#4A3C3C',
                                fontWeight: selectedCategory === cat ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ height: '1px', background: '#F0E2E2', width: '100%' }}></div>

                {/* Linha 2: Busca + Ordenação */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: '#FFF5F5', 
                        border: '1px solid #E8D5D5', 
                        borderRadius: '14px', 
                        padding: '0.5rem 1rem', 
                        flex: '1',
                        minWidth: '260px',
                        height: '42px' 
                    }}>
                        <span style={{ marginRight: '0.6rem', fontSize: '0.9rem' }}>🔍</span>
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
                                fontSize: '0.9rem',
                                color: '#2A1B1B',
                                width: '100%'
                            }}
                        />
                    </div>

                    <div>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            style={{
                                background: '#FFF5F5',
                                border: '1px solid #E8D5D5',
                                padding: '0.5rem 1rem',
                                borderRadius: '14px',
                                fontSize: '0.9rem',
                                color: '#2A1B1B',
                                fontWeight: 500,
                                outline: 'none',
                                cursor: 'pointer',
                                height: '42px'
                            }}
                        >
                            <option value="recent">Mais Recentes</option>
                            <option value="price-asc">Menor Preço</option>
                            <option value="price-desc">Maior Preço</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Contador de Produtos */}
            <div style={{ paddingLeft: '0.2rem', marginBottom: '1.5rem' }}>
                <span style={{ color: '#4A3C3C', fontSize: '0.9rem', fontWeight: 600 }}>
                    {filteredProducts.length} produto(s) encontrado(s)
                </span>
            </div>

            {/* Grid de Produtos */}
            <div className="grid products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#4A3C3C' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Nenhum produto encontrado com esses critérios.</p>
                    </div>
                )}
            </div>

            {/* Modal para Pedido Personalizado */}
            <Modal 
                isOpen={isCustomModalOpen} 
                title="Criar Peça Personalizada" 
                onClose={() => setIsCustomModalOpen(false)}
            >
                <form onSubmit={handleSendToWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', color: '#2A1B1B', fontWeight: 600, marginBottom: '0.4rem' }}>Tema / Estampa desejada *</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Ursinho marinheiro, Floral rosa..." 
                            value={customData.tema}
                            onChange={(e) => setCustomData({...customData, tema: e.target.value})}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E8D5D5', outline: 'none', fontSize: '0.92rem', color: '#2A1B1B' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', color: '#2A1B1B', fontWeight: 600, marginBottom: '0.4rem' }}>Tamanho / Medidas *</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Berço americano, Toalha banho 70x140cm..." 
                            value={customData.tamanho}
                            onChange={(e) => setCustomData({...customData, tamanho: e.target.value})}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E8D5D5', outline: 'none', fontSize: '0.92rem', color: '#2A1B1B' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', color: '#2A1B1B', fontWeight: 600, marginBottom: '0.4rem' }}>Cor Predominante / Paleta *</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Azul marinho e dourado, Rosa bebê..." 
                            value={customData.cor}
                            onChange={(e) => setCustomData({...customData, cor: e.target.value})}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E8D5D5', outline: 'none', fontSize: '0.92rem', color: '#2A1B1B' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', color: '#2A1B1B', fontWeight: 600, marginBottom: '0.4rem' }}>Observações adicionais</label>
                        <textarea 
                            rows={3}
                            placeholder="Algum detalhe extra, nome do bebê a ser bordado, etc." 
                            value={customData.observacoes}
                            onChange={(e) => setCustomData({...customData, observacoes: e.target.value})}
                            style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E8D5D5', outline: 'none', fontSize: '0.92rem', color: '#2A1B1B', resize: 'vertical' }}
                        />
                    </div>

                    <button 
                        type="submit"
                        style={{
                            background: '#A65B5B',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.95rem',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.98rem',
                            boxShadow: '0 4px 12px rgba(166, 91, 91, 0.2)',
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