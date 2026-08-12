import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import { Footer } from './components/Footer'; // 1. Importa o Footer
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import FavoritesPage from './pages/FavoritesPage';
import RepairsPage from './pages/RepairsPage';

function App() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="app-shell">
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        background: '#ffffff',
                        color: '#5e4e4e',
                        border: '1px solid #f2e6e6',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 20px rgba(230, 200, 200, 0.15)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#b58b8b',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <Header />

            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalogo" element={<CatalogPage />} />
                    <Route path="/produto/:id" element={<ProductPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/favoritos" element={<FavoritesPage />} />
                    <Route path="/consertos" element={<RepairsPage />} />
                </Routes>
            </main>

            <Footer /> {/* 2. Adiciona o Footer no final */}
        </div>
    );
}

export default App;