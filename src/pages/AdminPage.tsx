import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Product, ProductCategory } from '../types';
import { productService } from '../services/productService';
import { mockProducts } from '../data/products';

// Categorias centralizadas (certifique-se que coincidem com seu types.ts)
const CATEGORIES: ProductCategory[] = [
    'Enxoval de Bebê',
    'Batizado',
    'Toalhas Personalizadas',
    'Acessórios & Maternidade',
    'Decoração do Quartinho',
];

// Processamento assíncrono de imagens via Canvas
const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem'));
        reader.onloadend = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Erro ao carregar a imagem no Canvas'));
            img.src = reader.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                resolve(compressedBase64);
            };
        };
        reader.readAsDataURL(file);
    });
};

function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState<number | string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: number | string; title: string } | null>(null);

    // Estados para Filtro e Busca
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES[0],
        price: '',
        measurements: '',
        images: [] as string[],
        featured: false,
    });

    useEffect(() => {
        async function loadData() {
            let data = await productService.getProducts();
            if (data.length === 0 && mockProducts.length > 0) {
                await productService.saveProducts(mockProducts);
                data = await productService.getProducts();
            }
            setProducts(data);
        }
        loadData();
    }, []);

    const refreshProducts = async () => {
        const data = await productService.getProducts();
        setProducts(data);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (formData.images.length + files.length > 4) {
            toast.error('Você só pode adicionar no máximo 4 fotos por produto.');
            return;
        }

        try {
            const compressedImages = await Promise.all(files.map(processImageFile));
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...compressedImages].slice(0, 4),
            }));
        } catch (error) {
            toast.error('Ocorreu um erro ao processar uma ou mais imagens.');
        } finally {
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleEdit = (product: Product) => {
        setIsEditing(product.id);
        const existingImages = product.images && product.images.length > 0 
            ? product.images 
            : (product.image ? [product.image] : []);

        setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            measurements: product.measurements || '',
            images: existingImages,
            featured: product.featured || false,
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditing(null);
        setFormData({
            title: '',
            description: '',
            category: CATEGORIES[0],
            price: '',
            measurements: '',
            images: [],
            featured: false,
        });
    };

    const confirmDelete = async () => {
        if (itemToDelete !== null) {
            await productService.deleteProduct(itemToDelete.id);
            await refreshProducts();
            setItemToDelete(null);
            toast.success('Produto removido com sucesso!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            toast.error('Por favor, adicione pelo menos 1 foto para o produto.');
            return;
        }

        const productPayload: Product = {
            id: (isEditing !== null ? isEditing : Date.now()) as any,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: formData.price,
            measurements: formData.measurements,
            image: formData.images[0],
            images: formData.images,
            featured: formData.featured,
        };

        try {
            if (isEditing !== null) {
                await productService.updateProduct(isEditing, productPayload);
                toast.success('Produto atualizado com sucesso!');
            } else {
                await productService.addProduct(productPayload);
                toast.success('Produto cadastrado com sucesso!');
            }

            await refreshProducts();
            handleCancel();
        } catch (error) {
            toast.error('Erro ao salvar produto. Verifique a conexão.');
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // ESTILOS COM ALTO CONTRASTE
    const cardStyle = { 
        background: '#ffffff', 
        padding: '2rem', 
        borderRadius: '24px', 
        border: '1px solid #dec3c3',
        boxShadow: '0 4px 20px rgba(180, 140, 140, 0.12)', 
        marginBottom: '2rem' 
    };

    const inputStyle = { 
        width: '100%', 
        padding: '0.75rem 1rem', 
        borderRadius: '12px', 
        border: '1.5px solid #d4b2b2',
        backgroundColor: '#fdfbfb',
        outline: 'none',
        fontSize: '0.95rem',
        color: '#2d2222',
        fontWeight: 400,
        boxSizing: 'border-box' as const
    };

    const labelStyle = { 
        display: 'block', 
        fontSize: '0.88rem', 
        fontWeight: 600, 
        marginBottom: '0.4rem', 
        color: '#4a3838' 
    };

    return (
        <div style={{ padding: '3rem 1rem', maxWidth: '850px', margin: '0 auto', color: '#2d2222', position: 'relative' }}>
            <h1 style={{ textAlign: 'center', color: '#7a4e4e', marginBottom: '2.5rem', fontWeight: 600, fontSize: '1.9rem' }}>
                Painel do Administrador
            </h1>

            {/* Formulário de Cadastro / Edição */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', color: '#7a4e4e', fontWeight: 600 }}>
                    {isEditing !== null ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
                    <div>
                        <label style={labelStyle}>Título do Produto *</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.title} 
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                        <div>
                            <label style={labelStyle}>Categoria *</label>
                            <select 
                                value={formData.category} 
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                                style={inputStyle}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Preço (ex: R$ 150,00) *</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.price} 
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Medidas / Tamanho da Peça</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 70cm x 140cm, Berço Americano, Tamanho Único..." 
                            value={formData.measurements} 
                            onChange={(e) => setFormData({ ...formData, measurements: e.target.value })} 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Fotos do Produto (Até 4 fotos) *</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageUpload} 
                            style={{ marginBottom: '0.8rem', fontSize: '0.9rem', color: '#4a3838' }}
                        />

                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {formData.images.map((imgUrl, index) => {
                                const isUrl = imgUrl.startsWith('http') || imgUrl.startsWith('data:');
                                return (
                                    <div key={index} style={{ position: 'relative', width: '75px', height: '75px' }}>
                                        {isUrl ? (
                                            <img 
                                                src={imgUrl} 
                                                alt="Preview" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #d4b2b2' }} 
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf6f6', borderRadius: '12px', fontSize: '1.5rem' }}>
                                                {imgUrl}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{ 
                                                position: 'absolute', 
                                                top: '-6px', 
                                                right: '-6px', 
                                                background: '#a81c1c', 
                                                color: '#fff', 
                                                border: 'none', 
                                                borderRadius: '50%', 
                                                width: '22px', 
                                                height: '22px', 
                                                fontSize: '11px', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Descrição *</label>
                        <textarea 
                            required 
                            rows={3} 
                            value={formData.description} 
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: 'fit-content' }}>
                        <input 
                            type="checkbox" 
                            id="featured" 
                            checked={formData.featured} 
                            onChange={(e) => {
                                if (e.target.checked) {
                                    const currentFeaturedCount = products.filter(p => p.featured && p.id !== isEditing).length;
                                    if (currentFeaturedCount >= 4) {
                                        toast.error('Já excedeu o limite de 4 destaques da página inicial.');
                                        return;
                                    }
                                }
                                setFormData({ ...formData, featured: e.target.checked });
                            }} 
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#8c5050' }}
                        />
                        <label htmlFor="featured" style={{ fontSize: '0.92rem', cursor: 'pointer', color: '#4a3838', fontWeight: 500, userSelect: 'none' }}>
                            Destaque na página inicial (Máx. 4)
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                        <button 
                            type="submit" 
                            style={{ 
                                background: '#8c5050', 
                                color: '#ffffff', 
                                border: 'none', 
                                padding: '0.85rem 1.8rem', 
                                borderRadius: '12px', 
                                fontWeight: 600, 
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(140, 80, 80, 0.25)',
                                transition: 'background 0.2s'
                            }}
                        >
                            {isEditing !== null ? 'Salvar Alterações' : 'Cadastrar Produto'}
                        </button>
                        {isEditing !== null && (
                            <button 
                                type="button" 
                                onClick={handleCancel} 
                                style={{ background: '#ede0e0', color: '#4a3838', border: '1px solid #d4b2b2', padding: '0.85rem 1.8rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Cabeçalho de Produtos Cadastrados */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: '#7a4e4e', fontWeight: 600, margin: 0 }}>
                    Produtos Cadastrados ({filteredProducts.length} de {products.length})
                </h2>
            </div>

            {/* BARRA DE PESQUISA E FILTROS */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 1fr', 
                gap: '1rem', 
                marginBottom: '1.5rem',
                background: '#ffffff',
                padding: '1.2rem',
                borderRadius: '16px',
                border: '1px solid #dec3c3',
                boxShadow: '0 2px 8px rgba(180, 140, 140, 0.1)'
            }}>
                <div>
                    <label style={labelStyle}>🔍 Buscar produto</label>
                    <input 
                        type="text"
                        placeholder="Digite o nome ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>📁 Categoria</label>
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="Todas">Todas as Categorias</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Lista de Produtos Filtrados */}
            <div style={{ display: 'grid', gap: '0.8rem' }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                        const productImages = product.images && product.images.length > 0 
                            ? product.images 
                            : (product.image ? [product.image] : []);
                        const mainImage = productImages[0] || '';
                        const isUrl = mainImage.startsWith('http') || mainImage.startsWith('data:');

                        return (
                            <div key={product.id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                background: '#fff', 
                                padding: '1rem 1.2rem', 
                                borderRadius: '16px', 
                                border: '1px solid #dec3c3',
                                boxShadow: '0 2px 8px rgba(180, 140, 140, 0.08)'
                            }}>
                                <Link 
                                    to={`/produto/${product.id}`} 
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', flex: 1 }}
                                >
                                    {isUrl ? (
                                        <img 
                                            src={mainImage} 
                                            alt={product.title} 
                                            style={{ width: '58px', height: '58px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e8d8d8' }} 
                                        />
                                    ) : (
                                        <div style={{ width: '58px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf6f6', borderRadius: '10px', fontSize: '1.5rem', border: '1px solid #e8d8d8' }}>
                                            {mainImage || '🖼️'}
                                        </div>
                                    )}
                                    <div>
                                        <strong style={{ display: 'block', color: '#2d2222', fontSize: '0.98rem', fontWeight: 600 }}>
                                            {product.title} {product.featured && '⭐'}
                                        </strong>
                                        <span style={{ fontSize: '0.85rem', color: '#524343', fontWeight: 500 }}>
                                            {product.category} • <span style={{ color: '#8c5050', fontWeight: 600 }}>{product.price}</span> {product.measurements && `• Medidas: ${product.measurements}`}
                                        </span>
                                    </div>
                                </Link>

                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                    <button 
                                        onClick={() => handleEdit(product)} 
                                        style={{ 
                                            background: '#f2e1e1', 
                                            border: '1px solid #d9c1c1', 
                                            padding: '0.55rem 1.1rem', 
                                            borderRadius: '10px', 
                                            cursor: 'pointer', 
                                            color: '#6e3838', 
                                            fontWeight: 600, 
                                            fontSize: '0.85rem' 
                                        }}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        onClick={() => setItemToDelete({ id: product.id, title: product.title })} 
                                        style={{ 
                                            background: '#fbe3e3', 
                                            color: '#a81c1c', 
                                            border: '1px solid #f3b8b8', 
                                            padding: '0.55rem 1.1rem', 
                                            borderRadius: '10px', 
                                            cursor: 'pointer', 
                                            fontWeight: 600, 
                                            fontSize: '0.85rem' 
                                        }}
                                    >
                                        🗑️ Excluir
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '2.5rem 1rem', 
                        background: '#ffffff', 
                        borderRadius: '16px', 
                        border: '1px dashed #d4b2b2',
                        color: '#524343',
                        fontWeight: 500
                    }}>
                        Nenhum produto encontrado com os filtros aplicados.
                    </div>
                )}
            </div>

            {/* Modal de Confirmação */}
            {itemToDelete !== null && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(45, 34, 34, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: '#ffffff',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid #dec3c3',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                        <h3 style={{ fontSize: '1.25rem', color: '#2d2222', fontWeight: 600, marginBottom: '0.6rem' }}>
                            Excluir peça?
                        </h3>
                        <p style={{ fontSize: '0.92rem', color: '#524343', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                            Tem certeza de que deseja remover o produto <strong style={{ color: '#2d2222' }}>"{itemToDelete.title}"</strong>? Esta ação não poderá ser desfeita.
                        </p>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button
                                onClick={() => setItemToDelete(null)}
                                style={{
                                    flex: 1,
                                    background: '#faf6f6',
                                    color: '#4a3838',
                                    border: '1px solid #d4b2b2',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    flex: 1,
                                    background: '#a81c1c',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(168, 28, 28, 0.3)'
                                }}
                            >
                                Sim, excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;