import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
    return (
        <div className="app-shell">
            <Header />

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalogo" element={<CatalogPage />} />
                    <Route path="/produto/:id" element={<ProductPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/favoritos" element={<FavoritesPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
