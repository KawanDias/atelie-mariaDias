import React, { useState } from 'react';
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
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                if (!formData.name || formData.name.trim().length < 3) {
                    throw new Error('Nome deve ter pelo menos 3 caracteres');
                }
                await signup(formData.name, formData.email, formData.password);
            } else {
                await login(formData.email, formData.password);
            }
            navigate('/');
        } catch (err: any) {
            console.error("Erro detalhado no Auth/Firebase:", err);

            let message = err instanceof Error ? err.message : 'Erro ao processar requisição';
            
            // Tratamento amigável para códigos comuns do Firebase
            if (message.includes('auth/user-not-found') || message.includes('auth/wrong-password') || message.includes('auth/invalid-credential')) {
                message = 'E-mail ou senha incorretos.';
            } else if (message.includes('auth/email-already-in-use')) {
                message = 'Este e-mail já está em uso por outra conta.';
            } else if (message.includes('auth/weak-password')) {
                message = 'A senha deve ter pelo menos 6 caracteres.';
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
    };

    return (
        <section style={{ padding: '3rem 1.25rem 4rem 1.25rem', maxWidth: '480px', margin: '0 auto' }}>
            {/* CSS Responsivo e Estilos de Autenticação */}
            <style>{`
                .auth-card {
                    background: #ffffff;
                    padding: 2.5rem 2rem;
                    border-radius: 24px;
                    border: 1px solid #F0E3E3;
                    box-shadow: 0 8px 30px rgba(163, 88, 88, 0.06);
                }

                .auth-title {
                    font-size: 1.8rem;
                    color: #2D2323;
                    font-weight: 700;
                    margin-bottom: 0.4rem;
                    text-align: center;
                }

                .auth-subtitle {
                    color: #625353;
                    font-size: 0.92rem;
                    text-align: center;
                    margin-bottom: 2rem;
                    line-height: 1.5;
                }

                .auth-field {
                    margin-bottom: 1.2rem;
                }

                .auth-label {
                    display: block;
                    font-size: 0.88rem;
                    color: #2D2323;
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }

                .auth-input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    border: 1px solid #F0E3E3;
                    background: #FAF2F2;
                    outline: none;
                    font-size: 0.95rem;
                    color: #2D2323;
                    box-sizing: border-box;
                    transition: border-color 0.2s, background 0.2s;
                }

                .auth-input:focus {
                    border-color: #A35858;
                    background: #FFFFFF;
                }

                .error-banner {
                    background: #FDF2F2;
                    border: 1px solid #F5C6C6;
                    color: #C0392B;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    font-size: 0.88rem;
                    margin-bottom: 1.25rem;
                    text-align: center;
                    font-weight: 500;
                }

                .submit-btn {
                    background: #A35858;
                    color: #ffffff;
                    border: none;
                    padding: 0.9rem;
                    border-radius: 14px;
                    font-weight: 600;
                    font-size: 0.98rem;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 0.5rem;
                    box-shadow: 0 4px 14px rgba(163, 88, 88, 0.22);
                    transition: background 0.2s, transform 0.2s;
                }

                .submit-btn:hover:not(:disabled) {
                    background: #8e4b4b;
                    transform: translateY(-2px);
                }

                .submit-btn:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .toggle-btn {
                    background: none;
                    border: none;
                    color: #A35858;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: underline;
                    padding: 0;
                    font-size: 0.92rem;
                }

                .toggle-btn:hover {
                    color: #8e4b4b;
                }

                @media (max-width: 480px) {
                    .auth-card {
                        padding: 1.75rem 1.25rem;
                        border-radius: 20px;
                    }
                }
            `}</style>

            <div className="auth-card">
                <h2 className="auth-title">
                    {isSignup ? 'Criar Conta' : 'Acessar Conta'}
                </h2>
                <p className="auth-subtitle">
                    {isSignup 
                        ? 'Cadastre-se para acompanhar seus pedidos e solicitar peças personalizadas' 
                        : 'Entre com seu e-mail e senha para continuar'}
                </p>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="auth-field">
                            <label className="auth-label">Nome completo *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                                required
                                className="auth-input"
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label className="auth-label">E-mail *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            required
                            className="auth-input"
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Senha *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo de 6 dígitos"
                            required
                            className="auth-input"
                        />
                    </div>

                    {isSignup && (
                        <div className="auth-field">
                            <label className="auth-label">Confirmar senha *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repita a senha"
                                required
                                className="auth-input"
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Processando...' : isSignup ? 'Criar Minha Conta' : 'Entrar na Conta'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#625353', fontSize: '0.92rem' }}>
                    {isSignup ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}
                    <button type="button" onClick={toggleMode} className="toggle-btn">
                        {isSignup ? 'Faça login' : 'Cadastre-se'}
                    </button>
                </p>
            </div>
        </section>
    );
}

export default LoginPage;