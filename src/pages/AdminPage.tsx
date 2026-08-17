import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Product, ProductCategory } from '../types';
import { productService } from '../services/productService';
import { mockProducts } from '../data/products';

// =====================================================
// CATEGORIAS
// =====================================================

const CATEGORIES: ProductCategory[] = [
    'Enxoval de Bebê',
    'Batizado',
    'Toalhas Personalizadas',
    'Acessórios & Maternidade',
    'Decoração do Quartinho',
];

// =====================================================
// PROCESSAMENTO DA IMAGEM
// =====================================================
//
// A imagem passa por aqui antes de ser adicionada
// ao produto.
//
// 1. Redimensiona
// 2. Desenha a imagem original
// 3. Grava "ateliemariadias" diretamente na imagem
// 4. Exporta a imagem protegida
//
// =====================================================

const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reject(
                new Error('Erro ao ler o arquivo de imagem')
            );
        };

        reader.onload = () => {
            const img = new Image();

            img.onerror = () => {
                reject(
                    new Error(
                        'Erro ao carregar a imagem'
                    )
                );
            };

            img.onload = () => {
                const canvas = document.createElement('canvas');

                // Largura máxima da imagem
                const MAX_WIDTH = 1200;

                let width = img.naturalWidth;
                let height = img.naturalHeight;

                // Redimensionamento proporcional
                if (width > MAX_WIDTH) {
                    height = Math.round(
                        (height * MAX_WIDTH) / width
                    );

                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(
                        new Error(
                            'Não foi possível criar o Canvas'
                        )
                    );

                    return;
                }

                // =====================================================
                // 1. DESENHAR IMAGEM ORIGINAL
                // =====================================================

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                // =====================================================
                // 2. MARCA D'ÁGUA
                // =====================================================

                const watermarkText =
                    'ateliemariadias';

                ctx.save();

                // Opacidade da marca
                ctx.globalAlpha = 0.05;

                // Tamanho proporcional
                const fontSize = Math.max(
                    22,
                    Math.round(width * 0.035)
                );

                ctx.font = `700 ${fontSize}px Arial, sans-serif`;

                // Cor principal
                ctx.fillStyle = '#ffffff';

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Sombra para melhorar a visualização
                ctx.shadowColor =
                    'rgba(255, 255, 255, 0.85)';

                ctx.shadowBlur = 3;

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // Centraliza
                ctx.translate(
                    width / 2,
                    height / 2
                );

                // Inclinação diagonal
                ctx.rotate(
                    -Math.PI / 6
                );

                // Espaçamento
                const spacingX =
                    fontSize * 8;

                const spacingY =
                    fontSize * 4;

                // Tamanho diagonal
                const diagonal =
                    Math.sqrt(
                        width * width +
                        height * height
                    );

                // =====================================================
                // REPETIR MARCA D'ÁGUA
                // =====================================================

                for (
                    let y = -diagonal;
                    y <= diagonal;
                    y += spacingY
                ) {
                    for (
                        let x = -diagonal;
                        x <= diagonal;
                        x += spacingX
                    ) {
                        ctx.fillText(
                            watermarkText,
                            x,
                            y
                        );
                    }
                }

                ctx.restore();

                // =====================================================
                // 3. EXPORTAR IMAGEM PROTEGIDA
                // =====================================================

                const protectedImage =
                    canvas.toDataURL(
                        'image/jpeg',
                        0.85
                    );

                resolve(protectedImage);
            };

            img.src = reader.result as string;
        };

        reader.readAsDataURL(file);
    });
};

// =====================================================
// ADMIN PAGE
// =====================================================

