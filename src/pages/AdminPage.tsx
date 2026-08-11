import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';
import Modal from '../components/Modal';
import type { Product } from '../types';

function AdminPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>(getProducts());
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Enxoval de Bebê' as any,
        price: '',
        image: '✿',
    });

    if (user?.role !== 'admin') {
        return (
            <section className="container">
                <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Acesso Negado</h2>
                    <p>Apenas administradores podem acessar esta página.</p>
                    <button className="btn" onClick={() => navigate('/')}>Voltar</button>
                </div>
            </section>
        );
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreate = () => {
        if (!formData.title || !formData.price || !formData.category) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }
        const newProduct = addProduct({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: formData.price,
            image: formData.image,
        });
        setProducts([...products, newProduct]);
        setFormData({ title: '', description: '', category: 'Enxoval de Bebê', price: '', image: '✿' });
        setIsCreateModalOpen(false);
    };

    const handleUpdateClick = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            image: product.image,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedProduct) return;
        updateProduct(selectedProduct.id, {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: formData.price,
            image: formData.image,
        });
        setProducts(getProducts());
        setIsEditModalOpen(false);
        setFormData({ title: '', description: '', category: 'Enxoval de Bebê', price: '', image: '✿' });
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!selectedProduct) return;
        deleteProduct(selectedProduct.id);
        setProducts(getProducts());
        setIsDeleteModalOpen(false);
    };

    const filteredProducts = products.filter(
        (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['Enxoval de Bebê', 'Batizado', 'Acessórios & Maternidade', 'Decoração do Quartinho'];

    return (
        <section className="container">
            <div className="section-title">
                <h2>Painel Administrativo</h2>
                <button className="btn" onClick={() => setIsCreateModalOpen(true)}>
                    + Novo Produto
                </button>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(196, 139, 144, 0.08)' }}>
                <label>Buscar produtos</label>
                <input
                    type="text"
                    placeholder="Buscar por nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="panel">
                <p style={{ color: '#a89a97', marginBottom: '1rem' }}>Total: {filteredProducts.length} produto(s)</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th style={{ width: '150px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{product.image}</span>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{product.title}</p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a89a97' }}>{product.description.substring(0, 50)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{product.price}</td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateClick(product)}
                                        style={{ marginRight: '0.5rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(product)}
                                        style={{ background: 'none', border: 'none', color: '#e07070', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isCreateModalOpen} title="Novo Produto" onClose={() => setIsCreateModalOpen(false)}>
                <div style={{ marginTop: '1rem' }}>
                    <label>Título *</label>
                    <input name="title" value={formData.title} onChange={handleFormChange} placeholder="Ex: Kit Lençol Bordado" />
                    <label>Descrição *</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Descreva o produto..." style={{ minHeight: '80px' }} />
                    <label>Preço *</label>
                    <input name="price" value={formData.price} onChange={handleFormChange} placeholder="R$ 00,00" />
                    <label>Categoria *</label>
                    <select name="category" value={formData.category} onChange={handleFormChange}>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <label>Ícone/Emoji</label>
                    <input name="image" value={formData.image} onChange={handleFormChange} placeholder="✿" />
                    <div className="modal-actions">
                        <button className="btn ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</button>
                        <button className="btn" onClick={handleCreate}>Criar Produto</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} title="Editar Produto" onClose={() => setIsEditModalOpen(false)}>
                <div style={{ marginTop: '1rem' }}>
                    <label>Título *</label>
                    <input name="title" value={formData.title} onChange={handleFormChange} />
                    <label>Descrição *</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} style={{ minHeight: '80px' }} />
                    <label>Preço *</label>
                    <input name="price" value={formData.price} onChange={handleFormChange} />
                    <label>Categoria *</label>
                    <select name="category" value={formData.category} onChange={handleFormChange}>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <label>Ícone/Emoji</label>
                    <input name="image" value={formData.image} onChange={handleFormChange} />
                    <div className="modal-actions">
                        <button className="btn ghost" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                        <button className="btn" onClick={handleUpdate}>Atualizar Produto</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} title="Confirmar Exclusão" onClose={() => setIsDeleteModalOpen(false)}>
                <div style={{ marginTop: '1rem' }}>
                    <p>Tem certeza que deseja excluir o produto <strong>{selectedProduct?.title}</strong>? Esta ação é irreversível.</p>
                    <div className="modal-actions">
                        <button className="btn ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                        <button className="btn danger" onClick={handleDelete}>Excluir Permanentemente</button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}

export default AdminPage;
