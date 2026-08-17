import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Product, ProductCategory } from '../types';
import { productService } from '../services/productService';

const CATEGORIES: ProductCategory[] = [
    'Enxoval de Bebê',
    'Batizado',
    'Toalhas Personalizadas',
    'Acessórios & Maternidade',
    'Decoração do Quartinho',
];

const INITIAL_FORM = {
    title: '',
    description: '',
    category: CATEGORIES[0],
    price: '',
    measurements: '',
    images: [] as string[],
    featured: false,
};

/*
=====================================================
CONFIGURAÇÃO DAS IMAGENS
=====================================================
*/

const MAX_IMAGES = 4;

// Tamanho máximo aproximado de cada imagem.
// Mantemos bem abaixo do limite do Firestore.
const MAX_IMAGE_BYTES = 120 * 1024;

// Dimensão máxima.
const MAX_WIDTH = 1000;

// Qualidade mínima permitida.
const MIN_QUALITY = 0.45;

const getProductImages = (product: Product): string[] => {
    if (product.images && product.images.length > 0) {
        return product.images;
    }

    if (product.image) {
        return [product.image];
    }

    return [];
};

const isImageUrl = (value: string) =>
    value.startsWith('http') ||
    value.startsWith('https') ||
    value.startsWith('data:');

/*
=====================================================
ESTIMAR TAMANHO DO BASE64
=====================================================
*/

const getBase64Size = (dataUrl: string): number => {
    const base64 = dataUrl.split(',')[1] || '';

    return Math.floor(
        (base64.length * 3) / 4
    );
};

/*
=====================================================
COMPRIMIR CANVAS
=====================================================
*/

const canvasToCompressedDataUrl = (
    canvas: HTMLCanvasElement,
    initialQuality = 0.75
): Promise<string> => {
    return new Promise(resolve => {
        let quality = initialQuality;
        let result = canvas.toDataURL(
            'image/jpeg',
            quality
        );

        /*
        Tenta reduzir progressivamente a qualidade
        até atingir o tamanho desejado.
        */

        while (
            getBase64Size(result) > MAX_IMAGE_BYTES &&
            quality > MIN_QUALITY
        ) {
            quality -= 0.05;

            result = canvas.toDataURL(
                'image/jpeg',
                quality
            );
        }

        resolve(result);
    });
};

/*
=====================================================
PROCESSAR ARQUIVO DE IMAGEM
=====================================================
*/

