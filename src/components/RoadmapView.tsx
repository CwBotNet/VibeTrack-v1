import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, CheckCircle2, ChevronRight, Trash2 } from 'lucide-react';
import type { RoadmapMilestone } from '../types';
import EditRoadmapModal from './EditRoadmapModal';

interface Props {
    milestones: RoadmapMilestone[];
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
    onUpdate: (id: string, updates: Partial<RoadmapMilestone>) => void;
    onContinueLearning: (milestone: RoadmapMilestone) => void;
}

const RoadmapView = ({ milestones, onDelete, onToggleStatus, onUpdate, onContinueLearning }: Props) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', padding: '20px 0' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: '40px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--primary), transparent)', opacity: 0.2 }}></div>

            {milestones.map((milestone, idx) => (
                <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    style={{ display: 'flex', gap: '40px', marginBottom: '60px', position: 'relative' }}
                >
                    {/* Connector Dot */}
                    <div
                        onClick={() => onToggleStatus(milestone.id)}
                        style={{
                            width: '80px',
                            height: '80px',
                            flexShrink: 0,
                            borderRadius: '50%',
                            background: milestone.status === 'completed' ? 'var(--accent)' : milestone.status === 'active' ? 'var(--primary)' : 'var(--bg-glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                            boxShadow: milestone.status === 'active' ? '0 0 20px var(--primary-glow)' : 'none',
                            border: '4px solid var(--bg-dark)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title="Toggle Status (Locked -> Active -> Completed)"
                    >
                        {milestone.status === 'completed' ? <CheckCircle2 color="white" /> : milestone.status === 'active' ? <Unlock color="white" /> : <Lock color="var(--text-dim)" />}
                    </div>

                    <div className="glass-card" style={{ flex: 1, padding: '32px', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', marginBottom: '8px', color: milestone.status === 'locked' ? 'var(--text-dim)' : 'var(--text-main)' }}>{milestone.title}</h3>
                                <p style={{ color: 'var(--text-dim)' }}>{milestone.description}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span
                                    onClick={() => onToggleStatus(milestone.id)}
                                    style={{
                                        fontSize: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        fontWeight: 700,
                                        color: milestone.status === 'completed' ? 'var(--accent)' : milestone.status === 'active' ? 'var(--primary)' : 'var(--text-dim)',
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {milestone.status}
                                </span>
                                <EditRoadmapModal milestone={milestone} onUpdate={onUpdate} />
                                {deletingId === milestone.id ? (
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: '#ef4444', marginRight: '4px' }}>Delete?</span>
                                        <button
                                            onClick={() => { onDelete(milestone.id); setDeletingId(null); }}
                                            style={{ background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(null)}
                                            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeletingId(milestone.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.4)', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.4)'}
                                        title="Delete Milestone"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {milestone.skills.map(skill => (
                                <span key={skill} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', fontSize: '12px' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {milestone.status === 'active' && (
                            <button
                                onClick={() => onContinueLearning(milestone)}
                                className="btn-primary"
                                style={{ marginTop: '24px', padding: '10px 20px', fontSize: '14px' }}
                            >
                                Continue Learning <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default RoadmapView;
