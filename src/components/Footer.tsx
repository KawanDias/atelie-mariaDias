import React from 'react';

export function Footer() {
    return (
        <footer style={{ 
            marginTop: '4rem', 
            borderTop: '1px solid #F0E3E3', 
            background: '#ffffff',
            padding: '2rem 1.5rem',
            color: '#625353',
            fontSize: '0.875rem'
        }}>
            {/* Regras de CSS responsivo para o Footer */}
            <style>{`
                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1.25rem;
                }

                .footer-group {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .footer-social-link {
                    color: #A35858;
                    text-decoration: none;
                    font-weight: 600;
                    transition: opacity 0.2s ease;
                }

                .footer-social-link:hover {
                    opacity: 0.75;
                }

                .footer-dev-link {
                    color: #2D2323;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .footer-dev-link:hover {
                    color: #A35858;
                }

                .footer-divider {
                    color: #E8D8D8;
                }

                /* Responsividade para telas menores (celulares) */
                @media (max-width: 768px) {
                    .footer-container {
                        flex-direction: column;
                        text-align: center;
                        justify-content: center;
                        gap: 1rem;
                    }
                    
                    .footer-group {
                        justify-content: center;
                    }
                }
            `}</style>

            <div className="footer-container">
                {/* Lado Esquerdo: Marca e Direitos */}
                <div className="footer-group">
                    <span style={{ fontWeight: 700, color: '#2D2323' }}>Ateliê Maria Dias</span>
                    <span className="footer-divider">|</span>
                    <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
                </div>

                {/* Lado Direito: Social e Créditos */}
                <div className="footer-group">
                    <a 
                        href="https://www.instagram.com/atelie.mariadias/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="footer-social-link"
                    >
                        Instagram
                    </a>
                    
                    <a 
                        href="https://www.facebook.com/maria.dias.102865" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="footer-social-link"
                    >
                        Facebook
                    </a>

                    <span className="footer-divider">|</span>

                    <span>
                        Desenvolvido por{' '}
                        <a 
                            href="https://www.linkedin.com/in/kawdev" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="footer-dev-link"
                        >
                            Kawan Dias
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}