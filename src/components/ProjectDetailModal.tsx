import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Trash2 } from 'lucide-react';
import type { Project } from '../types';

interface ProjectDetailModalProps {
    project: Project | null;
    onClose: () => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Project>) => void;
}

const ProjectDetailModal = ({ project, onClose, onDelete, onUpdate }: ProjectDetailModalProps) => {
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!project) return null;

    const handleAddTask = () => {
        if (!newTaskDesc.trim() || !project) return;

        const newTask = {
            id: Date.now().toString(),
            description: newTaskDesc.trim(),
            isCompleted: false
        };

        onUpdate(project.id, {
            tasks: [...(project.tasks || []), newTask]
        });
        setNewTaskDesc('');
    };

    const handleToggleTask = (taskId: string) => {
        if (!project || !project.tasks) return;
        const updatedTasks = project.tasks.map(t =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        onUpdate(project.id, { tasks: updatedTasks });
    };

    const handleDeleteTask = (taskId: string) => {
        if (!project || !project.tasks) return;
        onUpdate(project.id, { tasks: project.tasks.filter(t => t.id !== taskId) });
    };

    return (
        <AnimatePresence>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100,
                    padding: '20px'
                }}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    className="glass-card"
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Header Image */}
                    {project.imageUrl && (
                        <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, var(--bg-card-glass), transparent)'
                            }}></div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div style={{ padding: '32px', overflowY: 'auto', flex: 1, position: 'relative', marginTop: project.imageUrl ? '-60px' : '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>{project.title}</h2>
                                <p style={{ fontSize: '18px', color: 'var(--text-dim)', maxWidth: '600px' }}>{project.subtitle}</p>
                            </div>
                            <button onClick={onClose} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', zIndex: 10 }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tech Stack */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                            {project.techStack.map((tech, index) => (
                                <span
                                    key={index}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--primary)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)'
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', marginBottom: '16px', fontWeight: 600 }}>Project Overview</h3>
                            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                                {project.description}
                            </p>
                        </div>

                        {/* Tasks Section */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)', fontWeight: 600 }}>Action Tasks</h3>
                                <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                                    {project.tasks?.filter(t => t.isCompleted).length || 0} / {project.tasks?.length || 0} Completed
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                {project.tasks && project.tasks.map(task => (
                                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-glass)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                                        <button
                                            onClick={() => handleToggleTask(task.id)}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '6px',
                                                border: `2px solid ${task.isCompleted ? 'var(--primary)' : 'var(--text-dim)'}`,
                                                background: task.isCompleted ? 'var(--primary)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                        >
                                            {task.isCompleted && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></motion.div>}
                                        </button>
                                        <span style={{ flex: 1, fontSize: '15px', color: task.isCompleted ? 'var(--text-dim)' : 'var(--text-main)', textDecoration: task.isCompleted ? 'line-through' : 'none', transition: 'all 0.2s' }}>
                                            {task.description}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', opacity: 0.5, display: 'flex', alignItems: 'center' }}
                                            onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#ef4444'; }}
                                            onMouseOut={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {(!project.tasks || project.tasks.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontSize: '14px', fontStyle: 'italic', border: '1px dashed var(--border-glass)', borderRadius: '12px' }}>
                                        No tasks defined for this project yet.
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={newTaskDesc}
                                    onChange={e => setNewTaskDesc(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleAddTask()}
                                    placeholder="Add a new task..."
                                    style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                                />
                                <button className="btn-primary" onClick={handleAddTask}>
                                    Add Task
                                </button>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Github size={18} /> View Source
                                    </a>
                                )}
                            </div>
                            {showDeleteConfirm ? (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', color: '#ef4444', fontWeight: 600 }}>Really delete?</span>
                                    <button
                                        onClick={() => { onDelete(project.id); setShowDeleteConfirm(false); }}
                                        style={{ background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', cursor: 'pointer', padding: '8px 16px', borderRadius: '12px', fontSize: '14px' }}
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        color: '#ef4444',
                                        padding: '10px 16px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                >
                                    <Trash2 size={16} /> Delete Project
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProjectDetailModal;
