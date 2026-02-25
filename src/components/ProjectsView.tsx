import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FolderGit2, Plus } from 'lucide-react';
import type { Project } from '../types';
import ProjectCard from './ProjectCard';
import AddProjectModal from './AddProjectModal';
import ProjectDetailModal from './ProjectDetailModal';

interface ProjectsViewProps {
    projects: Project[];
    onAddProject: (project: Omit<Project, 'id'>) => void;
    onDeleteProject: (id: string) => void;
    onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

const ProjectsView = ({ projects, onAddProject, onDeleteProject, onUpdateProject }: ProjectsViewProps) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FolderGit2 className="float" color="var(--primary)" />
                        Built Applications
                    </h2>
                    <p style={{ color: 'var(--text-dim)', marginTop: '8px' }}>
                        A showcase of the apps, tools, and platforms you've engineered.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary"
                >
                    <Plus size={18} /> Add Project
                </button>
            </div>

            {/* Grid Layout */}
            {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', border: '1px dashed var(--border-glass)', borderRadius: '24px', background: 'var(--bg-glass)' }}>
                    <FolderGit2 size={48} color="var(--text-dim)" style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>No projects documented yet</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Start building your portfolio by adding your first application.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    <AnimatePresence>
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onViewDetail={(p) => setSelectedProjectId(p.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modals */}
            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={onAddProject}
            />

            <ProjectDetailModal
                project={selectedProject}
                onClose={() => setSelectedProjectId(null)}
                onDelete={(id: string) => {
                    onDeleteProject(id);
                    setSelectedProjectId(null);
                }}
                onUpdate={onUpdateProject}
            />
        </div>
    );
};

export default ProjectsView;
