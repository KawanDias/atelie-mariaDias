import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
    const navigate = useNavigate();
    const { login, signup } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client' as 'client' | 'admin',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignup) {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('As senhas não coincidem');
                }
                if (!formData.name || formData.name.length < 3) {
                    throw new Error('Nome deve ter pelo menos 3 caracteres');
                }
                await signup(formData.name, formData.email, formData.password, formData.role);
            } else {
                await login(formData.email, formData.password);
            }
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao processar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container">
            <div className="form-card">
                <h2>{isSignup ? 'Criar conta' : 'Entrar'}</h2>
                {error && <div style={{ color: '#e07070', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <>
                            <label>Nome completo</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Seu nome"
                                required
                            />
                        </>
                    )}

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                    />

                    <label>Senha</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    {isSignup && (
                        <>
                            <label>Confirmar senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />

                            <label>Tipo de conta</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="client">Cliente (Comprador)</option>
                                <option value="admin">Administrador (Desenvolvedora)</option>
                            </select>
                            <p style={{ fontSize: '0.85rem', color: '#a89a97', marginTop: '0.5rem' }}>
                                Selecione "Administrador" se você é a Maria Dias ou precisa de acesso ao painel de controle.
                            </p>
                        </>
                    )}

                    <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
                        {loading ? 'Processando...' : isSignup ? 'Cadastrar' : 'Entrar'}
                    </button>
                </form>

                <p style={{ marginTop: '1rem', textAlign: 'center', color: '#a89a97' }}>
                    {isSignup ? 'Já tem conta? ' : 'Não tem conta? '}
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setError('');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isSignup ? 'Faça login' : 'Cadastre-se'}
                    </button>
                </p>
            </div>
        </section>
    );
}

export default LoginPage;