const processImageFile = (
    file: File
): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reject(
                new Error(
                    'Erro ao ler o arquivo de imagem.'
                )
            );
        };

        reader.onload = () => {
            const img = new Image();

            img.onerror = () => {
                reject(
                    new Error(
                        'Erro ao carregar a imagem.'
                    )
                );
            };

            img.onload = async () => {
                try {
                    let width =
                        img.naturalWidth;

                    let height =
                        img.naturalHeight;

                    /*
                    Redimensiona inicialmente
                    */

                    if (width > MAX_WIDTH) {
                        height = Math.round(
                            (height *
                                MAX_WIDTH) /
                                width
                        );

                        width = MAX_WIDTH;
                    }

                    /*
                    Canvas
                    */

                    const canvas =
                        document.createElement(
                            'canvas'
                        );

                    canvas.width = width;
                    canvas.height = height;

                    const ctx =
                        canvas.getContext(
                            '2d'
                        );

                    if (!ctx) {
                        reject(
                            new Error(
                                'Não foi possível criar o Canvas.'
                            )
                        );

                        return;
                    }

                    /*
                    Fundo branco.
                    Isso evita problemas com imagens
                    transparentes convertidas para JPEG.
                    */

                    ctx.fillStyle =
                        '#ffffff';

                    ctx.fillRect(
                        0,
                        0,
                        width,
                        height
                    );

                    /*
                    Desenha imagem
                    */

                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );

                    /*
                    =============================================
                    MARCA D'ÁGUA
                    =============================================
                    */

                    const fontSize =
                        Math.max(
                            18,
                            Math.round(
                                width *
                                    0.028
                            )
                        );

                    const diagonal =
                        Math.sqrt(
                            width ** 2 +
                                height ** 2
                        );

                    ctx.save();

                    ctx.globalAlpha = 0.055;

                    ctx.font = `700 ${fontSize}px Arial, sans-serif`;

                    ctx.fillStyle =
                        '#ffffff';

                    ctx.textAlign =
                        'center';

                    ctx.textBaseline =
                        'middle';

                    ctx.shadowColor =
                        'rgba(0,0,0,.25)';

                    ctx.shadowBlur = 2;

                    ctx.translate(
                        width / 2,
                        height / 2
                    );

                    ctx.rotate(
                        -Math.PI / 6
                    );

                    for (
                        let y = -diagonal;
                        y <= diagonal;
                        y +=
                            fontSize * 4
                    ) {
                        for (
                            let x = -diagonal;
                            x <= diagonal;
                            x +=
                                fontSize * 8
                        ) {
                            ctx.fillText(
                                'ateliemariadias',
                                x,
                                y
                            );
                        }
                    }

                    ctx.restore();

                    /*
                    =============================================
                    COMPRESSÃO
                    =============================================
                    */

                    let compressed =
                        await canvasToCompressedDataUrl(
                            canvas,
                            0.75
                        );

                    /*
                    Se mesmo com qualidade mínima
                    ainda estiver grande, reduz
                    fisicamente a resolução.
                    */

                    let attempts = 0;

                    while (
                        getBase64Size(
                            compressed
                        ) >
                            MAX_IMAGE_BYTES &&
                        attempts < 3
                    ) {
                        attempts++;

                        width = Math.round(
                            width * 0.8
                        );

                        height = Math.round(
                            height * 0.8
                        );

                        canvas.width =
                            width;

                        canvas.height =
                            height;

                        ctx.clearRect(
                            0,
                            0,
                            width,
                            height
                        );

                        ctx.fillStyle =
                            '#ffffff';

                        ctx.fillRect(
                            0,
                            0,
                            width,
                            height
                        );

                        ctx.drawImage(
                            img,
                            0,
                            0,
                            width,
                            height
                        );

                        /*
                        Reaplica marca d'água
                        */

                        const newFontSize =
                            Math.max(
                                16,
                                Math.round(
                                    width *
                                        0.028
                                )
                            );

                        const newDiagonal =
                            Math.sqrt(
                                width ** 2 +
                                    height ** 2
                            );

                        ctx.save();

                        ctx.globalAlpha =
                            0.055;

                        ctx.font = `700 ${newFontSize}px Arial, sans-serif`;

                        ctx.fillStyle =
                            '#ffffff';

                        ctx.textAlign =
                            'center';

                        ctx.textBaseline =
                            'middle';

                        ctx.shadowColor =
                            'rgba(0,0,0,.25)';

                        ctx.shadowBlur = 2;

                        ctx.translate(
                            width / 2,
                            height / 2
                        );

                        ctx.rotate(
                            -Math.PI / 6
                        );

                        for (
                            let y =
                                -newDiagonal;
                            y <=
                            newDiagonal;
                            y +=
                                newFontSize *
                                4
                        ) {
                            for (
                                let x =
                                    -newDiagonal;
                                x <=
                                newDiagonal;
                                x +=
                                    newFontSize *
                                    8
                            ) {
                                ctx.fillText(
                                    'ateliemariadias',
                                    x,
                                    y
                                );
                            }
                        }

                        ctx.restore();

                        compressed =
                            await canvasToCompressedDataUrl(
                                canvas,
                                0.65
                            );
                    }

                    /*
                    Segurança final
                    */

                    if (
                        getBase64Size(
                            compressed
                        ) >
                        MAX_IMAGE_BYTES
                    ) {
                        reject(
                            new Error(
                                'Não foi possível comprimir a imagem o suficiente.'
                            )
                        );

                        return;
                    }

                    console.log(
                        'Imagem processada:',
                        Math.round(
                            getBase64Size(
                                compressed
                            ) / 1024
                        ),
                        'KB'
                    );

                    resolve(compressed);
                } catch (error) {
                    reject(error);
                }
            };

            img.src =
                reader.result as string;
        };

        reader.readAsDataURL(file);
    });

/*
=====================================================
RECOMPRIMIR DATA URL EXISTENTE
=====================================================
*/

