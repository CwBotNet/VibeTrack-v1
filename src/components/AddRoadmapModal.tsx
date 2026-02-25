import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Target } from 'lucide-react';

interface Props {
    onAdd: (title: string, description: string, skills: string[]) => void;
}

const AddRoadmapModal = ({ onAdd }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [skillsArr, setSkillsArr] = useState<string[]>([]);

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setSkillsArr([...skillsArr, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const removeSkill = (index: number) => {
        setSkillsArr(skillsArr.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title, description, skillsArr);
            setTitle('');
            setDescription('');
            setSkillsArr([]);
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '12px' }}
            >
                <Plus size={18} /> Add Milestone
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card modal-content"
                            style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'var(--bg-dark)', border: '1px solid var(--border-glass)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Target size={24} color="var(--primary)" /> New Roadmap Milestone
                                </h2>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Milestone Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Senior Frontend Architect, Backend Mastery..."
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Briefly describe what this phase entails..."
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', minHeight: '80px', resize: 'vertical' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Required Skills</label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                            placeholder="Add skill requirement..."
                                            style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                        />
                                        <button type="button" onClick={handleAddSkill} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '0 15px', color: 'var(--text-main)' }}>
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {skillsArr.map((skill, i) => (
                                            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-glass)', fontSize: '12px' }}>
                                                {skill}
                                                <X size={12} onClick={() => removeSkill(i)} style={{ cursor: 'pointer', opacity: 0.6 }} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                                    Launch Milestone
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AddRoadmapModal;
