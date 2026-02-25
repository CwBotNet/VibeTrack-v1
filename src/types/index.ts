export interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    color: string;
    subSkills: SubSkill[];
}

export interface SubSkill {
    id: string;
    name: string;
    isCompleted: boolean;
}

export interface ProgressLog {
    id: string;
    date: string;
    skillId: string;
    subSkillId?: string;
    notes: string;
}

export interface RoadmapMilestone {
    id: string;
    title: string;
    description: string;
    status: 'locked' | 'active' | 'completed';
    skills: string[];
}

export interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    githubUrl: string;
    techStack: string[];
    status: 'planning' | 'in-progress' | 'completed';
    tasks: ProjectTask[];
}

export interface ProjectTask {
    id: string;
    description: string;
    isCompleted: boolean;
}

export interface Award {
    id: string;
    title: string;
    description: string;
    gifUrl: string;
    date: string;
}
