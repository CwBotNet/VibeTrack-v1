import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Github, Zap } from 'lucide-react';
import '../index.css';

const Auth = () => {
    const [loadingProvider, setLoadingProvider] = useState<'github' | 'google' | null>(null);

    const handleLogin = async (provider: 'github' | 'google') => {
        try {
            setLoadingProvider(provider);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin + '/dashboard'
                }
            });
            if (error) throw error;
        } catch (error: any) {
            alert(error.error_description || error.message);
        } finally {
            setLoadingProvider(null);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-dark)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '40px',
                    textAlign: 'center',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '32px',
                    backdropFilter: 'blur(20px)'
                }}
            >
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: 'var(--grad-premium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <Zap size={32} color="white" fill="white" />
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
                        Vibe<span className="gradient-text">Track</span>
                    </h1>
                    <p style={{ color: 'var(--text-dim)' }}>Synchronize your journey to mastery.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={() => handleLogin('github')}
                        disabled={loadingProvider !== null}
                        className="btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '14px',
                            borderRadius: '16px',
                            width: '100%',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loadingProvider !== null ? 'not-allowed' : 'pointer',
                            opacity: loadingProvider !== null ? 0.7 : 1
                        }}
                    >
                        <Github size={20} />
                        {loadingProvider === 'github' ? 'Connecting...' : 'Continue with GitHub'}
                    </button>

                    <button
                        onClick={() => handleLogin('google')}
                        disabled={loadingProvider !== null}
                        className="btn-secondary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '14px',
                            borderRadius: '16px',
                            width: '100%',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loadingProvider !== null ? 'not-allowed' : 'pointer',
                            opacity: loadingProvider !== null ? 0.7 : 1,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                        {loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
                    </button>

                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>
                        By continuing, you agree to our terms of service and growth mindset.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