const compressExistingDataUrl = (
    dataUrl: string
): Promise<string> =>
    new Promise((resolve, reject) => {
        if (
            !dataUrl.startsWith(
                'data:image'
            )
        ) {
            resolve(dataUrl);
            return;
        }

        /*
        Se já estiver pequeno, não precisa
        processar novamente.
        */

        if (
            getBase64Size(dataUrl) <=
            MAX_IMAGE_BYTES
        ) {
            resolve(dataUrl);
            return;
        }

        const img = new Image();

        img.onerror = () =>
            reject(
                new Error(
                    'Erro ao carregar imagem existente.'
                )
            );

        img.onload = async () => {
            try {
                let width =
                    img.naturalWidth;

                let height =
                    img.naturalHeight;

                if (
                    width > MAX_WIDTH
                ) {
                    height =
                        Math.round(
                            (height *
                                MAX_WIDTH) /
                                width
                        );

                    width =
                        MAX_WIDTH;
                }

                const canvas =
                    document.createElement(
                        'canvas'
                    );

                canvas.width =
                    width;

                canvas.height =
                    height;

                const ctx =
                    canvas.getContext(
                        '2d'
                    );

                if (!ctx) {
                    reject(
                        new Error(
                            'Canvas indisponível.'
                        )
                    );

                    return;
                }

                ctx.fillStyle =
                    '#ffffff';

                ctx.fillRect(
                    0,
                    0,
                    width,
                    height
                );

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                let compressed =
                    await canvasToCompressedDataUrl(
                        canvas,
                        0.7
                    );

                let attempts = 0;

                while (
                    getBase64Size(
                        compressed
                    ) >
                        MAX_IMAGE_BYTES &&
                    attempts < 3
                ) {
                    attempts++;

                    width = Math.round(
                        width * 0.8
                    );

                    height = Math.round(
                        height * 0.8
                    );

                    canvas.width =
                        width;

                    canvas.height =
                        height;

                    ctx.clearRect(
                        0,
                        0,
                        width,
                        height
                    );

                    ctx.fillStyle =
                        '#ffffff';

                    ctx.fillRect(
                        0,
                        0,
                        width,
                        height
                    );

                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );

                    compressed =
                        await canvasToCompressedDataUrl(
                            canvas,
                            0.6
                        );
                }

                if (
                    getBase64Size(
                        compressed
                    ) >
                    MAX_IMAGE_BYTES
                ) {
                    reject(
                        new Error(
                            'Imagem existente ainda está muito grande.'
                        )
                    );

                    return;
                }

                resolve(compressed);
            } catch (error) {
                reject(error);
            }
        };

        img.src = dataUrl;
    });

/*
=====================================================
ADMIN PAGE
=====================================================
*/

