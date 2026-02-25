import { motion } from 'framer-motion';
import { Award as AwardIcon, Calendar } from 'lucide-react';
import type { Award } from '../types';

interface Props {
    awards: Award[];
}

const AwardsView = ({ awards }: Props) => {
    if (awards.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 20px',
                textAlign: 'center',
                background: 'var(--bg-glass)',
                borderRadius: '24px',
                border: '1px solid var(--border-glass)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    border: '1px solid var(--border-glass)'
                }}>
                    <AwardIcon size={40} color="var(--text-dim)" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Your Trophy Case is Empty</h2>
                <p style={{ color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.6' }}>
                    Complete learning units or roadmap milestones to earn unique anime achievements!
                </p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
        }}>
            {awards.map((award, idx) => (
                <motion.div
                    key={award.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card"
                    style={{
                        overflow: 'hidden',
                        padding: 0,
                        border: '1px solid var(--border-glass)',
                        position: 'relative',
                        background: 'rgba(15, 23, 42, 0.4)'
                    }}
                >
                    <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                        <img
                            src={award.gifUrl}
                            alt={award.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            fontSize: '10px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Calendar size={10} />
                            {award.date}
                        </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: 'var(--accent)' }}>
                            {award.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                            {award.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default AwardsView;
