import { motion } from 'framer-motion';
import { Github, Eye, ListTodo } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
    project: Project;
    onViewDetail: (project: Project) => void;
}

const ProjectCard = ({ project, onViewDetail }: ProjectCardProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card"
            style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            {/* Status Badge */}
            <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: project.status === 'completed' ? 'rgba(16, 185, 129, 0.9)' :
                    project.status === 'in-progress' ? 'rgba(245, 158, 11, 0.9)' :
                        'rgba(99, 102, 241, 0.9)',
                color: 'white',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                {project.status === 'completed' ? 'Completed' :
                    project.status === 'in-progress' ? 'In Progress' : 'Planning'}
            </div>

            {/* Image Section */}
            <div style={{
                height: '180px',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {project.imageUrl ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                        No Image Available
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                    {project.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.subtitle}
                </p>

                {/* Tech Stack Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {project.techStack.map((tech, index) => (
                        <span
                            key={index}
                            style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 500,
                                background: 'var(--bg-glass)',
                                color: 'var(--primary)',
                                border: '1px solid var(--border-glass)'
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Tasks Progress (if tasks exist) */}
                {project.tasks && project.tasks.length > 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: 'var(--text-dim)',
                        marginBottom: '20px',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '8px 12px',
                        borderRadius: '8px'
                    }}>
                        <ListTodo size={16} color="var(--primary)" />
                        <span>{project.tasks.filter(t => t.isCompleted).length} / {project.tasks.length} Tasks Completed</span>
                        <div style={{ flex: 1, height: '4px', background: 'var(--bg-dark)', borderRadius: '2px', overflow: 'hidden', marginLeft: '8px' }}>
                            <div style={{
                                height: '100%',
                                background: 'var(--primary)',
                                width: `${(project.tasks.filter(t => t.isCompleted).length / project.tasks.length) * 100}%`
                            }}></div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => onViewDetail(project)}
                        className="btn-primary"
                        style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                    >
                        <Eye size={16} /> View Details
                    </button>
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '10px',
                                borderRadius: '12px',
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-glass)',
                                color: 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = 'var(--primary)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'var(--bg-glass)';
                                e.currentTarget.style.color = 'var(--text-main)';
                            }}
                        >
                            <Github size={18} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
