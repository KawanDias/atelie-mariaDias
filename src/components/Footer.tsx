export function Footer() {
    return (
        <footer style={{ 
            marginTop: '4rem', 
            borderTop: '1px solid #f2e6e6', 
            background: '#ffffff',
            padding: '1.8rem 1.5rem',
            color: '#8c7373',
            fontSize: '0.85rem'
        }}>
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem' 
            }}>
                {/* Lado Esquerdo: Marca e Direitos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 600, color: '#5e4e4e' }}>Ateliê Maria Dias</span>
                    <span style={{ color: '#d9c2c2' }}>|</span>
                    <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
                </div>

                {/* Lado Direito: Social e Créditos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
                    <a 
                        href="https://www.instagram.com/atelie.mariadias/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#b58b8b', textDecoration: 'none', fontWeight: 500, transition: 'opacity 0.2s' }}
                    >
                        Instagram
                    </a>
                    
                    <a 
                        href="https://www.facebook.com/maria.dias.102865" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#b58b8b', textDecoration: 'none', fontWeight: 500, transition: 'opacity 0.2s' }}
                    >
                        Facebook
                    </a>

                    <span style={{ color: '#d9c2c2' }}>|</span>

                    <span style={{ color: '#a38f8f' }}>
                        Desenvolvido por <strong style={{ color: '#5e4e4e', fontWeight: 600 }}>Kawan Dias</strong>
                    </span>
                </div>
            </div>
        </footer>
    );
}