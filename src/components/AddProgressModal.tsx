import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Send, ChevronDown } from 'lucide-react';
import type { Skill } from '../types';

interface Props {
    skills: Skill[];
    onAddLog: (log: { skillId: string; subSkillId: string; notes: string; duration: number }) => void;
}

const AddProgressModal = ({ skills, onAddLog }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(skills[0]?.id || '');
    const [selectedSubSkill, setSelectedSubSkill] = useState(skills[0]?.subSkills?.[0]?.id || '');
    const [notes, setNotes] = useState('');
    const [duration, setDuration] = useState('30');

    const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
    const [subSkillDropdownOpen, setSubSkillDropdownOpen] = useState(false);
    const skillDropdownRef = useRef<HTMLDivElement>(null);
    const subSkillDropdownRef = useRef<HTMLDivElement>(null);

    const currentSkill = skills.find(s => s.id === selectedSkill);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target as Node)) {
                setSkillDropdownOpen(false);
            }
            if (subSkillDropdownRef.current && !subSkillDropdownRef.current.contains(event.target as Node)) {
                setSubSkillDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (notes.trim()) {
            onAddLog({
                skillId: selectedSkill,
                subSkillId: selectedSubSkill,
                notes,
                duration: parseInt(duration) || 0
            });
            setNotes('');
            setDuration('30');
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary"
                style={{ position: 'fixed', bottom: '40px', right: '40px', borderRadius: '50%', width: '64px', height: '64px', padding: 0, justifyContent: 'center', zIndex: 100 }}
            >
                <Plus size={32} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '500px', padding: '32px', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px' }}>Log Your Progress</h2>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X /></button>
                            </div>

                            {skills.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-dim)' }}>
                                    <p>Please create a mastery path in the Skills tab first.</p>
                                    <button type="button" onClick={() => setIsOpen(false)} className="btn-primary" style={{ marginTop: '24px' }}>
                                        Got it
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Focus Category</label>
                                        <div style={{ position: 'relative' }} ref={skillDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSkillDropdownOpen(!skillDropdownOpen);
                                                    setSubSkillDropdownOpen(false);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border-glass)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {skills.find(s => s.id === selectedSkill)?.name || 'Select Category'}
                                                <ChevronDown size={18} style={{ transform: skillDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                            </button>
                                            <AnimatePresence>
                                                {skillDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            marginTop: '8px',
                                                            background: 'var(--bg-dark)',
                                                            border: '1px solid var(--border-glass)',
                                                            borderRadius: '12px',
                                                            zIndex: 50,
                                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                                            maxHeight: '300px',
                                                            overflowY: 'auto'
                                                        }}
                                                    >
                                                        {skills.map(s => (
                                                            <div
                                                                key={s.id}
                                                                onClick={() => {
                                                                    setSelectedSkill(s.id);
                                                                    setSelectedSubSkill(skills.find(sk => sk.id === s.id)?.subSkills[0]?.id || '');
                                                                    setSkillDropdownOpen(false);
                                                                }}
                                                                style={{
                                                                    padding: '12px',
                                                                    cursor: 'pointer',
                                                                    transition: 'background 0.2s',
                                                                    color: selectedSkill === s.id ? 'var(--primary)' : 'var(--text-main)',
                                                                    background: selectedSkill === s.id ? 'rgba(255,255,255,0.05)' : 'transparent'
                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = selectedSkill === s.id ? 'rgba(255,255,255,0.05)' : 'transparent')}
                                                            >
                                                                {s.name}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Specific Unit</label>
                                        <div style={{ position: 'relative' }} ref={subSkillDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSubSkillDropdownOpen(!subSkillDropdownOpen);
                                                    setSkillDropdownOpen(false);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border-glass)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    cursor: currentSkill?.subSkills.length ? 'pointer' : 'not-allowed',
                                                    opacity: currentSkill?.subSkills.length ? 1 : 0.5
                                                }}
                                                disabled={!currentSkill?.subSkills.length}
                                            >
                                                {currentSkill?.subSkills.find(ss => ss.id === selectedSubSkill)?.name || 'Select Unit'}
                                                <ChevronDown size={18} style={{ transform: subSkillDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                            </button>
                                            <AnimatePresence>
                                                {subSkillDropdownOpen && currentSkill?.subSkills.length && currentSkill.subSkills.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            marginTop: '8px',
                                                            background: 'var(--bg-dark)',
                                                            border: '1px solid var(--border-glass)',
                                                            borderRadius: '12px',
                                                            zIndex: 50,
                                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                                            maxHeight: '300px',
                                                            overflowY: 'auto'
                                                        }}
                                                    >
                                                        {currentSkill.subSkills.map(ss => (
                                                            <div
                                                                key={ss.id}
                                                                onClick={() => {
                                                                    setSelectedSubSkill(ss.id);
                                                                    setSubSkillDropdownOpen(false);
                                                                }}
                                                                style={{
                                                                    padding: '12px',
                                                                    cursor: 'pointer',
                                                                    transition: 'background 0.2s',
                                                                    color: selectedSubSkill === ss.id ? 'var(--primary)' : 'var(--text-main)',
                                                                    background: selectedSubSkill === ss.id ? 'rgba(255,255,255,0.05)' : 'transparent'
                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = selectedSubSkill === ss.id ? 'rgba(255,255,255,0.05)' : 'transparent')}
                                                            >
                                                                {ss.name}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Time Spent (min)</label>
                                            <input
                                                type="number"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                min="1"
                                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>What did you learn today?</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="E.g. I finally mastered UseContext and understood why global state can be tricky..."
                                            style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', resize: 'none' }}
                                        />
                                    </div>

                                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                                        Post Achievement <Send size={18} />
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AddProgressModal;
