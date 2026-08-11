import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

function Header() {
    const { user, logout } = useAuth();
    const { favorites } = useFavorites();

    return (
        <header className="topbar">
            <div className="promo-bar">Bordados Afetuosos & Enxoval de Bebê Personalizado • Envio para todo o Brasil</div>
            <div className="main-header">
                <Link to="/" className="brand">Ateliê Maria Dias</Link>
                <div className="search-box">
                    <span>🔎</span>
                    <input type="text" placeholder="Buscar enxoval de bebê" />
                </div>
                <nav className="header-actions">
                    {user ? (
                        <>
                            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>👤 {user.name}</span>
                            {user.role === 'admin' && (
                                <Link to="/admin" style={{ background: 'var(--soft-pink)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: 'var(--primary)', fontWeight: 600 }}>
                                    ⚙️ Admin
                                </Link>
                            )}
                            <button onClick={logout} style={{ background: 'var(--soft-pink)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: 'var(--text)', fontWeight: 500 }}>
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600 }}>
                            Entrar
                        </Link>
                    )}
                    <Link to="/favoritos" style={{ position: 'relative', padding: '0.4rem 0.8rem' }}>
                        ❤️
                        {favorites.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                background: '#e07070',
                                color: 'white',
                                borderRadius: '50%',
                                width: '1.2rem',
                                height: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                            }}>
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>
            <nav className="category-nav">
                <Link to="/catalogo">Enxoval de Bebê</Link>
                <Link to="/catalogo">Batizado</Link>
                <Link to="/catalogo">Acessórios & Maternidade</Link>
                <Link to="/catalogo">Decoração do Quartinho</Link>
            </nav>
        </header>
    );
}

export default Header;