function AdminPage() {

    const [products, setProducts] =
        useState<Product[]>([]);

    const [isEditing, setIsEditing] =
        useState<number | string | null>(null);

    const [itemToDelete, setItemToDelete] =
        useState<{
            id: number | string;
            title: string;
        } | null>(null);

    // =====================================================
    // FILTROS
    // =====================================================

    const [searchTerm, setSearchTerm] =
        useState('');

    const [selectedCategory, setSelectedCategory] =
        useState<string>('Todas');

    // =====================================================
    // FORMULÁRIO
    // =====================================================

    const [formData, setFormData] =
        useState({
            title: '',
            description: '',
            category: CATEGORIES[0],
            price: '',
            measurements: '',
            images: [] as string[],
            featured: false,
        });

    // =====================================================
    // CARREGAR PRODUTOS
    // =====================================================

    useEffect(() => {

        async function loadData() {

            let data =
                await productService.getProducts();

            if (
                data.length === 0 &&
                mockProducts.length > 0
            ) {
                await productService.saveProducts(
                    mockProducts
                );

                data =
                    await productService.getProducts();
            }

            setProducts(data);
        }

        loadData();

    }, []);

    // =====================================================
    // ATUALIZAR PRODUTOS
    // =====================================================

    const refreshProducts =
        async () => {

            const data =
                await productService.getProducts();

            setProducts(data);
        };

    // =====================================================
    // UPLOAD DE IMAGEM
    // =====================================================

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const files =
            Array.from(
                e.target.files || []
            );

        if (files.length === 0) {
            return;
        }

        if (
            formData.images.length +
            files.length >
            4
        ) {

            toast.error(
                'Você só pode adicionar no máximo 4 fotos por produto.'
            );

            return;
        }

        try {

            // =================================================
            // AQUI A IMAGEM É PROTEGIDA
            // =================================================

            const protectedImages =
                await Promise.all(
                    files.map(
                        processImageFile
                    )
                );

            // =================================================
            // ADICIONAR AO FORMULÁRIO
            // =================================================

            setFormData(
                (prev) => ({
                    ...prev,

                    images: [
                        ...prev.images,
                        ...protectedImages,
                    ].slice(0, 4),
                })
            );

            toast.success(
                'Imagem adicionada com marca d\'água!'
            );

        } catch (error) {

            console.error(
                'Erro ao processar imagem:',
                error
            );

            toast.error(
                'Ocorreu um erro ao processar a imagem.'
            );

        } finally {

            // Permitir selecionar a mesma imagem
            e.target.value = '';
        }
    };

    // =====================================================
    // REMOVER IMAGEM
    // =====================================================

    const removeImage = (
        indexToRemove: number
    ) => {

        setFormData(
            (prev) => ({
                ...prev,

                images:
                    prev.images.filter(
                        (_, index) =>
                            index !==
                            indexToRemove
                    ),
            })
        );
    };

    // =====================================================
    // EDITAR PRODUTO
    // =====================================================

    const handleEdit = (
        product: Product
    ) => {

        setIsEditing(product.id);

        const existingImages =
            product.images &&
            product.images.length > 0
                ? product.images
                : (
                    product.image
                        ? [product.image]
                        : []
                );

        setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            measurements:
                product.measurements || '',
            images: existingImages,
            featured:
                product.featured || false,
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // =====================================================
    // CANCELAR
    // =====================================================

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

    // =====================================================
    // EXCLUIR
    // =====================================================

    const confirmDelete =
        async () => {

            if (
                itemToDelete !== null
            ) {

                await productService.deleteProduct(
                    itemToDelete.id
                );

                await refreshProducts();

                setItemToDelete(null);

                toast.success(
                    'Produto removido com sucesso!'
                );
            }
        };

    // =====================================================
    // CADASTRAR / SALVAR
    // =====================================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (
            formData.images.length === 0
        ) {

            toast.error(
                'Por favor, adicione pelo menos 1 foto para o produto.'
            );

            return;
        }

        const productPayload: Product = {

            id:
                (
                    isEditing !== null
                        ? isEditing
                        : Date.now()
                ) as any,

            title:
                formData.title,

            description:
                formData.description,

            category:
                formData.category,

            price:
                formData.price,

            measurements:
                formData.measurements,

            image:
                formData.images[0],

            images:
                formData.images,

            featured:
                formData.featured,
        };

        try {

            if (
                isEditing !== null
            ) {

                await productService.updateProduct(
                    isEditing,
                    productPayload
                );

                toast.success(
                    'Produto atualizado com sucesso!'
                );

            } else {

                await productService.addProduct(
                    productPayload
                );

                toast.success(
                    'Produto cadastrado com sucesso!'
                );
            }

            await refreshProducts();

            handleCancel();

        } catch (error) {

            console.error(error);

            toast.error(
                'Erro ao salvar produto. Verifique a conexão.'
            );
        }
    };

    // =====================================================
    // FILTROS
    // =====================================================

    const filteredProducts =
        products.filter(
            (product) => {

                const matchesSearch =
                    product.title
                        .toLowerCase()
                        .includes(
                            searchTerm
                                .toLowerCase()
                        ) ||

                    product.description
                        .toLowerCase()
                        .includes(
                            searchTerm
                                .toLowerCase()
                        );

                const matchesCategory =
                    selectedCategory ===
                    'Todas' ||
                    product.category ===
                    selectedCategory;

                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );

    // =====================================================
    // INTERFACE
    // =====================================================

    return (

        <div
            style={{
                padding:
                    '3rem 1.25rem 4rem 1.25rem',

                maxWidth:
                    '880px',

                margin:
                    '0 auto',
            }}
        >

            <style>{`

                .admin-page-title {
                    text-align: center;
                    color: #2D2323;
                    margin-bottom: 2rem;
                    font-weight: 700;
                    font-size: 1.8rem;
                }

                .admin-card {
                    background: #ffffff;
                    padding: 2rem;
                    border-radius: 24px;
                    border: 1px solid #F0E3E3;
                    box-shadow: 0 8px 30px rgba(163, 88, 88, 0.05);
                    margin-bottom: 2rem;
                }

                .admin-card-title {
                    font-size: 1.35rem;
                    margin-bottom: 1.5rem;
                    color: #2D2323;
                    font-weight: 600;
                }

                .admin-label {
                    display: block;
                    font-size: 0.88rem;
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                    color: #2D2323;
                }

                .admin-input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    border: 1px solid #F0E3E3;
                    background-color: #FAF2F2;
                    outline: none;
                    font-size: 0.95rem;
                    color: #2D2323;
                    box-sizing: border-box;
                    transition:
                        border-color 0.2s,
                        background-color 0.2s;
                }

                .admin-input:focus {
                    border-color: #A35858;
                    background-color: #ffffff;
                }

                .form-grid-two {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.2rem;
                }

                .filter-bar {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    background: #ffffff;
                    padding: 1.2rem;
                    border-radius: 20px;
                    border: 1px solid #F0E3E3;
                    box-shadow: 0 4px 15px rgba(163, 88, 88, 0.04);
                }

                .product-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #ffffff;
                    padding: 1rem 1.25rem;
                    border-radius: 18px;
                    border: 1px solid #F0E3E3;
                    box-shadow: 0 2px 10px rgba(163, 88, 88, 0.03);
                    transition:
                        transform 0.2s,
                        box-shadow 0.2s;
                }

                .product-row:hover {
                    box-shadow:
                        0 4px 16px
                        rgba(163, 88, 88, 0.08);
                }

                .btn-primary {
                    background: #A35858;
                    color: #ffffff;
                    border: none;
                    padding: 0.85rem 1.8rem;
                    border-radius: 14px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    box-shadow:
                        0 4px 14px
                        rgba(163, 88, 88, 0.2);
                    transition:
                        background 0.2s,
                        transform 0.2s;
                }

                .btn-primary:hover {
                    background: #8e4b4b;
                    transform: translateY(-1px);
                }

                .btn-secondary {
                    background: #FAF2F2;
                    color: #625353;
                    border: 1px solid #F0E3E3;
                    padding: 0.85rem 1.8rem;
                    border-radius: 14px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: background 0.2s;
                }

                .btn-secondary:hover {
                    background: #F0E3E3;
                }

                .btn-action-edit {
                    background: #FAF2F2;
                    border: 1px solid #F0E3E3;
                    padding: 0.55rem 1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    color: #A35858;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: background 0.2s;
                }

                .btn-action-edit:hover {
                    background: #F0E3E3;
                }

                .btn-action-delete {
                    background: #FDF2F2;
                    color: #C0392B;
                    border: 1px solid #F5C6C6;
                    padding: 0.55rem 1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: background 0.2s;
                }

                .btn-action-delete:hover {
                    background: #FADBD8;
                }

                .remove-img-btn {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: #C0392B;
                    color: #ffffff;
                    border: none;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    font-size: 11px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow:
                        0 2px 5px
                        rgba(0,0,0,0.2);
                }

                @media (max-width: 640px) {

                    .admin-card {
                        padding:
                            1.5rem 1.25rem;
                    }

                    .form-grid-two {
                        grid-template-columns: 1fr;
                    }

                    .filter-bar {
                        grid-template-columns: 1fr;
                    }

                    .product-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .product-actions {
                        width: 100%;
                        justify-content: flex-end;
                    }
                }

            `}</style>

            {/* =====================================================
                TÍTULO
            ===================================================== */}

            <h1 className="admin-page-title">
                Painel do Administrador
            </h1>

            {/* =====================================================
                GERADOR DE PEDIDOS
            ===================================================== */}

            <div className="admin-order-btn-container">

                <style>{`

                    .admin-order-btn-container {
                        margin:
                            1.5rem 0
                            1rem 15.2rem;
                    }

                    @media (max-width: 768px) {

                        .admin-order-btn-container {
                            margin: 1rem;
                        }

                        .admin-order-btn {
                            display:
                                flex !important;

                            width: 100%;

                            justify-content:
                                center;

                            box-sizing:
                                border-box;

                            text-align:
                                center;
                        }
                    }

                `}</style>

                <Link
                    to="/admin/gerador-pedidos"
                    className="admin-order-btn"
                    style={{
                        display:
                            'inline-flex',

                        alignItems:
                            'center',

                        gap:
                            '0.5rem',

                        background:
                            '#A35858',

                        color:
                            '#ffffff',

                        padding:
                            '0.8rem 1.4rem',

                        borderRadius:
                            '12px',

                        textDecoration:
                            'none',

                        fontWeight:
                            600,

                        boxShadow:
                            '0 4px 12px rgba(163, 88, 88, 0.2)',
                    }}
                >
                    🖼️ Gerar Comprovante de Pedido (Imagem)
                </Link>

            </div>

            {/* =====================================================
                FORMULÁRIO
            ===================================================== */}

            <div className="admin-card">

                <h2 className="admin-card-title">

                    {isEditing !== null
                        ? 'Editar Produto'
                        : 'Cadastrar Novo Produto'}

                </h2>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    style={{
                        display: 'grid',
                        gap: '1.2rem',
                    }}
                >

                    {/* TÍTULO */}

                    <div>

                        <label className="admin-label">
                            Título do Produto *
                        </label>

                        <input
                            type="text"
                            required
                            value={
                                formData.title
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title:
                                        e.target.value,
                                })
                            }
                            className="admin-input"
                            placeholder="Ex: Manta Piquet Bordada"
                        />

                    </div>

                    {/* CATEGORIA / PREÇO */}

                    <div className="form-grid-two">

                        <div>

                            <label className="admin-label">
                                Categoria *
                            </label>

                            <select
                                value={
                                    formData.category
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category:
                                            e.target
                                                .value as ProductCategory,
                                    })
                                }
                                className="admin-input"
                            >

                                {CATEGORIES.map(
                                    (cat) => (

                                        <option
                                            key={cat}
                                            value={cat}
                                        >
                                            {cat}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        <div>

                            <label className="admin-label">
                                Preço (ex: R$ 150,00) *
                            </label>

                            <input
                                type="text"
                                required
                                value={
                                    formData.price
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price:
                                            e.target.value,
                                    })
                                }
                                className="admin-input"
                                placeholder="R$ 0,00"
                            />

                        </div>

                    </div>

                    {/* MEDIDAS */}

                    <div>

                        <label className="admin-label">
                            Medidas / Tamanho da Peça
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: 70cm x 140cm, Berço Americano, Tamanho Único..."
                            value={
                                formData.measurements
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    measurements:
                                        e.target.value,
                                })
                            }
                            className="admin-input"
                        />

                    </div>

                    {/* FOTOS */}

                    <div>

                        <label className="admin-label">
                            Fotos do Produto (Até 4 fotos) *
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={
                                handleImageUpload
                            }
                            style={{
                                marginBottom:
                                    '0.8rem',

                                fontSize:
                                    '0.9rem',

                                color:
                                    '#625353',
                            }}
                        />

                        <div
                            style={{
                                display:
                                    'flex',

                                gap:
                                    '0.75rem',

                                flexWrap:
                                    'wrap',
                            }}
                        >

                            {formData.images.map(
                                (
                                    imgUrl,
                                    index
                                ) => {

                                    const isUrl =
                                        imgUrl.startsWith(
                                            'http'
                                        ) ||
                                        imgUrl.startsWith(
                                            'data:'
                                        );

                                    return (

                                        <div
                                            key={index}
                                            style={{
                                                position:
                                                    'relative',

                                                width:
                                                    '75px',

                                                height:
                                                    '75px',
                                            }}
                                        >

                                            {isUrl ? (

                                                <img
                                                    src={
                                                        imgUrl
                                                    }
                                                    alt="Preview"
                                                    draggable={
                                                        false
                                                    }
                                                    style={{
                                                        width:
                                                            '100%',

                                                        height:
                                                            '100%',

                                                        objectFit:
                                                            'cover',

                                                        borderRadius:
                                                            '12px',

                                                        border:
                                                            '1px solid #F0E3E3',

                                                        userSelect:
                                                            'none',
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    style={{
                                                        width:
                                                            '100%',

                                                        height:
                                                            '100%',

                                                        display:
                                                            'flex',

                                                        alignItems:
                                                            'center',

                                                        justifyContent:
                                                            'center',

                                                        background:
                                                            '#FAF2F2',

                                                        borderRadius:
                                                            '12px',

                                                        fontSize:
                                                            '1.5rem',
                                                    }}
                                                >
                                                    {
                                                        imgUrl
                                                    }
                                                </div>

                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        index
                                                    )
                                                }
                                                className="remove-img-btn"
                                                title="Remover Imagem"
                                            >
                                                ✕
                                            </button>

                                        </div>

                                    );
                                }
                            )}

                        </div>

                        <div
                            style={{
                                marginTop:
                                    '0.7rem',

                                padding:
                                    '0.8rem 1rem',

                                background:
                                    '#FAF2F2',

                                border:
                                    '1px solid #F0E3E3',

                                borderRadius:
                                    '10px',

                                fontSize:
                                    '0.82rem',

                                color:
                                    '#625353',
                            }}
                        >
                            🔒 <strong>Proteção ativada:</strong>{' '}
                            todas as imagens novas recebem
                            automaticamente a marca d'água{' '}
                            <strong>ateliemariadias</strong>{' '}
                            diretamente no arquivo.
                        </div>

                    </div>

                    {/* DESCRIÇÃO */}

                    <div>

                        <label className="admin-label">
                            Descrição *
                        </label>

                        <textarea
                            required
                            rows={3}
                            value={
                                formData.description
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description:
                                        e.target.value,
                                })
                            }
                            className="admin-input"
                            style={{
                                resize:
                                    'vertical',
                            }}
                            placeholder="Descreva detalhes como tipo de tecido, acabamento, etc."
                        />

                    </div>

                    {/* DESTAQUE */}

                    <div
                        style={{
                            display:
                                'flex',

                            alignItems:
                                'center',

                            gap:
                                '0.6rem',
                        }}
                    >

                        <input
                            type="checkbox"
                            id="featured"
                            checked={
                                formData.featured
                            }
                            onChange={(e) => {

                                if (
                                    e.target.checked
                                ) {

                                    const currentFeaturedCount =
                                        products.filter(
                                            (p) =>
                                                p.featured &&
                                                p.id !==
                                                    isEditing
                                        ).length;

                                    if (
                                        currentFeaturedCount >=
                                        4
                                    ) {

                                        toast.error(
                                            'Já excedeu o limite de 4 destaques da página inicial.'
                                        );

                                        return;
                                    }
                                }

                                setFormData({
                                    ...formData,
                                    featured:
                                        e.target.checked,
                                });
                            }}
                            style={{
                                width:
                                    '18px',

                                height:
                                    '18px',

                                cursor:
                                    'pointer',

                                accentColor:
                                    '#A35858',
                            }}
                        />

                        <label
                            htmlFor="featured"
                            style={{
                                fontSize:
                                    '0.92rem',

                                cursor:
                                    'pointer',

                                color:
                                    '#2D2323',

                                fontWeight:
                                    500,

                                userSelect:
                                    'none',
                            }}
                        >
                            Destaque na página inicial
                            (Máx. 4)
                        </label>

                    </div>

                    {/* BOTÕES */}

                    <div
                        style={{
                            display:
                                'flex',

                            gap:
                                '0.8rem',

                            marginTop:
                                '0.5rem',
                        }}
                    >

                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            {isEditing !== null
                                ? 'Salvar Alterações'
                                : 'Cadastrar Produto'}
                        </button>

                        {isEditing !== null && (

                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                className="btn-secondary"
                            >
                                Cancelar
                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* =====================================================
                PRODUTOS CADASTRADOS
            ===================================================== */}

            <div
                style={{
                    display:
                        'flex',

                    justifyContent:
                        'space-between',

                    alignItems:
                        'center',

                    marginBottom:
                        '1rem',
                }}
            >

                <h2
                    style={{
                        fontSize:
                            '1.3rem',

                        color:
                            '#2D2323',

                        fontWeight:
                            600,

                        margin:
                            0,
                    }}
                >
                    Produtos Cadastrados (
                    {filteredProducts.length} de{' '}
                    {products.length})
                </h2>

            </div>

            {/* FILTROS */}

            <div className="filter-bar">

                <div>

                    <label className="admin-label">
                        🔍 Buscar produto
                    </label>

                    <input
                        type="text"
                        placeholder="Digite o nome ou descrição..."
                        value={
                            searchTerm
                        }
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        className="admin-input"
                    />

                </div>

                <div>

                    <label className="admin-label">
                        📁 Categoria
                    </label>

                    <select
                        value={
                            selectedCategory
                        }
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value
                            )
                        }
                        className="admin-input"
                    >

                        <option value="Todas">
                            Todas as Categorias
                        </option>

                        {CATEGORIES.map(
                            (cat) => (

                                <option
                                    key={cat}
                                    value={cat}
                                >
                                    {cat}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>

            {/* LISTA */}

            <div
                style={{
                    display:
                        'grid',

                    gap:
                        '0.8rem',
                }}
            >

                {filteredProducts.length >
                0 ? (

                    filteredProducts.map(
                        (product) => {

                            const productImages =
                                product.images &&
                                product.images.length >
                                    0
                                    ? product.images
                                    : (
                                        product.image
                                            ? [
                                                product.image,
                                            ]
                                            : []
                                    );

                            const mainImage =
                                productImages[0] ||
                                '';

                            const isUrl =
                                mainImage.startsWith(
                                    'http'
                                ) ||
                                mainImage.startsWith(
                                    'data:'
                                );

                            return (

                                <div
                                    key={
                                        product.id
                                    }
                                    className="product-row"
                                >

                                    <Link
                                        to={`/produto/${product.id}`}
                                        style={{
                                            display:
                                                'flex',

                                            alignItems:
                                                'center',

                                            gap:
                                                '1rem',

                                            textDecoration:
                                                'none',

                                            color:
                                                'inherit',

                                            flex:
                                                1,
                                        }}
                                    >

                                        {isUrl ? (

                                            <img
                                                src={
                                                    mainImage
                                                }
                                                alt={
                                                    product.title
                                                }
                                                draggable={
                                                    false
                                                }
                                                style={{
                                                    width:
                                                        '58px',

                                                    height:
                                                        '58px',

                                                    objectFit:
                                                        'cover',

                                                    borderRadius:
                                                        '12px',

                                                    border:
                                                        '1px solid #F0E3E3',

                                                    userSelect:
                                                        'none',
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    width:
                                                        '58px',

                                                    height:
                                                        '58px',

                                                    display:
                                                        'flex',

                                                    alignItems:
                                                        'center',

                                                    justifyContent:
                                                        'center',

                                                    background:
                                                        '#FAF2F2',

                                                    borderRadius:
                                                        '12px',

                                                    fontSize:
                                                        '1.5rem',

                                                    border:
                                                        '1px solid #F0E3E3',
                                                }}
                                            >
                                                {
                                                    mainImage ||
                                                    '🖼️'
                                                }
                                            </div>

                                        )}

                                        <div>

                                            <strong
                                                style={{
                                                    display:
                                                        'block',

                                                    color:
                                                        '#2D2323',

                                                    fontSize:
                                                        '0.98rem',

                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                {
                                                    product.title
                                                }{' '}

                                                {product.featured &&
                                                    '⭐'}

                                            </strong>

                                            <span
                                                style={{
                                                    fontSize:
                                                        '0.85rem',

                                                    color:
                                                        '#625353',

                                                    fontWeight:
                                                        500,
                                                }}
                                            >

                                                {
                                                    product.category
                                                }{' '}

                                                •{' '}

                                                <span
                                                    style={{
                                                        color:
                                                            '#A35858',

                                                        fontWeight:
                                                            600,
                                                    }}
                                                >
                                                    {
                                                        product.price
                                                    }
                                                </span>{' '}

                                                {product.measurements &&
                                                    `• Medidas: ${product.measurements}`}

                                            </span>

                                        </div>

                                    </Link>

                                    <div
                                        className="product-actions"
                                        style={{
                                            display:
                                                'flex',

                                            gap:
                                                '0.6rem',
                                        }}
                                    >

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    product
                                                )
                                            }
                                            className="btn-action-edit"
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                setItemToDelete(
                                                    {
                                                        id:
                                                            product.id,

                                                        title:
                                                            product.title,
                                                    }
                                                )
                                            }
                                            className="btn-action-delete"
                                        >
                                            🗑️ Excluir
                                        </button>

                                    </div>

                                </div>

                            );
                        }
                    )

                ) : (

                    <div
                        style={{
                            textAlign:
                                'center',

                            padding:
                                '2.5rem 1rem',

                            background:
                                '#ffffff',

                            borderRadius:
                                '20px',

                            border:
                                '1px dashed #F0E3E3',

                            color:
                                '#625353',

                            fontWeight:
                                500,
                        }}
                    >
                        Nenhum produto encontrado
                        com os filtros aplicados.
                    </div>

                )}

            </div>

            {/* =====================================================
                MODAL DE EXCLUSÃO
            ===================================================== */}

            {itemToDelete !== null && (

                <div
                    style={{
                        position:
                            'fixed',

                        top:
                            0,

                        left:
                            0,

                        width:
                            '100vw',

                        height:
                            '100vh',

                        background:
                            'rgba(45, 35, 35, 0.45)',

                        backdropFilter:
                            'blur(4px)',

                        display:
                            'flex',

                        alignItems:
                            'center',

                        justifyContent:
                            'center',

                        zIndex:
                            1000,

                        padding:
                            '1rem',
                    }}
                >

                    <div
                        style={{
                            background:
                                '#ffffff',

                            padding:
                                '2rem',

                            borderRadius:
                                '24px',

                            border:
                                '1px solid #F0E3E3',

                            boxShadow:
                                '0 10px 30px rgba(0, 0, 0, 0.15)',

                            maxWidth:
                                '400px',

                            width:
                                '100%',

                            textAlign:
                                'center',
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    '2.5rem',

                                marginBottom:
                                    '0.5rem',
                            }}
                        >
                            ⚠️
                        </div>

                        <h3
                            style={{
                                fontSize:
                                    '1.25rem',

                                color:
                                    '#2D2323',

                                fontWeight:
                                    600,

                                marginBottom:
                                    '0.6rem',
                            }}
                        >
                            Excluir peça?
                        </h3>

                        <p
                            style={{
                                fontSize:
                                    '0.92rem',

                                color:
                                    '#625353',

                                lineHeight:
                                    '1.5',

                                marginBottom:
                                    '1.5rem',
                            }}
                        >
                            Tem certeza de que deseja
                            remover o produto{' '}

                            <strong
                                style={{
                                    color:
                                        '#2D2323',
                                }}
                            >
                                "{itemToDelete.title}"
                            </strong>

                            ? Esta ação não poderá ser
                            desfeita.
                        </p>

                        <div
                            style={{
                                display:
                                    'flex',

                                gap:
                                    '0.8rem',
                            }}
                        >

                            <button
                                onClick={() =>
                                    setItemToDelete(
                                        null
                                    )
                                }
                                className="btn-secondary"
                                style={{
                                    flex:
                                        1,

                                    padding:
                                        '0.75rem',
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={
                                    confirmDelete
                                }
                                className="btn-action-delete"
                                style={{
                                    flex:
                                        1,

                                    padding:
                                        '0.75rem',

                                    borderRadius:
                                        '14px',
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