function AdminPage() {
    const [products, setProducts] =
        useState<Product[]>([]);

    const [isEditing, setIsEditing] =
        useState<Product['id'] | null>(
            null
        );

    const [itemToDelete, setItemToDelete] =
        useState<{
            id: Product['id'];
            title: string;
        } | null>(null);

    const [searchTerm, setSearchTerm] =
        useState('');

    const [selectedCategory, setSelectedCategory] =
        useState('Todas');

    const [formData, setFormData] =
        useState(INITIAL_FORM);

    const [isSaving, setIsSaving] =
        useState(false);

    /*
    =============================================
    FORM
    =============================================
    */

    const updateForm = <
        K extends keyof typeof INITIAL_FORM
    >(
        field: K,
        value: (typeof INITIAL_FORM)[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    /*
    =============================================
    CARREGAR PRODUTOS
    =============================================
    */

    const refreshProducts = async () => {
        try {
            const data =
                await productService.getProducts();

            setProducts(data);
        } catch (error) {
            console.error(
                'Erro ao atualizar produtos:',
                error
            );

            toast.error(
                'Erro ao carregar produtos.'
            );
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    /*
    =============================================
    UPLOAD
    =============================================
    */

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(
            e.target.files || []
        );

        if (!files.length) {
            return;
        }

        if (
            formData.images.length +
                files.length >
            MAX_IMAGES
        ) {
            toast.error(
                'Você só pode adicionar no máximo 4 fotos por produto.'
            );

            e.target.value = '';

            return;
        }

        try {
            toast.loading(
                'Comprimindo imagem...',
                {
                    id: 'image-processing',
                }
            );

            const images =
                await Promise.all(
                    files.map(
                        processImageFile
                    )
                );

            setFormData(prev => ({
                ...prev,

                images: [
                    ...prev.images,
                    ...images,
                ].slice(
                    0,
                    MAX_IMAGES
                ),
            }));

            toast.success(
                "Imagem comprimida e protegida com marca d'água!",
                {
                    id: 'image-processing',
                }
            );
        } catch (error) {
            console.error(
                'Erro ao processar imagem:',
                error
            );

            toast.error(
                'Não foi possível processar a imagem.',
                {
                    id: 'image-processing',
                }
            );
        } finally {
            e.target.value = '';
        }
    };

    /*
    =============================================
    REMOVER IMAGEM
    =============================================
    */

    const removeImage = (
        index: number
    ) => {
        setFormData(prev => ({
            ...prev,

            images:
                prev.images.filter(
                    (_, i) =>
                        i !== index
                ),
        }));
    };

    /*
    =============================================
    EDITAR
    =============================================
    */

    const handleEdit = (
        product: Product
    ) => {
        setIsEditing(
            product.id
        );

        setFormData({
            title:
                product.title || '',

            description:
                product.description ||
                '',

            category:
                product.category ||
                CATEGORIES[0],

            price:
                product.price || '',

            measurements:
                product.measurements ||
                '',

            images:
                getProductImages(
                    product
                ),

            featured:
                product.featured ||
                false,
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    /*
    =============================================
    CANCELAR
    =============================================
    */

    const handleCancel = () => {
        setIsEditing(null);

        setFormData({
            ...INITIAL_FORM,
            images: [],
        });
    };

    /*
    =============================================
    EXCLUIR
    =============================================
    */

    const confirmDelete = async () => {
        if (!itemToDelete) {
            return;
        }

        try {
            await productService.deleteProduct(
                itemToDelete.id
            );

            await refreshProducts();

            setItemToDelete(null);

            toast.success(
                'Produto removido com sucesso!'
            );
        } catch (error) {
            console.error(
                'Erro ao excluir:',
                error
            );

            toast.error(
                'Erro ao remover produto.'
            );
        }
    };

    /*
    =============================================
    SALVAR
    =============================================
    */

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (isSaving) {
            return;
        }

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.price.trim()
        ) {
            toast.error(
                'Preencha todos os campos obrigatórios.'
            );

            return;
        }

        if (
            !formData.images.length
        ) {
            toast.error(
                'Por favor, adicione pelo menos 1 foto para o produto.'
            );

            return;
        }

        setIsSaving(true);

        try {
            /*
            =============================================
            GARANTIR QUE TODAS AS IMAGENS BASE64
            ESTEJAM COMPRIMIDAS
            =============================================
            */

            const finalImages =
                await Promise.all(
                    formData.images.map(
                        async image => {
                            if (
                                image.startsWith(
                                    'data:image'
                                )
                            ) {
                                return compressExistingDataUrl(
                                    image
                                );
                            }

                            return image;
                        }
                    )
                );

            /*
            =============================================
            SEGURANÇA EXTRA
            =============================================
            */

            const totalBase64Bytes =
                finalImages.reduce(
                    (total, image) => {
                        if (
                            image.startsWith(
                                'data:image'
                            )
                        ) {
                            return (
                                total +
                                getBase64Size(
                                    image
                                )
                            );
                        }

                        return total;
                    },
                    0
                );

            console.log(
                'Tamanho total das imagens:',
                Math.round(
                    totalBase64Bytes /
                        1024
                ),
                'KB'
            );

            /*
            4 imagens de aproximadamente
            120 KB = ~480 KB binários.
            Mesmo em Base64 fica confortavelmente
            abaixo do limite do Firestore.
            */

            if (
                totalBase64Bytes >
                650 * 1024
            ) {
                throw new Error(
                    'As imagens ainda estão muito grandes. Remova uma imagem e tente novamente.'
                );
            }

            const productData = {
                title:
                    formData.title.trim(),

                description:
                    formData.description.trim(),

                category:
                    formData.category,

                price:
                    formData.price.trim(),

                measurements:
                    formData.measurements.trim(),

                images:
                    finalImages,

                image:
                    finalImages[0],

                featured:
                    formData.featured,
            };

            /*
            =============================================
            EDITAR
            =============================================
            */

            if (
                isEditing !== null
            ) {
                await productService.updateProduct(
                    isEditing,
                    productData
                );

                toast.success(
                    'Produto atualizado com sucesso!'
                );
            }

            /*
            =============================================
            NOVO
            =============================================
            */

            else {
                await productService.addProduct(
                    productData
                );

                toast.success(
                    'Produto cadastrado com sucesso!'
                );
            }

            /*
            =============================================
            ATUALIZAR LISTA
            =============================================
            */

            await refreshProducts();

            handleCancel();
        } catch (error) {
            console.error(
                'ERRO COMPLETO AO SALVAR PRODUTO:',
                error
            );

            let message =
                isEditing !== null
                    ? 'Erro ao atualizar produto.'
                    : 'Erro ao cadastrar produto.';

            if (
                error instanceof Error
            ) {
                console.error(
                    'Mensagem:',
                    error.message
                );

                /*
                Mensagens específicas
                */

                if (
                    error.message.includes(
                        'too large'
                    ) ||
                    error.message.includes(
                        'large'
                    )
                ) {
                    message =
                        'As imagens ficaram grandes demais. Tente usar menos fotos.';
                }

                if (
                    error.message.includes(
                        'permission-denied'
                    )
                ) {
                    message =
                        'O Firebase recusou a operação por permissão.';
                }
            }

            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    /*
    =============================================
    FILTROS
    =============================================
    */

    const filteredProducts =
        products.filter(
            product => {
                const search =
                    searchTerm.toLowerCase();

                const title =
                    product.title?.toLowerCase() ||
                    '';

                const description =
                    product.description?.toLowerCase() ||
                    '';

                const matchesSearch =
                    title.includes(
                        search
                    ) ||
                    description.includes(
                        search
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

    /*
    =============================================
    DESTAQUES
    =============================================
    */

    const toggleFeatured = (
        checked: boolean
    ) => {
        if (checked) {
            const count =
                products.filter(
                    p =>
                        p.featured &&
                        p.id !==
                            isEditing
                ).length;

            if (count >= 4) {
                toast.error(
                    'Já existem 4 produtos em destaque na página inicial.'
                );

                return;
            }
        }

        updateForm(
            'featured',
            checked
        );
    };

    /*
    =============================================
    JSX
    =============================================
    */

    return (
        <div className="admin-page">

            <style>{`

                .admin-page {
                    padding: 3rem 1.25rem 4rem;
                    max-width: 880px;
                    margin: auto;
                }

                .admin-page-title {
                    text-align: center;
                    color: #2D2323;
                    margin-bottom: 2rem;
                    font-weight: 700;
                    font-size: 1.8rem;
                }

                .admin-card {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 24px;
                    border: 1px solid #F0E3E3;
                    box-shadow:
                        0 8px 30px rgba(163,88,88,.05);
                    margin-bottom: 2rem;
                }

                .admin-card-title {
                    font-size: 1.35rem;
                    margin: 0 0 1.5rem;
                    color: #2D2323;
                    font-weight: 600;
                }

                .admin-label {
                    display: block;
                    font-size: .88rem;
                    font-weight: 600;
                    margin-bottom: .4rem;
                    color: #2D2323;
                }

                .admin-input {
                    width: 100%;
                    padding: .8rem 1rem;
                    border-radius: 12px;
                    border: 1px solid #F0E3E3;
                    background: #FAF2F2;
                    outline: none;
                    font-size: .95rem;
                    color: #2D2323;
                    box-sizing: border-box;
                    transition: .2s;
                }

                .admin-input:focus {
                    border-color: #A35858;
                    background: #fff;
                }

                .form-grid-two,
                .filter-bar {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.2rem;
                }

                .filter-bar {
                    grid-template-columns: 1.5fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    background: #fff;
                    padding: 1.2rem;
                    border-radius: 20px;
                    border: 1px solid #F0E3E3;
                    box-shadow:
                        0 4px 15px rgba(163,88,88,.04);
                }

                .product-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #fff;
                    padding: 1rem 1.25rem;
                    border-radius: 18px;
                    border: 1px solid #F0E3E3;
                    box-shadow:
                        0 2px 10px rgba(163,88,88,.03);
                    transition: .2s;
                }

                .product-row:hover {
                    box-shadow:
                        0 4px 16px rgba(163,88,88,.08);
                }

                .product-actions {
                    display: flex;
                    gap: .6rem;
                }

                .btn-primary,
                .btn-secondary,
                .btn-action-edit,
                .btn-action-delete {
                    border-radius: 14px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: .2s;
                }

                .btn-primary {
                    background: #A35858;
                    color: #fff;
                    border: 0;
                    padding: .85rem 1.8rem;
                    font-size: .95rem;
                    box-shadow:
                        0 4px 14px rgba(163,88,88,.2);
                }

                .btn-primary:hover {
                    background: #8e4b4b;
                    transform: translateY(-1px);
                }

                .btn-primary:disabled {
                    opacity: .65;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-secondary {
                    background: #FAF2F2;
                    color: #625353;
                    border: 1px solid #F0E3E3;
                    padding: .85rem 1.8rem;
                    font-size: .95rem;
                }

                .btn-secondary:hover,
                .btn-action-edit:hover {
                    background: #F0E3E3;
                }

                .btn-action-edit,
                .btn-action-delete {
                    padding: .55rem 1rem;
                    font-size: .85rem;
                }

                .btn-action-edit {
                    background: #FAF2F2;
                    border: 1px solid #F0E3E3;
                    color: #A35858;
                }

                .btn-action-delete {
                    background: #FDF2F2;
                    color: #C0392B;
                    border: 1px solid #F5C6C6;
                }

                .btn-action-delete:hover {
                    background: #FADBD8;
                }

                .remove-img-btn {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: #C0392B;
                    color: #fff;
                    border: 0;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    font-size: 11px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow:
                        0 2px 5px rgba(0,0,0,.2);
                }

                .image-preview {
                    position: relative;
                    width: 75px;
                    height: 75px;
                }

                .image-preview img,
                .product-thumb {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 1px solid #F0E3E3;
                    user-select: none;
                }

                .image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #FAF2F2;
                    border-radius: 12px;
                    font-size: 1.5rem;
                }

                .info-box {
                    margin-top: .7rem;
                    padding: .8rem 1rem;
                    background: #FAF2F2;
                    border: 1px solid #F0E3E3;
                    border-radius: 10px;
                    font-size: .82rem;
                    color: #625353;
                }

                .admin-order {
                    display: inline-flex;
                    align-items: center;
                    gap: .5rem;
                    background: #A35858;
                    color: #fff;
                    padding: .8rem 1.4rem;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    box-shadow:
                        0 4px 12px rgba(163,88,88,.2);
                }

                .admin-order-container {
                    margin: 1.5rem 0 1rem 15.2rem;
                }

                .product-info strong {
                    display: block;
                    color: #2D2323;
                    font-size: .98rem;
                    font-weight: 600;
                }

                .product-info span {
                    font-size: .85rem;
                    color: #625353;
                    font-weight: 500;
                }

                .product-price {
                    color: #A35858;
                    font-weight: 600;
                }

                .empty-products {
                    text-align: center;
                    padding: 2.5rem 1rem;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px dashed #F0E3E3;
                    color: #625353;
                    font-weight: 500;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(45,35,35,.45);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                    box-sizing: border-box;
                }

                .modal {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 24px;
                    border: 1px solid #F0E3E3;
                    box-shadow:
                        0 10px 30px rgba(0,0,0,.15);
                    max-width: 400px;
                    width: 100%;
                    text-align: center;
                }

                .modal-actions {
                    display: flex;
                    gap: .8rem;
                }

                .modal-actions > * {
                    flex: 1;
                    padding: .75rem;
                }

                @media(max-width: 640px) {

                    .admin-page {
                        padding: 2rem .8rem 3rem;
                    }

                    .admin-card {
                        padding: 1.5rem 1.25rem;
                    }

                    .form-grid-two,
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

                    .admin-order-container {
                        margin: 1rem 0;
                    }

                    .admin-order {
                        display: flex;
                        width: 100%;
                        justify-content: center;
                        box-sizing: border-box;
                        text-align: center;
                    }

                    .btn-primary,
                    .btn-secondary {
                        flex: 1;
                    }
                }

            `}</style>

            <h1 className="admin-page-title">
                Painel do Administrador
            </h1>

            <div className="admin-order-container">
                <Link
                    to="/admin/gerador-pedidos"
                    className="admin-order"
                >
                    🖼️ Gerar Comprovante de Pedido
                    (Imagem)
                </Link>
            </div>

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

                    <div>
                        <label className="admin-label">
                            Título do Produto *
                        </label>

                        <input
                            required
                            type="text"
                            value={
                                formData.title
                            }
                            onChange={e =>
                                updateForm(
                                    'title',
                                    e.target.value
                                )
                            }
                            className="admin-input"
                            placeholder="Ex: Manta Piquet Bordada"
                        />
                    </div>

                    <div className="form-grid-two">

                        <div>
                            <label className="admin-label">
                                Categoria *
                            </label>

                            <select
                                value={
                                    formData.category
                                }
                                onChange={e =>
                                    updateForm(
                                        'category',
                                        e.target
                                            .value as ProductCategory
                                    )
                                }
                                className="admin-input"
                            >
                                {CATEGORIES.map(
                                    category => (
                                        <option
                                            key={
                                                category
                                            }
                                            value={
                                                category
                                            }
                                        >
                                            {
                                                category
                                            }
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
                                required
                                type="text"
                                value={
                                    formData.price
                                }
                                onChange={e =>
                                    updateForm(
                                        'price',
                                        e.target.value
                                    )
                                }
                                className="admin-input"
                                placeholder="R$ 0,00"
                            />
                        </div>

                    </div>

                    <div>

                        <label className="admin-label">
                            Medidas / Tamanho da Peça
                        </label>

                        <input
                            type="text"
                            value={
                                formData.measurements
                            }
                            onChange={e =>
                                updateForm(
                                    'measurements',
                                    e.target.value
                                )
                            }
                            className="admin-input"
                            placeholder="Ex: 70cm x 140cm, Berço Americano, Tamanho Único..."
                        />

                    </div>

                    <div>

                        <label className="admin-label">
                            Fotos do Produto
                            (Até 4 fotos) *
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={
                                handleImageUpload
                            }
                            disabled={
                                isSaving
                            }
                            style={{
                                marginBottom:
                                    '.8rem',
                                fontSize:
                                    '.9rem',
                                color:
                                    '#625353',
                                maxWidth:
                                    '100%',
                            }}
                        />

                        <div
                            style={{
                                display:
                                    'flex',
                                gap: '.75rem',
                                flexWrap:
                                    'wrap',
                            }}
                        >
                            {formData.images.map(
                                (
                                    image,
                                    index
                                ) => (
                                    <div
                                        className="image-preview"
                                        key={`${image}-${index}`}
                                    >

                                        {isImageUrl(
                                            image
                                        ) ? (
                                            <img
                                                src={
                                                    image
                                                }
                                                alt="Preview"
                                                draggable={
                                                    false
                                                }
                                            />
                                        ) : (
                                            <div className="image-placeholder">
                                                {
                                                    image
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
                                            title="Remover imagem"
                                        >
                                            ✕
                                        </button>

                                    </div>
                                )
                            )}
                        </div>

                        <div className="info-box">
                            🔒{' '}
                            <strong>
                                Proteção ativada:
                            </strong>{' '}
                            as imagens recebem
                            marca d'água e são
                            automaticamente
                            comprimidas para
                            funcionar também
                            em celulares.
                        </div>

                    </div>

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
                            onChange={e =>
                                updateForm(
                                    'description',
                                    e.target.value
                                )
                            }
                            className="admin-input"
                            style={{
                                resize:
                                    'vertical',
                            }}
                            placeholder="Descreva detalhes como tipo de tecido, acabamento, etc."
                        />

                    </div>

                    <div
                        style={{
                            display:
                                'flex',
                            alignItems:
                                'center',
                            gap: '.6rem',
                        }}
                    >

                        <input
                            type="checkbox"
                            id="featured"
                            checked={
                                formData.featured
                            }
                            onChange={e =>
                                toggleFeatured(
                                    e.target
                                        .checked
                                )
                            }
                            style={{
                                width: 18,
                                height: 18,
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
                                    '.92rem',
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
                            Destaque na
                            página inicial
                            (Máx. 4)
                        </label>

                    </div>

                    <div
                        style={{
                            display:
                                'flex',
                            gap: '.8rem',
                            marginTop:
                                '.5rem',
                        }}
                    >

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={
                                isSaving
                            }
                        >
                            {isSaving
                                ? 'Salvando...'
                                : isEditing !==
                                  null
                                ? 'Salvar Alterações'
                                : 'Cadastrar Produto'}
                        </button>

                        {isEditing !==
                            null && (
                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                className="btn-secondary"
                                disabled={
                                    isSaving
                                }
                            >
                                Cancelar
                            </button>
                        )}

                    </div>

                </form>

            </div>

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
                        margin: 0,
                    }}
                >
                    Produtos Cadastrados (
                    {
                        filteredProducts.length
                    }{' '}
                    de{' '}
                    {products.length})
                </h2>

            </div>

            <div className="filter-bar">

                <div>

                    <label className="admin-label">
                        🔍 Buscar produto
                    </label>

                    <input
                        type="text"
                        value={
                            searchTerm
                        }
                        onChange={e =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        className="admin-input"
                        placeholder="Digite o nome ou descrição..."
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
                        onChange={e =>
                            setSelectedCategory(
                                e.target
                                    .value
                            )
                        }
                        className="admin-input"
                    >

                        <option value="Todas">
                            Todas as Categorias
                        </option>

                        {CATEGORIES.map(
                            category => (
                                <option
                                    key={
                                        category
                                    }
                                    value={
                                        category
                                    }
                                >
                                    {
                                        category
                                    }
                                </option>
                            )
                        )}

                    </select>

                </div>

            </div>

            <div
                style={{
                    display:
                        'grid',
                    gap: '.8rem',
                }}
            >

                {filteredProducts.length >
                0 ? (

                    filteredProducts.map(
                        product => {

                            const mainImage =
                                getProductImages(
                                    product
                                )[0] ||
                                '';

                            return (
                                <div
                                    key={String(
                                        product.id
                                    )}
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
                                            flex: 1,
                                            minWidth:
                                                0,
                                        }}
                                    >

                                        {isImageUrl(
                                            mainImage
                                        ) ? (

                                            <img
                                                src={
                                                    mainImage
                                                }
                                                alt={
                                                    product.title
                                                }
                                                className="product-thumb"
                                                style={{
                                                    width: 58,
                                                    height: 58,
                                                    flexShrink: 0,
                                                }}
                                                draggable={
                                                    false
                                                }
                                            />

                                        ) : (

                                            <div
                                                className="image-placeholder"
                                                style={{
                                                    width: 58,
                                                    height: 58,
                                                    flexShrink: 0,
                                                    border:
                                                        '1px solid #F0E3E3',
                                                }}
                                            >
                                                {mainImage ||
                                                    '🖼️'}
                                            </div>

                                        )}

                                        <div
                                            className="product-info"
                                            style={{
                                                minWidth:
                                                    0,
                                            }}
                                        >

                                            <strong>
                                                {
                                                    product.title
                                                }{' '}
                                                {product.featured &&
                                                    '⭐'}
                                            </strong>

                                            <span>
                                                {
                                                    product.category
                                                }{' '}
                                                •{' '}
                                                <span className="product-price">
                                                    {
                                                        product.price
                                                    }
                                                </span>{' '}
                                                {product.measurements &&
                                                    `• Medidas: ${product.measurements}`}
                                            </span>

                                        </div>

                                    </Link>

                                    <div className="product-actions">

                                        <button
                                            type="button"
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
                                            type="button"
                                            onClick={() =>
                                                setItemToDelete(
                                                    {
                                                        id: product.id,
                                                        title: product.title,
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

                    <div className="empty-products">
                        Nenhum produto
                        encontrado com
                        os filtros
                        aplicados.
                    </div>

                )}

            </div>

            {itemToDelete && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div
                            style={{
                                fontSize:
                                    '2.5rem',
                                marginBottom:
                                    '.5rem',
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
                                    '.6rem',
                            }}
                        >
                            Excluir peça?
                        </h3>

                        <p
                            style={{
                                fontSize:
                                    '.92rem',
                                color:
                                    '#625353',
                                lineHeight:
                                    1.5,
                                marginBottom:
                                    '1.5rem',
                            }}
                        >
                            Tem certeza de
                            que deseja
                            remover o
                            produto{' '}

                            <strong
                                style={{
                                    color:
                                        '#2D2323',
                                }}
                            >
                                "
                                {
                                    itemToDelete.title
                                }
                                "
                            </strong>

                            ? Esta ação
                            não poderá
                            ser desfeita.
                        </p>

                        <div className="modal-actions">

                            <button
                                type="button"
                                onClick={() =>
                                    setItemToDelete(
                                        null
                                    )
                                }
                                className="btn-secondary"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDelete
                                }
                                className="btn-action-delete"
                                style={{
                                    borderRadius:
                                        14,
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