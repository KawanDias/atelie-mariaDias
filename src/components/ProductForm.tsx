import React, { useState } from 'react';

// Se usar TypeScript, pode definir a interface das propriedades (props)
interface ProductFormProps {
  onAddProduct: (product: {
    title: string;
    description: string;
    price: number;
    category: string;
  }) => void;
}

function ProductForm({ onAddProduct }: ProductFormProps) {
  // 1. Estados para guardar os valores inseridos nos inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Enxoval de Bebê');

  // 2. Função executada ao clicar no botão de salvar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price) {
      alert('Por favor, preencha pelo menos o título e o preço.');
      return;
    }

    // Envia os dados para a função recebida do componente pai
    onAddProduct({
      title,
      description,
      price: Number(price.replace(',', '.')), // Converte para número caso venha com vírgula
      category,
    });

    // Limpa o formulário após salvar
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('Enxoval de Bebê');
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>Novo bordado</h3>
      
      <label>Título</label>
      <input 
        type="text"
        placeholder="Ex: Pano de Boca" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <label>Descrição</label>
      <textarea 
        placeholder="Detalhes da peça" 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <label>Preço</label>
      <input 
        type="text"
        placeholder="R$ 90,00" 
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      
      <label>Categoria</label>
      <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Enxoval de Bebê">Enxoval de Bebê</option>
        <option value="Batizado">Batizado</option>
        <option value="Toalhas Personalizadas">Toalhas Personalizadas</option>
        <option value="Acessórios & Maternidade">Acessórios & Maternidade</option>
        <option value="Decoração do Quartinho">Decoração do Quartinho</option>
      </select>
      
      <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
        Salvar
      </button>
    </form>
  );
}

export default ProductForm;