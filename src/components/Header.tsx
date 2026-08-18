import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

// @ts-ignore
import logoImg from '../assets/logo.png';

// Lista de e-mails com permissão de Administrador
const ADMIN_EMAILS = [
    'kawdeveloper@gmail.com',
    'mariagbdias@gmail.com'
];

function Header() {
    const { user, logout } = useAuth();
    const { favorites } = useFavorites();
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Verifica se o usuário logado é admin
    const isAdmin = Boolean(
        user && (
            user.role === 'admin' ||
            (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
        )
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchTerm.trim()) {
            navigate(`/catalogo?busca=${encodeURIComponent(searchTerm)}`);
            setIsMenuOpen(false);
        }
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="topbar">

            {/* =====================================================
                ESTILOS CSS
            ===================================================== */}
            <style>{`

                .topbar {
                    background: #ffffff;
                    border-bottom: 1px solid #E8D5D5;
                    width: 100%;
                }

                /* -------------------------------------------------
                   FAIXA PROMOCIONAL
                ------------------------------------------------- */

                .promo-bar {
                    font-size: 0.8rem;
                    padding: 0.4rem 1rem;
                    background: #F8ECE8;
                    color: #4A3C3C;
                    text-align: center;
                    font-weight: 600;
                    letter-spacing: 0.01em;
                }

                /* -------------------------------------------------
                   ÁREA PRINCIPAL
                ------------------------------------------------- */

                .header-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0.75rem 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }

                /* -------------------------------------------------
                   LOGO
                ------------------------------------------------- */

                .logo-img {
                    height: 80px;
                    width: auto;
                    object-fit: contain;
                    transition: height 0.3s ease;
                }

                /* -------------------------------------------------
                   BARRA DE PESQUISA
                ------------------------------------------------- */

                .search-form {
                    flex: 1;
                    max-width: 420px;
                    height: 42px;
                    box-sizing: border-box;

                    display: flex;
                    align-items: center;

                    background: #FFF5F5;
                    border: 1px solid #E8D5D5;
                    border-radius: 21px;

                    padding: 0 0.85rem;

                    /* Sem sombra para evitar o halo ao redor */
                    box-shadow: none;

                    transition: border-color 0.2s ease;
                }

                /* -------------------------------------------------
                   ESTADO DE FOCO
                   Sem sombra externa/halo
                ------------------------------------------------- */

                .search-form:focus-within {
                    border-color: #D9BABA;
                    box-shadow: none;
                    outline: none;
                }

                .search-form button {
                    width: 28px;
                    height: 28px;
                    padding: 0;
                    margin-right: 0.35rem;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: none;
                    border: none;
                    cursor: pointer;

                    font-size: 0.85rem;
                    opacity: 0.8;
                    flex-shrink: 0;

                    outline: none;
                    box-shadow: none;
                }

                .search-form button:focus,
                .search-form button:focus-visible {
                    outline: none;
                    box-shadow: none;
                }

                .search-form input {
                    min-width: 0;
                    outline: none !important;
                    box-shadow: none !important;
                }

                .search-form input:focus,
                .search-form input:focus-visible {
                    outline: none !important;
                    box-shadow: none !important;
                }

                /* -------------------------------------------------
                   AÇÕES DESKTOP
                ------------------------------------------------- */

                .user-actions-desktop {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex-shrink: 0;
                }

                /* -------------------------------------------------
                   NAVEGAÇÃO DESKTOP
                ------------------------------------------------- */

                .nav-desktop {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0.2rem 1.5rem 0.85rem 1.5rem;

                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                /* -------------------------------------------------
                   AÇÕES MOBILE
                ------------------------------------------------- */

                .mobile-right-actions {
                    display: none;
                    align-items: center;
                    gap: 0.5rem;
                }

                .menu-toggle-btn {
                    background: transparent;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #4A3C3C;
                    padding: 0.3rem 0.5rem;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* -------------------------------------------------
                   MENU MOBILE
                ------------------------------------------------- */

                .mobile-drawer {
                    display: none;
                    background: #ffffff;
                    border-top: 1px solid #E8D5D5;
                    padding: 1.25rem 1.5rem;

                    flex-direction: column;
                    gap: 1.25rem;

                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                }

                .mobile-nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.85rem;
                }

                .mobile-nav-links a {
                    text-decoration: none;
                    font-size: 0.95rem;
                    padding: 0.4rem 0;
                    border-bottom: 1px solid #FFF5F5;
                }

                /* =================================================
                   MOBILE
                ================================================= */

                @media (max-width: 768px) {

                    .logo-img {
                        height: 52px;
                    }

                    .search-form-desktop,
                    .user-actions-desktop,
                    .nav-desktop {
                        display: none !important;
                    }

                    .mobile-right-actions {
                        display: flex;
                    }

                    .mobile-drawer.open {
                        display: flex;
                    }

                }

            `}</style>

            {/* =====================================================
                FAIXA SUPERIOR
            ===================================================== */}

            <div className="promo-bar">
                Bordados Afetuosos & Enxoval de Bebê Personalizado • Envio para todo o Brasil
            </div>

            {/* =====================================================
                HEADER PRINCIPAL
            ===================================================== */}

            <div className="header-main">

                {/* Logo */}

                <Link
                    to="/"
                    onClick={closeMenu}
                    style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                    }}
                >
                    <img
                        src={logoImg}
                        alt="Ateliê Maria Dias"
                        className="logo-img"
                    />
                </Link>

                {/* =================================================
                    BARRA DE PESQUISA DESKTOP
                ================================================= */}

                <form
                    onSubmit={handleSearch}
                    className="search-form search-form-desktop"
                >
                    <button
                        type="submit"
                        aria-label="Pesquisar"
                    >
                        🔍
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
                            boxShadow: 'none',
                            width: '100%',
                            fontSize: '0.88rem',
                            color: '#2A1B1B',
                            fontWeight: 500
                        }}
                    />
                </form>

                {/* =================================================
                    AÇÕES DO USUÁRIO DESKTOP
                ================================================= */}

                <div className="user-actions-desktop">

                    {user ? (
                        <>
                            <span
                                style={{
                                    fontSize: '0.88rem',
                                    color: '#2A1B1B',
                                    fontWeight: 600
                                }}
                            >
                                👤 {user.name || 'Usuário'}
                            </span>

                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    style={{
                                        background: '#FFF5F5',
                                        color: '#8C3B3B',
                                        border: '1px solid #E8D5D5',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '0.82rem',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}
                                >
                                    ⚙️ Admin
                                </Link>
                            )}

                            <button
                                onClick={logout}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #E8D5D5',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    color: '#4A3C3C',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                background: '#8C3B3B',
                                color: '#ffffff',
                                padding: '0.45rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 4px 10px rgba(140, 59, 59, 0.2)'
                            }}
                        >
                            Entrar
                        </Link>
                    )}

                    {/* Favoritos */}

                    <Link
                        to="/favoritos"
                        style={{
                            position: 'relative',
                            padding: '0.4rem',
                            textDecoration: 'none',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        ❤️

                        {favorites.length > 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '0px',
                                    right: '-2px',
                                    background: '#8C3B3B',
                                    color: '#ffffff',
                                    borderRadius: '50%',
                                    width: '1.1rem',
                                    height: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    border: '2px solid #ffffff'
                                }}
                            >
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                </div>

                {/* =================================================
                    AÇÕES MOBILE
                ================================================= */}

                <div className="mobile-right-actions">

                    <Link
                        to="/favoritos"
                        onClick={closeMenu}
                        style={{
                            position: 'relative',
                            padding: '0.4rem',
                            textDecoration: 'none',
                            fontSize: '1.3rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        ❤️

                        {favorites.length > 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '0px',
                                    right: '-2px',
                                    background: '#8C3B3B',
                                    color: '#ffffff',
                                    borderRadius: '50%',
                                    width: '1.1rem',
                                    height: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    border: '2px solid #ffffff'
                                }}
                            >
                                {favorites.length}
                            </span>
                        )}
                    </Link>

                    <button
                        className="menu-toggle-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir Menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>

                </div>

            </div>

            {/* =====================================================
                MENU MOBILE RETRÁTIL
            ===================================================== */}

            <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>

                {/* Busca Mobile */}

                <form
                    onSubmit={handleSearch}
                    className="search-form"
                    style={{ maxWidth: '100%' }}
                >
                    <button
                        type="submit"
                        aria-label="Pesquisar"
                    >
                        🔍
                    </button>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar no ateliê..."
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            boxShadow: 'none',
                            width: '100%',
                            fontSize: '0.88rem',
                            color: '#2A1B1B',
                            fontWeight: 500
                        }}
                    />
                </form>

                {/* Status do usuário */}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid #F8ECE8'
                    }}
                >
                    {user ? (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                width: '100%',
                                justifyContent: 'space-between'
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.9rem',
                                    color: '#2A1B1B',
                                    fontWeight: 600
                                }}
                            >
                                👤 {user.name || 'Usuário'}
                            </span>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>

                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        onClick={closeMenu}
                                        style={{
                                            background: '#FFF5F5',
                                            color: '#8C3B3B',
                                            border: '1px solid #E8D5D5',
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        ⚙️ Admin
                                    </Link>
                                )}

                                <button
                                    onClick={() => {
                                        logout();
                                        closeMenu();
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid #E8D5D5',
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '8px',
                                        color: '#4A3C3C',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sair
                                </button>

                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={closeMenu}
                            style={{
                                background: '#8C3B3B',
                                color: '#ffffff',
                                padding: '0.55rem 1.2rem',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                textAlign: 'center',
                                width: '100%'
                            }}
                        >
                            Entrar na Conta
                        </Link>
                    )}
                </div>

                {/* Navigation Links Mobile */}

                <nav className="mobile-nav-links">

                    <Link
                        to="/catalogo"
                        onClick={closeMenu}
                        style={{ color: '#8C3B3B', fontWeight: 700 }}
                    >
                        ✨ Todos os Produtos
                    </Link>

                    <Link
                        to="/catalogo"
                        onClick={closeMenu}
                        style={{ color: '#4A3C3C', fontWeight: 500 }}
                    >
                        Enxoval de Bebê
                    </Link>

                    <Link
                        to="/catalogo"
                        onClick={closeMenu}
                        style={{ color: '#4A3C3C', fontWeight: 500 }}
                    >
                        Batizado
                    </Link>

                    <Link
                        to="/catalogo"
                        onClick={closeMenu}
                        style={{ color: '#4A3C3C', fontWeight: 500 }}
                    >
                        Toalhas Personalizadas
                    </Link>

                    <Link
                        to="/catalogo"
                        onClick={closeMenu}
                        style={{ color: '#4A3C3C', fontWeight: 500 }}
                    >
                        Acessórios & Maternidade
                    </Link>

                    <Link
                        to="/catalogo"
                        onClick={closeMenu}
                        style={{ color: '#4A3C3C', fontWeight: 500 }}
                    >
                        Decoração do Quartinho
                    </Link>

                    <Link
                        to="/consertos"
                        onClick={closeMenu}
                        style={{ color: '#8C3B3B', fontWeight: 700 }}
                    >
                        🪡 Consertos e Ajustes
                    </Link>

                </nav>

            </div>

            {/* =====================================================
                NAVEGAÇÃO DESKTOP
            ===================================================== */}

            <div className="nav-desktop">

                <nav
                    style={{
                        display: 'flex',
                        gap: '1.8rem',
                        fontSize: '0.88rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}
                >

                    <Link
                        to="/catalogo"
                        style={{
                            color: '#8C3B3B',
                            fontWeight: 700,
                            textDecoration: 'none'
                        }}
                    >
                        ✨ Todos
                    </Link>

                    <Link
                        to="/catalogo"
                        style={{
                            color: '#4A3C3C',
                            fontWeight: 500,
                            textDecoration: 'none'
                        }}
                    >
                        Enxoval de Bebê
                    </Link>

                    <Link
                        to="/catalogo"
                        style={{
                            color: '#4A3C3C',
                            fontWeight: 500,
                            textDecoration: 'none'
                        }}
                    >
                        Batizado
                    </Link>

                    <Link
                        to="/catalogo"
                        style={{
                            color: '#4A3C3C',
                            fontWeight: 500,
                            textDecoration: 'none'
                        }}
                    >
                        Toalhas Personalizadas
                    </Link>

                    <Link
                        to="/catalogo"
                        style={{
                            color: '#4A3C3C',
                            fontWeight: 500,
                            textDecoration: 'none'
                        }}
                    >
                        Acessórios & Maternidade
                    </Link>

                    <Link
                        to="/catalogo"
                        style={{
                            color: '#4A3C3C',
                            fontWeight: 500,
                            textDecoration: 'none'
                        }}
                    >
                        Decoração do Quartinho
                    </Link>

                    <Link
                        to="/consertos"
                        style={{
                            color: '#8C3B3B',
                            fontWeight: 700,
                            textDecoration: 'none'
                        }}
                    >
                        🪡 Consertos e Ajustes
                    </Link>

                </nav>

            </div>

        </header>
    );
}

export default Header;