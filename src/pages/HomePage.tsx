import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';

function HomePage() {
    const featuredProducts = mockProducts.filter((product) => product.featured);

    return (
        <section className="container">
            <div className="hero">
                <div className="hero-card">
                    <p style={{ color: 'var(--rose)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Para a chegada especial</p>
                    <h1>Enxoval de bebê bordado com carinho e exclusividade.</h1>
                    <p>Cada peça é confeccionada à mão com amor, trazendo personalidade e aconchego para o quartinho do seu filho. Lençóis, mantas, acessórios e decoração — tudo feito sob encomenda e pensado para durar.</p>
                    <div>
                        <Link className="btn" to="/catalogo">Ver enxoval</Link>
                        <Link className="btn secondary" to="/login">Minha conta</Link>
                    </div>
                </div>
                <div className="panel">
                    <h3>Por que escolher o Ateliê?</h3>
                    <ul>
                        <li>Bordados 100% feitos à mão com atenção artesanal</li>
                        <li>Enxoval personalizado com seu gosto e estilo</li>
                        <li>Matérias-primas de qualidade para a delicadeza do bebê</li>
                        <li>Atendimento próximo e prazos acolhedores</li>
                    </ul>
                </div>
            </div>

            <div className="section-title">
                <h2>Mais vendidos</h2>
                <Link to="/catalogo">Ver tudo</Link>
            </div>
            <div className="grid products-grid">
                {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="about">
                <div className="panel">
                    <h2>Quem somos</h2>
                    <p>O Ateliê Maria Dias dedica-se a criar enxovais de bebê únicos e especiais. Cada ponto é bordado à mão por quem entende que a chegada de um filho merece o melhor — peças de qualidade, beleza e durabilidade que virão a ser herança de memórias.</p>
                </div>
                <div className="panel">
                    <h3>Nossa especialidade</h3>
                    <p>Enxoval sob encomenda com personalização. Desde lençóis e mantas bordados até bastidores porta-maternidade e acessórios, cada item é pensado para trazer acolhimento e carinho ao primeiro espaço do seu bebê.</p>
                </div>
            </div>
        </section>
    );
}

export default HomePage;
