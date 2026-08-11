function ProductForm() {
    return (
        <div className="form-card">
            <h3>Novo bordado</h3>
            <label>Título</label>
            <input placeholder="Ex: Pano de Boca" />
            <label>Descrição</label>
            <textarea placeholder="Detalhes da peça" />
            <label>Preço</label>
            <input placeholder="R$ 90,00" />
            <label>Categoria</label>
            <select>
                <option>Enxoval de Bebê</option>
                <option>Batizado</option>
                <option>Toalhas Personalizadas</option>
                <option>Acessórios & Maternidade</option>
                <option>Decoração do Quartinho</option>
            </select>
            <button className="btn" style={{ marginTop: '1rem' }}>Salvar</button>
        </div>
    );
}

export default ProductForm;