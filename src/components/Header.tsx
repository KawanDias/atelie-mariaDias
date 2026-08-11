import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

// @ts-ignore
import logoImg from '../assets/logo.png';

function Header() {
    const { user, logout } = useAuth();
    const { favorites } = useFavorites();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Redireciona para o catálogo levando o termo de busca na URL
        if (searchTerm.trim()) {
            navigate(`/catalogo?busca=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="topbar" style={{ background: '#fff', borderBottom: '1px solid #f2e6e6' }}>
            <div className="promo-bar" style={{ fontSize: '0.8rem', padding: '0.3rem 0', background: '#fcf8f8', color: '#8c7373', textAlign: 'center' }}>
                Bordados Afetuosos & Enxoval de Bebê Personalizado • Envio para todo o Brasil
            </div>
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img 
                        src={logoImg} 
                        alt="Ateliê Maria Dias" 
                        style={{ height: '100px', width: '100px', objectFit: 'contain' }} 
                    />
                </Link>

                {/* Barra de Pesquisa Funcional */}
                <form 
                    onSubmit={handleSearch}
                    style={{ 
                        flex: 1, 
                        maxWidth: '380px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: '#fdfbfb', 
                        border: '1px solid #ebdada', 
                        borderRadius: '25px', 
                        padding: '0.35rem 0.9rem',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                    }}
                >
                    <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', marginRight: '0.5rem', opacity: 0.6 }}>
                        🔎
                    </button>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar enxoval de bebê..." 
                        style={{ 
                            border: 'none', 
                            background: 'transparent', 
                            outline: 'none', 
                            width: '100%', 
                            fontSize: '0.85rem', 
                            color: '#5e4e4e' 
                        }} 
                    />
                </form>

                {/* Ações do usuário */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    {user ? (
                        <>
                            <span style={{ fontSize: '0.85rem', color: '#b58b8b', fontWeight: 600 }}>
                                👤 {user.name}
                            </span>

                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    style={{ 
                                        background: '#f2e6e6', 
                                        color: '#8c7373', 
                                        padding: '0.3rem 0.6rem', 
                                        borderRadius: '6px', 
                                        fontWeight: 500,
                                        fontSize: '0.8rem',
                                        textDecoration: 'none'
                                    }}
                                >
                                    ⚙️ Admin
                                </Link>
                            )}

                            <button 
                                onClick={logout} 
                                style={{ 
                                    background: 'transparent', 
                                    border: '1px solid #e8dada',
                                    padding: '0.3rem 0.6rem', 
                                    borderRadius: '6px', 
                                    color: '#8c7373', 
                                    fontSize: '0.8rem',
                                    cursor: 'pointer' 
                                }}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={{ background: '#b58b8b', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
                            Entrar
                        </Link>
                    )}

                    <Link to="/favoritos" style={{ position: 'relative', padding: '0.3rem 0.5rem', textDecoration: 'none', fontSize: '1.1rem' }}>
                        ❤️
                        {favorites.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                background: '#d98282',
                                color: 'white',
                                borderRadius: '50%',
                                width: '1rem',
                                height: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                            }}>
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Barra inferior de categorias */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 0.75rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/catalogo" style={{ color: '#b58b8b', fontWeight: 600, textDecoration: 'none' }}>✨ Todos</Link>
                    <Link to="/catalogo" style={{ color: '#7a6666', textDecoration: 'none' }}>Enxoval de Bebê</Link>
                    <Link to="/catalogo" style={{ color: '#7a6666', textDecoration: 'none' }}>Batizado</Link>
                    <Link to="/catalogo" style={{ color: '#7a6666', textDecoration: 'none' }}>Toalhas Personalizadas</Link>
                    <Link to="/catalogo" style={{ color: '#7a6666', textDecoration: 'none' }}>Acessórios & Maternidade</Link>
                    <Link to="/catalogo" style={{ color: '#7a6666', textDecoration: 'none' }}>Decoração do Quartinho</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;