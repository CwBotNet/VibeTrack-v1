import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, ChevronDown } from 'lucide-react';

interface Props {
    onAdd: (name: string, category: string) => void;
}

const AddSkillModal = ({ onAdd }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Frontend');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categories = ['Frontend', 'Backend', 'Data', 'DevOps', 'AI', 'Web3', 'Mobile', 'Other'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name, category);
            setName('');
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
                <Plus size={18} /> Add Skill Category
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '450px', padding: '32px', background: 'var(--bg-dark)', border: '1px solid var(--border-glass)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Sparkles size={24} color="var(--primary)" /> New Mastery Path
                                </h2>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Path Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Web3 Development, Machine Learning..."
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Category</label>
                                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--border-glass)',
                                                color: 'var(--text-main)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {category}
                                            <ChevronDown size={18} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                        </button>
                                        <AnimatePresence>
                                            {dropdownOpen && (
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
                                                    {categories.map(c => (
                                                        <div
                                                            key={c}
                                                            onClick={() => { setCategory(c); setDropdownOpen(false); }}
                                                            style={{
                                                                padding: '12px',
                                                                cursor: 'pointer',
                                                                transition: 'background 0.2s',
                                                                color: category === c ? 'var(--primary)' : 'var(--text-main)',
                                                                background: category === c ? 'rgba(255,255,255,0.05)' : 'transparent'
                                                            }}
                                                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                                            onMouseLeave={(e) => (e.currentTarget.style.background = category === c ? 'rgba(255,255,255,0.05)' : 'transparent')}
                                                        >
                                                            {c}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                                    Initialize Path
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AddSkillModal;
