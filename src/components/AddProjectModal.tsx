import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FolderGit2 } from 'lucide-react';
import type { Project } from '../types';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (project: Omit<Project, 'id'>) => void;
}

const AddProjectModal = ({ isOpen, onClose, onAdd }: AddProjectModalProps) => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [techInput, setTechInput] = useState('');
    const [techStack, setTechStack] = useState<string[]>([]);
    const [status, setStatus] = useState<'planning' | 'in-progress' | 'completed'>('planning');

    const handleAddTech = () => {
        if (techInput.trim() && !techStack.includes(techInput.trim())) {
            setTechStack([...techStack, techInput.trim()]);
            setTechInput('');
        }
    };

    const handleRemoveTech = (tech: string) => {
        setTechStack(techStack.filter(t => t !== tech));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd({
                title,
                subtitle,
                description,
                imageUrl,
                githubUrl,
                techStack,
                status,
                tasks: []
            });
            setTitle('');
            setSubtitle('');
            setDescription('');
            setImageUrl('');
            setGithubUrl('');
            setTechStack([]);
            setTechInput('');
            setStatus('planning');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100,
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-card"
                        style={{ padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FolderGit2 size={24} color="var(--primary)" /> Document Project
                            </h2>
                            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>Project Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Nexus URL Shortener"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>Short Subtitle</label>
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    placeholder="e.g. A high-performance URL shortener built with Rust."
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>Full Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the architecture, challenges faced, and what you learned..."
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>Project Status</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {[
                                        { id: 'planning', label: 'Planning', color: 'rgba(99, 102, 241, 1)' },
                                        { id: 'in-progress', label: 'In Progress', color: 'rgba(245, 158, 11, 1)' },
                                        { id: 'completed', label: 'Completed', color: 'rgba(16, 185, 129, 1)' }
                                    ].map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setStatus(s.id as any)}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                borderRadius: '12px',
                                                border: `1px solid ${status === s.id ? s.color : 'var(--border-glass)'}`,
                                                background: status === s.id ? `${s.color.replace('1)', '0.1)')}` : 'var(--bg-glass)',
                                                color: status === s.id ? s.color : 'var(--text-dim)',
                                                fontWeight: status === s.id ? 600 : 400,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>Image URL</label>
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://images.unsplash..."
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>GitHub URL</label>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/..."
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px' }}>Tech Stack</label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                        placeholder="e.g. Next.js, Rust, Tailwind..."
                                        style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                    />
                                    <button type="button" onClick={handleAddTech} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '0 15px', color: 'var(--text-main)' }}>
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {techStack.map((tech) => (
                                        <div key={tech} style={{
                                            padding: '6px 12px',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            color: 'var(--primary)',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            border: '1px solid rgba(99, 102, 241, 0.2)'
                                        }}>
                                            {tech}
                                            <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTech(tech)} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Save Project
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddProjectModal;
