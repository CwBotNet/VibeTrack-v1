import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabase';
import { INITIAL_SKILLS, ROADMAP, INITIAL_PROJECTS } from '../constants/data';
import {
    BarChart3,
    Layout,
    Cpu,
    Globe,
    TrendingUp,
    Award as TrophyIcon,
    Search,
    Zap,
    Calendar,
    MessageSquare,
    FolderGit2,
    Edit2,
    Trash2,
    Save,
    X
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

import type { Skill, ProgressLog, RoadmapMilestone, Project, Award } from '../types';
import SkillsView from '../components/SkillsView';
import RoadmapView from '../components/RoadmapView';
import SettingsView from '../components/SettingsView';
import AddProgressModal from '../components/AddProgressModal';
import AddSkillModal from '../components/AddSkillModal';
import AddRoadmapModal from '../components/AddRoadmapModal';
import ProjectsView from '../components/ProjectsView';
import AwardsView from '../components/AwardsView';
import AchievementPopup from '../components/AchievementPopup';

// Anime Character Assets
import astaImg from '../assets/achievements/asta.png';
import narutoImg from '../assets/achievements/naruto.png';
import luffyImg from '../assets/achievements/luffy.png';
import shadowImg from '../assets/achievements/shadow.png';
import totoroImg from '../assets/achievements/totoro.png';
import castleImg from '../assets/achievements/castle.png';

const ANIME_ACHIEVEMENTS = [
    astaImg,
    narutoImg,
    luffyImg,
    shadowImg,
    totoroImg,
    castleImg
];

// Removed broken external URLs


const Dashboard = ({ session }: { session: any }) => {
    const user = session?.user;
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Overview');

    const [skills, setSkills] = useState<Skill[]>([]);
    const [logs, setLogs] = useState<ProgressLog[]>([]);
    const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [awards, setAwards] = useState<Award[]>([]);
    const [currentAward, setCurrentAward] = useState<Award | null>(null);

    // Logging Edit State
    const [editingLogId, setEditingLogId] = useState<string | null>(null);
    const [editLogNotes, setEditLogNotes] = useState('');

    // Settings State
    const [profile, setProfile] = useState({ name: 'Track Developer', email: 'dev@vibetrack.io' });
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('#6366f1');
    const [achievementsEnabled, setAchievementsEnabled] = useState(true);

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Persistence wrappers for settings
    const updateProfile = async (updates: Partial<typeof profile>) => {
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        await supabase.from('profiles').upsert({
            id: user.id,
            full_name: newProfile.name,
            email: newProfile.email,
            theme,
            accent_color: accentColor,
            achievements_enabled: achievementsEnabled
        });
    };

    const updateTheme = async (newTheme: string) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        await supabase.from('profiles').update({ theme: newTheme }).eq('id', user.id);
    };

    const updateAccentColor = async (color: string) => {
        setAccentColor(color);
        document.documentElement.style.setProperty('--primary', color);
        await supabase.from('profiles').update({ accent_color: color }).eq('id', user.id);
    };

    const updateAchievements = async (enabled: boolean) => {
        setAchievementsEnabled(enabled);
        await supabase.from('profiles').update({ achievements_enabled: enabled }).eq('id', user.id);
    };

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user) return;

            try {
                // Fetch Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    console.log('Profile loaded:', profileData.full_name);
                    setProfile({ name: profileData.full_name || 'Vibe Developer', email: user.email || '' });
                    setTheme(profileData.theme || 'dark');
                    setAccentColor(profileData.accent_color || '#6366f1');
                    setAchievementsEnabled(profileData.achievements_enabled);
                    document.documentElement.setAttribute('data-theme', profileData.theme || 'dark');
                    document.documentElement.style.setProperty('--primary', profileData.accent_color || '#6366f1');
                }

                // Fetch other data
                console.log('Fetching dashboard data for user:', user.id);
                const [skillsRes, logsRes, milestonesRes, projectsRes, awardsRes] = await Promise.all([
                    supabase.from('skills').select('*').eq('user_id', user.id),
                    supabase.from('progress_logs').select('*').eq('user_id', user.id),
                    supabase.from('roadmap_milestones').select('*').eq('user_id', user.id),
                    supabase.from('projects').select('*').eq('user_id', user.id),
                    supabase.from('awards').select('*').eq('user_id', user.id)
                ]);

                // Auto-migration check
                const hasMigrated = localStorage.getItem('vibetrak_migrated');
                const hasLocalData = localStorage.getItem('vibetrak_skills') || localStorage.getItem('vibetrak_projects');

                console.log('Migration check:', { hasMigrated, hasLocalData, skillsInDB: skillsRes.data?.length });

                if (!hasMigrated && hasLocalData && (!skillsRes.data || skillsRes.data.length === 0)) {
                    await handleMigration();
                } else {
                    if (skillsRes.data && skillsRes.data.length > 0) {
                        setSkills(skillsRes.data.map(s => ({ ...s, subSkills: s.sub_skills })));
                    } else if (!hasLocalData && (!skillsRes.data || skillsRes.data.length === 0)) {
                        // First-time load: seed database with initial mockup
                        console.log('No data found, seeding database with initial state');
                        await seedDatabase();
                        return; // Halt and reload once seeded
                    }

                    if (logsRes.data) setLogs(logsRes.data.map(l => ({ ...l, skillId: l.skill_id, subSkillId: l.sub_skill_id })));
                    if (milestonesRes.data && milestonesRes.data.length > 0) setMilestones(milestonesRes.data.map(m => ({ ...m, skills: m.skills })));
                    if (projectsRes.data && projectsRes.data.length > 0) setProjects(projectsRes.data.map(p => ({ ...p, imageUrl: p.image_url, githubUrl: p.github_url, techStack: p.tech_stack, tasks: p.tasks })));
                    if (awardsRes.data) setAwards(awardsRes.data.map(a => ({ ...a, gifUrl: a.gif_url })));
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        const seedDatabase = async () => {
            console.log('Seeding initial data into Supabase...');
            setLoading(true);
            try {
                // Insert Profile just in case
                await supabase.from('profiles').upsert({
                    id: user.id,
                    full_name: profile.name,
                    theme: theme,
                    accent_color: accentColor,
                    achievements_enabled: achievementsEnabled
                });

                // Prepare Data
                const skillsToInsert = INITIAL_SKILLS.map((s: any) => ({
                    user_id: user.id,
                    name: s.name,
                    category: s.category,
                    level: s.level,
                    color: s.color,
                    sub_skills: s.subSkills
                }));
                const milestonesToInsert = ROADMAP.map((m: any) => ({
                    user_id: user.id,
                    title: m.title,
                    description: m.description,
                    status: m.status,
                    skills: m.skills
                }));
                const projectsToInsert = INITIAL_PROJECTS.map((p: any) => ({
                    user_id: user.id,
                    title: p.title,
                    subtitle: p.subtitle,
                    description: p.description,
                    image_url: p.imageUrl,
                    github_url: p.githubUrl,
                    tech_stack: p.techStack,
                    status: p.status,
                    tasks: p.tasks
                }));

                // Execute Inserts sequentially to avoid lock issues
                await supabase.from('skills').insert(skillsToInsert);
                await supabase.from('roadmap_milestones').insert(milestonesToInsert);
                await supabase.from('projects').insert(projectsToInsert);

                window.location.reload();
            } catch (err) {
                console.error('Failed to seed:', err);
            }
        };

        const handleMigration = async () => {
            console.log('Initiating one-time data migration to Supabase...');
            const localSkills = JSON.parse(localStorage.getItem('vibetrak_skills') || '[]');

            // Insert Profile
            await supabase.from('profiles').upsert({
                id: user.id,
                full_name: profile.name,
                theme: theme,
                accent_color: accentColor,
                achievements_enabled: achievementsEnabled
            });

            // Insert Skills
            if (localSkills.length > 0) {
                await supabase.from('skills').insert(localSkills.map((s: any) => ({
                    user_id: user.id,
                    name: s.name,
                    category: s.category,
                    level: s.level,
                    color: s.color,
                    sub_skills: s.subSkills
                })));
            }

            localStorage.setItem('vibetrak_migrated', 'true');
            window.location.reload();
        };

        fetchAllData();
    }, [user]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    // Skills -> Roadmap Sync
    useEffect(() => {
        const updatedMilestones = milestones.map((milestone: RoadmapMilestone) => {
            if (milestone.status === 'completed') return milestone;

            const requiredSkills = milestone.skills;
            if (requiredSkills.length === 0) return milestone;

            const allSkillsCompleted = requiredSkills.every((reqSkillName: string) => {
                const skill = skills.find(s => s.name.toLowerCase() === reqSkillName.toLowerCase());
                return skill && skill.level === 100;
            });

            if (allSkillsCompleted) {
                return { ...milestone, status: 'completed' as const };
            }
            return milestone;
        });

        const hasChanged = JSON.stringify(updatedMilestones) !== JSON.stringify(milestones);
        if (hasChanged) {
            setMilestones(updatedMilestones);
        }
    }, [skills, milestones]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
                <div className="float">
                    <Zap size={48} color="var(--primary)" />
                </div>
            </div>
        );
    }

    const handleAddSkill = async (name: string, category: string) => {
        const newSkillData = {
            user_id: user.id,
            name,
            category,
            level: 0,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            sub_skills: []
        };

        const { data, error } = await supabase
            .from('skills')
            .insert(newSkillData)
            .select()
            .single();

        if (error) {
            console.error('Error adding skill:', error);
            return;
        }

        if (data) {
            setSkills(prev => [...prev, { ...data, subSkills: data.sub_skills }]);
        }
    };

    const handleUpdateSkill = async (skillId: string, updates: Partial<Skill>) => {
        const fieldsToUpdate: any = {};
        if (updates.name !== undefined) fieldsToUpdate.name = updates.name;
        if (updates.category !== undefined) fieldsToUpdate.category = updates.category;
        if (updates.color !== undefined) fieldsToUpdate.color = updates.color;
        if (updates.level !== undefined) fieldsToUpdate.level = updates.level;
        if (updates.subSkills !== undefined) fieldsToUpdate.sub_skills = updates.subSkills;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(skillId);

        if (isUUID) {
            const { error } = await supabase
                .from('skills')
                .update(fieldsToUpdate)
                .eq('id', skillId);

            if (error) {
                console.error('Error updating skill:', error);
                return;
            }
        }

        setSkills(prev => prev.map(s => s.id === skillId ? { ...s, ...updates } : s));
    };

    const handleAddSubSkill = async (skillId: string, name: string) => {
        const skill = skills.find(s => s.id === skillId);
        if (!skill) return;

        const newSub = { id: Date.now().toString(), name, isCompleted: false };
        const newSubSkills = [...skill.subSkills, newSub];
        const completedCount = newSubSkills.filter(s => s.isCompleted).length;
        const newLevel = newSubSkills.length > 0 ? Math.round((completedCount / newSubSkills.length) * 100) : 0;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(skillId);

        if (isUUID) {
            const { error } = await supabase
                .from('skills')
                .update({
                    sub_skills: newSubSkills,
                    level: newLevel
                })
                .eq('id', skillId);

            if (error) {
                console.error('Error adding sub-skill:', error);
                return;
            }
        }

        setSkills(prev => prev.map(s => s.id === skillId ? { ...s, subSkills: newSubSkills, level: newLevel } : s));
    };

    const triggerReward = (title: string, description: string) => {
        if (!achievementsEnabled) return;
        const gif = ANIME_ACHIEVEMENTS[Math.floor(Math.random() * ANIME_ACHIEVEMENTS.length)];
        const newAward: Award = {
            id: Date.now().toString(),
            title,
            description,
            gifUrl: gif,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setAwards(prev => [newAward, ...prev]);
        setCurrentAward(newAward);
    };

    const toggleSubSkill = async (skillId: string, subSkillId: string) => {
        const skill = skills.find(s => s.id === skillId);
        if (!skill) return;

        const newSubSkills = skill.subSkills.map(sub => {
            if (sub.id !== subSkillId) return sub;
            const newCompleted = !sub.isCompleted;
            if (newCompleted) {
                triggerReward('Mastery Step!', `You've completed "${sub.name}" in ${skill.name}.`);
            }
            return { ...sub, isCompleted: newCompleted };
        });

        const completedCount = newSubSkills.filter(s => s.isCompleted).length;
        const newLevel = newSubSkills.length > 0 ? Math.round((completedCount / newSubSkills.length) * 100) : 0;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(skillId);

        if (isUUID) {
            const { error } = await supabase
                .from('skills')
                .update({
                    sub_skills: newSubSkills,
                    level: newLevel
                })
                .eq('id', skillId);

            if (error) {
                console.error('Error toggling sub-skill:', error);
                return;
            }
        }

        setSkills(prev => prev.map(s => s.id === skillId ? { ...s, subSkills: newSubSkills, level: newLevel } : s));
    };

    const handleDeleteSubSkill = async (skillId: string, subSkillId: string) => {
        const skill = skills.find(s => s.id === skillId);
        if (!skill) return;

        const updatedSubSkills = skill.subSkills.filter(ss => ss.id !== subSkillId);
        await handleUpdateSkill(skillId, { subSkills: updatedSubSkills });
    };

    const handleDeleteSkill = async (skillId: string) => {
        // Only attempt DB deletion if it's a valid UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(skillId);

        if (isUUID) {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('id', skillId);

            if (error) {
                console.error('Error deleting skill:', error);
                return;
            }
        }

        setSkills(prev => prev.filter(s => s.id !== skillId));
        setLogs(prev => prev.filter(l => l.skillId !== skillId));
    };

    const handleAddLog = async (newLogEntry: { skillId: string; subSkillId: string; notes: string; duration: number }) => {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newLogEntry.skillId);

        let savedData;

        if (isUUID) {
            const logData = {
                user_id: user.id,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                skill_id: newLogEntry.skillId,
                sub_skill_id: newLogEntry.subSkillId,
                notes: newLogEntry.notes,
                duration: newLogEntry.duration
            };

            const { data, error } = await supabase
                .from('progress_logs')
                .insert(logData)
                .select()
                .single();

            if (error) {
                console.error('Error adding progress log:', error);
                return;
            }
            savedData = data;
        } else {
            // Local mockup simulation
            savedData = {
                id: Date.now().toString(),
                user_id: user.id,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                skill_id: newLogEntry.skillId,
                sub_skill_id: newLogEntry.subSkillId,
                notes: newLogEntry.notes,
                duration: newLogEntry.duration
            };
        }

        if (savedData) {
            const newLog = {
                ...savedData,
                skillId: savedData.skill_id,
                subSkillId: savedData.sub_skill_id
            };
            setLogs(prev => [newLog, ...prev]);

            const skill = skills.find(s => s.id === newLogEntry.skillId);
            const subSkill = skill?.subSkills.find(ss => ss.id === newLogEntry.subSkillId);
            if (subSkill && !subSkill.isCompleted) {
                toggleSubSkill(newLogEntry.skillId, newLogEntry.subSkillId);
            }
        }
    };

    const handleDeleteLog = async (id: string) => {
        if (!window.confirm('Delete this progress log?')) return;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUUID) {
            const { error } = await supabase.from('progress_logs').delete().eq('id', id);
            if (error) console.error('Error deleting log:', error);
        }
        setLogs(prev => prev.filter(l => l.id !== id));
    };

    const handleUpdateLog = async (id: string) => {
        if (!editLogNotes.trim()) return;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUUID) {
            const { error } = await supabase.from('progress_logs').update({ notes: editLogNotes }).eq('id', id);
            if (error) console.error('Error updating log:', error);
        }
        setLogs(prev => prev.map(l => l.id === id ? { ...l, notes: editLogNotes } : l));
        setEditingLogId(null);
        setEditLogNotes('');
    };

    const handleAddMilestone = async (title: string, description: string, reqSkills: string[]) => {
        const newMilestoneData = {
            user_id: user.id,
            title,
            description,
            status: 'locked' as const,
            skills: reqSkills
        };

        const { data, error } = await supabase
            .from('roadmap_milestones')
            .insert(newMilestoneData)
            .select()
            .single();

        if (error) {
            console.error('Error adding milestone:', error);
            return;
        }

        if (data) {
            setMilestones(prev => [...prev, data]);
        }
    };

    const handleDeleteMilestone = async (id: string) => {
        // Only attempt DB deletion if it's a valid UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (isUUID) {
            const { error } = await supabase
                .from('roadmap_milestones')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting milestone:', error);
                return;
            }
        }

        setMilestones(prev => prev.filter(m => m.id !== id));
    };

    const handleWipeData = async () => {
        if (!window.confirm('ARE YOU ABSOLUTELY SURE? This will permanently delete ALL your progress from the database. This action CANNOT be undone.')) return;

        setLoading(true);
        try {
            await Promise.all([
                supabase.from('skills').delete().eq('user_id', user.id),
                supabase.from('progress_logs').delete().eq('user_id', user.id),
                supabase.from('roadmap_milestones').delete().eq('user_id', user.id),
                supabase.from('projects').delete().eq('user_id', user.id),
                supabase.from('awards').delete().eq('user_id', user.id)
            ]);

            // Also reset local state
            setSkills([]);
            setLogs([]);
            setMilestones([]);
            setProjects([]);
            setAwards([]);

            alert('All data has been wiped from the database.');
            window.location.reload();
        } catch (error) {
            console.error('Error wiping data:', error);
            alert('Failed to wipe some data. Please check console.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMilestoneStatus = async (id: string) => {
        const milestone = milestones.find(m => m.id === id);
        if (!milestone) return;

        const statusOrder: ('locked' | 'active' | 'completed')[] = ['locked', 'active', 'completed'];
        const currentIndex = statusOrder.indexOf(milestone.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIndex];

        if (nextStatus === 'completed' && milestone.skills.length > 0) {
            const allSkillsCompleted = milestone.skills.every((reqSkillName: string) => {
                const skill = skills.find(s => s.name.toLowerCase() === reqSkillName.toLowerCase());
                return skill && skill.level === 100;
            });
            if (!allSkillsCompleted) {
                alert(`To complete "${milestone.title}", you must first master the required skills.`);
                return;
            }
        }

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (isUUID) {
            const { error } = await supabase
                .from('roadmap_milestones')
                .update({ status: nextStatus })
                .eq('id', id);

            if (error) {
                console.error('Error updating milestone status:', error);
                return;
            }
        }

        if (nextStatus === 'completed') {
            triggerReward('Milestone Cleared!', `Incredible work! You've reached the milestone: ${milestone.title}`);
        }

        setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    };

    const handleUpdateMilestone = async (id: string, updates: Partial<RoadmapMilestone>) => {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (isUUID) {
            const { error } = await supabase
                .from('roadmap_milestones')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('Error updating milestone:', error);
                return;
            }
        }

        setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleContinueLearning = (milestone: RoadmapMilestone) => {
        setActiveTab('Skills');
        console.log(`Continuing learning for milestone: ${milestone.title}`);
    };

    const handleAddProject = async (newProject: Omit<Project, 'id'>) => {
        const projectData = {
            user_id: user.id,
            title: newProject.title,
            subtitle: newProject.subtitle,
            description: newProject.description,
            image_url: newProject.imageUrl,
            github_url: newProject.githubUrl,
            tech_stack: newProject.techStack,
            status: newProject.status,
            tasks: newProject.tasks
        };

        const { data, error } = await supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single();

        if (error) {
            console.error('Error adding project:', error);
            return;
        }

        if (data) {
            setProjects(prev => [...prev, { ...data, imageUrl: data.image_url, githubUrl: data.github_url, techStack: data.tech_stack }]);
        }
    };

    const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const supabaseUpdates: any = { ...updates };
        if (updates.imageUrl) supabaseUpdates.image_url = updates.imageUrl;
        if (updates.githubUrl) supabaseUpdates.github_url = updates.githubUrl;
        if (updates.techStack) supabaseUpdates.tech_stack = updates.techStack;

        if (isUUID) {
            const { error } = await supabase
                .from('projects')
                .update(supabaseUpdates)
                .eq('id', id);

            if (error) {
                console.error('Error updating project:', error);
                return;
            }
        }

        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const handleDeleteProject = async (id: string) => {
        // Only attempt DB deletion if it's a valid UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (isUUID) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting project:', error);
                return;
            }
        }

        setProjects(prev => prev.filter(p => p.id !== id));
    };

    // Filtered Content
    const filteredSkills = skills.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredMilestones = milestones.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredLogs = logs.filter(l => {
        const skill = skills.find(s => s.id === l.skillId);
        const subSkill = skill?.subSkills.find(ss => ss.id === l.subSkillId);
        return l.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subSkill?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Stats Calculation
    const totalStudyTimeMinutes = logs.reduce((acc, log: any) => acc + (log.duration || 0), 0);
    const totalStudyTime = `${Math.floor(totalStudyTimeMinutes / 60)}h ${totalStudyTimeMinutes % 60}m`;

    // Calculate Weekly Velocity and Chart Data
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    });

    const chartData = last7Days.map(dateStr => {
        const dayLogs = logs.filter(l => l.date === dateStr);
        const totalMinutes = dayLogs.reduce((acc, l: any) => acc + (l.duration || 0), 0);
        return {
            name: dateStr.split(',')[0],
            hours: Number((totalMinutes / 60).toFixed(1))
        };
    });

    const calculateVelocity = () => {
        const currentWeekMins = logs.filter(l => {
            const logDate = new Date(l.date);
            const diff = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
            return diff <= 7;
        }).reduce((acc, l: any) => acc + (l.duration || 0), 0);

        const lastWeekMins = logs.filter(l => {
            const logDate = new Date(l.date);
            const diff = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
            return diff > 7 && diff <= 14;
        }).reduce((acc, l: any) => acc + (l.duration || 0), 0);

        if (lastWeekMins === 0) return currentWeekMins > 0 ? "+100%" : "0%";
        const vel = ((currentWeekMins - lastWeekMins) / lastWeekMins) * 100;
        return `${vel > 0 ? '+' : ''}${Math.round(vel)}%`;
    };

    const weeklyVelocity = calculateVelocity();

    const calculateStreak = () => {
        const logDates = new Set(logs.map(l => l.date));
        let streak = 0;
        const checkDate = new Date();

        while (true) {
            const dateStr = checkDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (logDates.has(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // Allow for today's log to be missing if there was a log yesterday
                if (streak === 0) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    const yesterdayStr = checkDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    if (logDates.has(yesterdayStr)) {
                        checkDate.setDate(checkDate.getDate()); // stay on yesterday to continue loop
                        continue;
                    }
                }
                break;
            }
        }
        return `${streak} Days`;
    };

    const activeStreak = calculateStreak();

    const totalSubSkills = skills.reduce((acc, s) => acc + s.subSkills.length, 0);
    const completedSubSkills = skills.reduce((acc, s) => acc + s.subSkills.filter(ss => ss.isCompleted).length, 0);
    const learningUnits = `${completedSubSkills}/${totalSubSkills}`;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', position: 'relative' }}>
            {/* Mobile Hamburger */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                style={{
                    position: 'fixed',
                    top: '24px',
                    left: '20px',
                    zIndex: 50,
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                }}
                className="md-hidden"
            >
                <Layout size={20} />
            </button>

            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ width: '280px', borderRight: '1px solid var(--border-glass)', padding: '24px 20px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', background: 'var(--bg-sidebar)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 800 }}>
                        <Zap size={24} fill="var(--primary)" color="var(--primary)" />
                        <span>VIBE<span style={{ color: 'var(--primary)' }}>TRACK</span></span>
                        <span style={{ fontSize: '9px', background: 'var(--primary)', color: 'white', padding: '1px 5px', borderRadius: '10px', marginLeft: '4px' }}>BETA</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md-hidden"
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                        <Zap size={20} style={{ transform: 'rotate(90deg)', opacity: 0.5 }} /> {/* Using Zap as a placeholder or replace with X */}
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { name: 'Overview', icon: <BarChart3 size={18} /> },
                        { name: 'Skills', icon: <Globe size={18} /> },
                        { name: 'Roadmap', icon: <Layout size={18} /> },
                        { name: 'Projects', icon: <FolderGit2 size={18} /> },
                        { name: 'Awards', icon: <TrophyIcon size={18} /> },
                        { name: 'Settings', icon: <Cpu size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => {
                                setActiveTab(tab.name);
                                if (window.innerWidth <= 768) setIsSidebarOpen(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === tab.name ? 'var(--bg-glass)' : 'transparent',
                                color: activeTab === tab.name ? 'var(--text-sidebar-active)' : 'var(--text-dim)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}

                    <button
                        onClick={handleSignOut}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'transparent',
                            color: '#ef4444',
                            cursor: 'pointer',
                            textAlign: 'left',
                            marginTop: 'auto',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Zap size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>

                <div style={{ marginTop: 'auto', padding: '20px', borderRadius: '16px', background: 'var(--grad-premium)', opacity: 0.9 }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>PRO TIP</p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Consistent logging boosts retention by 40%!</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ marginTop: '30px' }}> {/* Spacing for hamburger on mobile */}
                        <h1 style={{ fontSize: '32px', fontWeight: 700 }}>
                            {activeTab === 'Overview' && <>Welcome back, <span className="gradient-text">{(profile.name || 'Vibe Developer').split(' ')[0]}</span></>}
                            {activeTab === 'Skills' && <>Skill <span className="gradient-text">Inventory</span></>}
                            {activeTab === 'Roadmap' && <>Success <span className="gradient-text">Roadmap</span></>}
                            {activeTab === 'Projects' && <>Project <span className="gradient-text">Portfolio</span></>}
                            {activeTab === 'Awards' && <>Trophy <span className="gradient-text">Case</span></>}
                            {activeTab === 'Settings' && <>System <span className="gradient-text">Configuration</span></>}
                        </h1>
                        <p style={{ color: 'var(--text-dim)' }}>
                            {activeTab === 'Overview' && "Visualizing your growth through the matrix."}
                            {activeTab === 'Skills' && "Drill down into specific units of mastery."}
                            {activeTab === 'Roadmap' && "Phase-by-phase journey to seniority."}
                            {activeTab === 'Projects' && "Track and showcase the applications you've built."}
                            {activeTab === 'Awards' && "A collection of your Studio Ghibli achievements."}
                            {activeTab === 'Settings' && "Tailor your VibeTrack preferences and notification triggers."}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {activeTab === 'Skills' && <AddSkillModal onAdd={handleAddSkill} />}
                        {activeTab === 'Roadmap' && <AddRoadmapModal onAdd={handleAddMilestone} />}
                        <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Search size={18} color="var(--text-dim)" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', width: '200px' }}
                            />
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'Overview' && (
                            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                                <div style={{ gridColumn: 'span 2', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                    {[
                                        { label: 'Total Study Time', value: totalStudyTime, icon: <Calendar color="var(--primary)" /> },
                                        { label: 'Weekly Velocity', value: weeklyVelocity, icon: <TrendingUp color="var(--accent)" /> },
                                        { label: 'Learning Units', value: learningUnits, icon: <TrophyIcon color="var(--secondary)" /> },
                                        { label: 'Active Streak', value: activeStreak, icon: <Zap color="#f59e0b" fill="#f59e0b" /> },
                                    ].map((item, i) => (
                                        <div key={i} className="glass-card" style={{ flex: 1, padding: '24px' }}>
                                            <div style={{ marginBottom: '16px' }}>{item.icon}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{item.label}</div>
                                            <div style={{ fontSize: '24px', fontWeight: 800 }}>{item.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="glass-card" style={{ padding: '32px' }}>
                                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Skill Velocity (Hours/Day)</h2>
                                    <div style={{ height: '300px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                                                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} />
                                                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-main)' }}
                                                    itemStyle={{ color: 'var(--text-main)' }}
                                                />
                                                <Area type="monotone" dataKey="hours" stroke="var(--primary)" fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '32px' }}>
                                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Recent Achievement Log</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {filteredLogs.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
                                                <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                                <p>No results found for "{searchQuery}"</p>
                                            </div>
                                        ) : (
                                            filteredLogs.slice(0, 5).map(log => (
                                                <div key={log.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                                    <div style={{ width: '2px', background: 'var(--primary)', position: 'absolute', left: '11px', top: '30px', bottom: '-10px', opacity: 0.3 }}></div>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: '4px solid var(--bg-dark)' }}>
                                                        <div style={{ width: '8px', height: '8px', background: 'var(--bg-dark)', borderRadius: '50%' }}></div>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>{log.date}</div>
                                                                <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '13px' }}>
                                                                    {skills.find(s => s.id === log.skillId)?.name}
                                                                    <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}> • {skills.find(s => s.id === log.skillId)?.subSkills.find(ss => ss.id === (log as any).sub_skill_id || ss.id === log.subSkillId)?.name}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                {editingLogId === log.id ? (
                                                                    <button onClick={() => handleUpdateLog(log.id)} style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer' }}><Save size={16} /></button>
                                                                ) : (
                                                                    <button onClick={() => { setEditingLogId(log.id); setEditLogNotes(log.notes); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                                )}
                                                                <button onClick={() => handleDeleteLog(log.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        </div>
                                                        {editingLogId === log.id ? (
                                                            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                                                <textarea
                                                                    value={editLogNotes}
                                                                    onChange={(e) => setEditLogNotes(e.target.value)}
                                                                    style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '13px', resize: 'vertical', minHeight: '60px' }}
                                                                />
                                                                <button onClick={() => setEditingLogId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', alignSelf: 'flex-start' }}><X size={16} /></button>
                                                            </div>
                                                        ) : (
                                                            <p style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '4px', fontStyle: 'italic', wordBreak: 'break-word' }}>"{log.notes}"</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Skills' && (
                            <SkillsView
                                skills={filteredSkills}
                                onUpdateProgress={toggleSubSkill}
                                onAddSubSkill={handleAddSubSkill}
                                onDeleteSubSkill={handleDeleteSubSkill}
                                onDeleteSkill={handleDeleteSkill}
                                onUpdateSkill={handleUpdateSkill}
                            />
                        )}
                        {activeTab === 'Roadmap' && (
                            <RoadmapView
                                milestones={filteredMilestones}
                                onDelete={handleDeleteMilestone}
                                onToggleStatus={handleToggleMilestoneStatus}
                                onUpdate={handleUpdateMilestone}
                                onContinueLearning={handleContinueLearning}
                            />
                        )}
                        {activeTab === 'Projects' && (
                            <ProjectsView
                                projects={filteredProjects}
                                onAddProject={handleAddProject}
                                onDeleteProject={handleDeleteProject}
                                onUpdateProject={handleUpdateProject}
                            />
                        )}
                        {activeTab === 'Awards' && <AwardsView awards={awards} />}
                        {activeTab === 'Settings' && (
                            <SettingsView
                                profile={profile}
                                setProfile={updateProfile}
                                theme={theme}
                                setTheme={updateTheme}
                                accentColor={accentColor}
                                setAccentColor={updateAccentColor}
                                achievementsEnabled={achievementsEnabled}
                                setAchievementsEnabled={updateAchievements}
                                onWipeData={handleWipeData}
                                onImport={(data: any) => {
                                    setSkills(data.skills || []);
                                    setLogs(data.logs || []);
                                    setMilestones(data.milestones || []);
                                    setProjects(data.projects || []);
                                    setAwards(data.awards || []);
                                    setProfile(data.profile || profile);
                                    setTheme(data.theme || theme);
                                    setAccentColor(data.accentColor || accentColor);
                                }}
                                allData={{ skills, logs, milestones, projects, awards, profile, theme, accentColor }}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                <AddProgressModal skills={skills} onAddLog={handleAddLog} />
                <AchievementPopup award={currentAward} onClose={() => setCurrentAward(null)} />
            </main >
        </div >
    );
};

export default Dashboard;
