import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { Award as AwardIcon, X } from 'lucide-react';
import type { Award } from '../types';

interface Props {
    award: Award | null;
    onClose: () => void;
}

const AchievementPopup = ({ award, onClose }: Props) => {
    // Generate random particle coordinates strictly outside of JSX render cycle using useMemo
    const particles = useMemo(() => {
        if (!award) return [];
        return [...Array(6)].map(() => ({
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400
        }));
    }, [award]);

    return (
        <AnimatePresence>
            {award && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: '450px',
                                background: 'var(--bg-dark)',
                                borderRadius: '24px',
                                border: '1px solid var(--border-glass)',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            {/* Top Banner */}
                            <div style={{
                                height: '200px',
                                width: '100%',
                                position: 'relative',
                                background: 'var(--grad-premium)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={award.gifUrl}
                                    alt="Celebration"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: 0.9
                                    }}
                                />
                                <button
                                    onClick={onClose}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(0,0,0,0.5)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 2
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '32px', textAlign: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: 'var(--grad-premium)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '-64px auto 20px',
                                    position: 'relative',
                                    border: '4px solid var(--bg-dark)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                                }}>
                                    <AwardIcon size={32} color="white" />
                                </div>

                                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                                    Achievement Unlocked!
                                </h2>
                                <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '18px', marginBottom: '12px' }}>
                                    {award.title}
                                </p>
                                <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                    {award.description}
                                </p>

                                <button
                                    onClick={onClose}
                                    className="btn-primary"
                                    style={{
                                        marginTop: '32px',
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        fontWeight: 600
                                    }}
                                >
                                    Amazing!
                                </button>
                            </div>

                            {/* Confetti-like effect using motion */}
                            {particles.map((p, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: 0,
                                        scale: 1,
                                        x: p.x,
                                        y: p.y
                                    }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                                        zIndex: -1
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AchievementPopup;
