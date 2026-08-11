import { useState, useMemo } from 'react';
import type { Product, ProductCategory } from '../types';
import { getProducts, initializeDefaultProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import { mockProducts } from '../data/products';

function AdminPage() {
    useMemo(() => {
        initializeDefaultProducts(mockProducts);
    }, []);

    const [products, setProducts] = useState<Product[]>(getProducts());
    const [isEditing, setIsEditing] = useState<number | null>(null);
    
    // Modificado para guardar um objeto contendo o ID e o Título do produto que será excluído
    const [itemToDelete, setItemToDelete] = useState<{ id: number; title: string } | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Enxoval de Bebê' as ProductCategory,
        price: '',
        images: [] as string[],
        featured: false,
    });

    const refreshProducts = () => {
        setProducts(getProducts());
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (formData.images.length + files.length > 4) {
            alert('Você só pode adicionar no máximo 4 fotos por produto.');
            return;
        }

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, reader.result as string].slice(0, 4),
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleEdit = (product: Product) => {
        setIsEditing(product.id);
        const existingImages = (product as any).images 
            ? (product as any).images 
            : ((product as any).image ? [(product as any).image] : []);

        setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            images: existingImages,
            featured: product.featured || false,
        });
    };

    const handleCancel = () => {
        setIsEditing(null);
        setFormData({
            title: '',
            description: '',
            category: 'Enxoval de Bebê',
            price: '',
            images: [],
            featured: false,
        });
    };

    const confirmDelete = () => {
        if (itemToDelete !== null) {
            deleteProduct(itemToDelete.id);
            refreshProducts();
            setItemToDelete(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert('Por favor, adicione pelo menos 1 foto para o produto.');
            return;
        }

        const productPayload = {
            ...formData,
            image: formData.images[0],
        };

        if (isEditing) {
            updateProduct(isEditing, productPayload);
        } else {
            addProduct(productPayload);
        }

        refreshProducts();
        handleCancel();
    };

    const cardStyle = { 
        background: '#ffffff', 
        padding: '2rem', 
        borderRadius: '24px', 
        border: '1px solid #f2e6e6',
        boxShadow: '0 4px 20px rgba(230, 200, 200, 0.12)', 
        marginBottom: '2rem' 
    };

    const inputStyle = { 
        width: '100%', 
        padding: '0.75rem 1rem', 
        borderRadius: '12px', 
        border: '1px solid #e8dada',
        backgroundColor: '#faf6f6',
        outline: 'none',
        fontSize: '0.95rem',
        color: '#5e4e4e',
        boxSizing: 'border-box' as const
    };

    const labelStyle = { 
        display: 'block', 
        fontSize: '0.85rem', 
        fontWeight: 500, 
        marginBottom: '0.4rem', 
        color: '#8c7373' 
    };

    return (
        <div style={{ padding: '3rem 1rem', maxWidth: '850px', margin: '0 auto', color: '#5e4e4e', position: 'relative' }}>
            <h1 style={{ textAlign: 'center', color: '#b58b8b', marginBottom: '2.5rem', fontWeight: 400, fontSize: '1.8rem' }}>
                Painel do Administrador
            </h1>

            {/* Formulário de Cadastro / Edição */}
            <div style={cardStyle}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#b58b8b', fontWeight: 400 }}>
                    {isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}
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
                                <option value="Enxoval de Bebê">Enxoval de Bebê</option>
                                <option value="Batizado">Batizado</option>
                                <option value="Toalhas Personalizadas">Toalhas Personalizadas</option>
                                <option value="Acessórios & Maternidade">Acessórios & Maternidade</option>
                                <option value="Decoração do Quartinho">Decoração do Quartinho</option>
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
                        <label style={labelStyle}>Fotos do Produto (Até 4 fotos) *</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageUpload} 
                            disabled={formData.images.length >= 4}
                            style={{ marginBottom: '0.8rem', fontSize: '0.9rem' }}
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
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e8dada' }} 
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
                                                background: '#d98282', 
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
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#b58b8b' }}
                        />
                        <label htmlFor="featured" style={{ fontSize: '0.9rem', cursor: 'pointer', color: '#7a6666', userSelect: 'none' }}>
                            Destaque na página inicial
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                        <button 
                            type="submit" 
                            style={{ 
                                background: '#b58b8b', 
                                color: 'white', 
                                border: 'none', 
                                padding: '0.8rem 1.5rem', 
                                borderRadius: '12px', 
                                fontWeight: 500, 
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
                        </button>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={handleCancel} 
                                style={{ background: '#f0e6e6', color: '#7a6666', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista de Produtos Cadastrados */}
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: '#b58b8b', fontWeight: 400 }}>
                Produtos Cadastrados ({products.length})
            </h2>
            
            <div style={{ display: 'grid', gap: '0.8rem' }}>
                {products.map((product) => {
                    const productImages = (product as any).images || ((product as any).image ? [(product as any).image] : []);
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
                            border: '1px solid #f2e6e6',
                            boxShadow: '0 2px 8px rgba(230, 200, 200, 0.08)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {isUrl ? (
                                    <img 
                                        src={mainImage} 
                                        alt={product.title} 
                                        style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '10px' }} 
                                    />
                                ) : (
                                    <div style={{ width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf6f6', borderRadius: '10px', fontSize: '1.5rem' }}>
                                        {mainImage || '🖼️'}
                                    </div>
                                )}
                                <div>
                                    <strong style={{ display: 'block', color: '#5e4e4e', fontSize: '0.95rem' }}>{product.title}</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#a38f8f' }}>{product.category} • {product.price}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    onClick={() => handleEdit(product)} 
                                    style={{ background: '#f7eded', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', color: '#b58b8b', fontWeight: 500, fontSize: '0.85rem' }}
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => setItemToDelete({ id: product.id, title: product.title })} 
                                    style={{ background: '#fce8e8', color: '#d98282', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}
                                >
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Personalizado de Confirmação com Nome do Produto */}
            {itemToDelete !== null && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(94, 78, 78, 0.4)',
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
                        border: '1px solid #f2e6e6',
                        boxShadow: '0 10px 30px rgba(230, 200, 200, 0.25)',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                        <h3 style={{ fontSize: '1.2rem', color: '#5e4e4e', fontWeight: 500, marginBottom: '0.6rem' }}>
                            Excluir peça?
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#8c7373', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                            Tem certeza de que deseja remover o produto <strong style={{ color: '#5e4e4e' }}>"{itemToDelete.title}"</strong>? Esta ação não poderá ser desfeita.
                        </p>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button
                                onClick={() => setItemToDelete(null)}
                                style={{
                                    flex: 1,
                                    background: '#faf6f6',
                                    color: '#7a6666',
                                    border: '1px solid #e8dada',
                                    padding: '0.7rem',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    flex: 1,
                                    background: '#d98282',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '0.7rem',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(217, 130, 130, 0.3)'
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