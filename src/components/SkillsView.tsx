import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Plus, BookOpen, Trash2 } from 'lucide-react';
import type { Skill } from '../types';

interface Props {
    skills: Skill[];
    onUpdateProgress: (skillId: string, subSkillId: string) => void;
    onAddSubSkill: (skillId: string, name: string) => void;
    onDeleteSubSkill: (skillId: string, subSkillId: string) => void;
    onDeleteSkill: (skillId: string) => void;
    onUpdateSkill: (skillId: string, updates: Partial<Skill>) => void;
}

const SkillCard = ({
    skill,
    onUpdateProgress,
    onAddSubSkill,
    onDeleteSubSkill,
    onDeleteSkill,
    onUpdateSkill
}: {
    skill: Skill,
    onUpdateProgress: (sid: string, ssid: string) => void,
    onAddSubSkill: (sid: string, name: string) => void,
    onDeleteSubSkill: (sid: string, ssid: string) => void,
    onDeleteSkill: (sid: string) => void,
    onUpdateSkill: (sid: string, updates: Partial<Skill>) => void
}) => {
    const [newSub, setNewSub] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingSubId, setDeletingSubId] = useState<string | null>(null);
    const [editName, setEditName] = useState(skill.name);
    const [editCategory, setEditCategory] = useState(skill.category);

    const handleAddSub = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSub.trim()) {
            onAddSubSkill(skill.id, newSub);
            setNewSub('');
        }
    };

    const handleSaveEdit = () => {
        onUpdateSkill(skill.id, { name: editName, category: editCategory });
        setIsEditing(false);
    };

    return (
        <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '24px', border: isEditing ? '1px solid var(--primary)' : '1px solid var(--border-glass)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                autoFocus
                                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '6px 12px', color: 'var(--text-main)', fontSize: '18px', fontWeight: 700 }}
                                placeholder="Skill Name"
                            />
                            <input
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '4px 12px', color: 'var(--text-dim)', fontSize: '12px' }}
                                placeholder="Category"
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={handleSaveEdit} className="btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>Save</button>
                                <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'var(--text-main)', padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px', wordBreak: 'break-word' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: skill.color, flexShrink: 0, marginTop: '6px' }}></div>
                            {skill.name}
                        </h3>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!isEditing && (
                        <>
                            <span style={{ fontSize: '14px', color: 'var(--text-dim)', background: 'var(--bg-glass)', padding: '4px 12px', borderRadius: '20px' }}>
                                {skill.category}
                            </span>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                                title="Edit Skill"
                            >
                                <Plus size={16} />
                            </button>
                            {isDeleting ? (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: '#ef4444' }}>Delete?</span>
                                    <button
                                        onClick={() => onDeleteSkill(skill.id)}
                                        style={{ background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setIsDeleting(false)}
                                        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsDeleting(true)}
                                    style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.4)', cursor: 'pointer', transition: 'color 0.2s', padding: '4px' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.4)'}
                                    title="Delete Mastery Path"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {skill.subSkills.map(sub => (
                    <div
                        key={sub.id}
                        onClick={() => onUpdateProgress(skill.id, sub.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: sub.isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                            border: `1px solid ${sub.isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-glass)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                onClick={(e) => { e.stopPropagation(); onUpdateProgress(skill.id, sub.id); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            >
                                {sub.isCompleted ? <CheckCircle2 size={18} color="var(--accent)" /> : <Circle size={18} color="var(--text-dim)" />}
                                <span style={{ color: sub.isCompleted ? 'var(--text-dim)' : 'var(--text-main)', textDecoration: sub.isCompleted ? 'line-through' : 'none' }}>
                                    {sub.name}
                                </span>
                            </div>
                        </div>
                        {deletingSubId === sub.id ? (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteSubSkill(skill.id, sub.id); setDeletingSubId(null); }}
                                    style={{ background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeletingSubId(null); }}
                                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setDeletingSubId(sub.id); }}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', padding: '4px' }}
                                className="subskill-delete-btn"
                                title="Delete Unit"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}

                <form onSubmit={handleAddSub} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input
                        type="text"
                        value={newSub}
                        onChange={(e) => setNewSub(e.target.value)}
                        placeholder="Add new unit..."
                        style={{ flex: 1, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}
                    />
                    <button type="submit" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '8px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <Plus size={16} />
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-dim)' }}>
                <BookOpen size={14} />
                <span>{skill.subSkills.filter(s => s.isCompleted).length} of {skill.subSkills.length} units completed</span>
            </div>
        </motion.div>
    );
};

const SkillsView = ({ skills, onUpdateProgress, onAddSubSkill, onDeleteSubSkill, onDeleteSkill, onUpdateSkill }: Props) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
            {skills.map(skill => (
                <SkillCard
                    key={skill.id}
                    skill={skill}
                    onUpdateProgress={onUpdateProgress}
                    onAddSubSkill={onAddSubSkill}
                    onDeleteSubSkill={onDeleteSubSkill}
                    onDeleteSkill={onDeleteSkill}
                    onUpdateSkill={onUpdateSkill}
                />
            ))}
        </div>
    );
};

export default SkillsView;
