import { motion } from 'framer-motion';
import { Rocket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Floating Navbar */}
            <nav className="nav-mobile" style={{
                padding: '10px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '92%',
                maxWidth: '1100px',
                background: 'rgba(7, 8, 13, 0.75)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '100px',
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
                    <Zap size={28} color="var(--primary)" fill="var(--primary)" />
                    <span>VIBE<span className="gradient-text">TRACK</span></span>
                    <span style={{ fontSize: '9px', background: 'var(--primary)', color: 'white', padding: '1px 6px', borderRadius: '15px', marginLeft: '2px', verticalAlign: 'middle', fontWeight: 700 }}>BETA</span>
                </div>
                <Link to="/auth" className="btn-primary" style={{ padding: '8px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 600 }}>Get Started</Link>
            </nav>

            {/* Hero Section */}
            <section className="landing-hero" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '120px 20px 60px',
                background: 'var(--grad-dark)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background blobs */}
                <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: '72px', maxWidth: '850px', marginBottom: '24px', fontWeight: 900, lineHeight: 1.1 }}
                >
                    Ship Better, Learn Faster with <span className="gradient-text">VibeTrack</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: '22px', color: 'var(--text-dim)', maxWidth: '700px', marginBottom: '40px', lineHeight: 1.6 }}
                >
                    The ultimate personal progress dashboard for modern developers. Track your skills, manage your projects, and conquer your learning roadmap with engineering precision.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/auth" className="btn-primary hero-btn" style={{ padding: '16px 48px', fontSize: '18px' }}>
                        <Rocket size={20} />
                        Launch Your Dashboard
                    </Link>
                </motion.div>

                {/* Showcase Video */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ marginTop: '100px', width: '100%', maxWidth: '1000px' }}
                >
                    <div className="glass-card" style={{
                        padding: 0,
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        border: '1px solid var(--border-glass)'
                    }}>
                        {/* Browser Top Bar */}
                        <div style={{
                            height: 'auto',
                            minHeight: '30px',
                            padding: '12px 20px',
                            background: 'rgba(255,255,255,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            borderBottom: '1px solid var(--border-glass)',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                            </div>
                            <div style={{ marginLeft: 'auto', fontSize: 'min(11px, 2.5vw)', color: 'var(--text-dim)', letterSpacing: '1px', fontWeight: 600, opacity: 0.8 }}>VIBETRACK_DASHBOARD_PREVIEW_V1.0</div>
                        </div>

                        {/* Content Area */}
                        <div style={{ position: 'relative', overflow: 'hidden', background: '#07080d', display: 'flex', aspectRatio: '16 / 9' }}>
                            <img
                                src="/showcase.webp"
                                alt="Dashboard Showcase"
                                style={{
                                    width: '100%',
                                    height: '101%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    transform: 'scale(1.20)', // slight zoom to completely eliminate letterboxing edges
                                    display: 'block'
                                }}
                            />
                            {/* Inner soft glow/shadow at top to separate from bar */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)', pointerEvents: 'none' }}></div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, rgba(7, 8, 13, 0.9) 0%, transparent 100%)', pointerEvents: 'none' }}></div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Landing;
