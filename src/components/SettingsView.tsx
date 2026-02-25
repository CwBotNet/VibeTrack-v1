import { User, Bell, Palette, Download, Upload, Trash2 } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    profile: { name: string; email: string };
    setProfile: (profile: { name: string; email: string }) => void;
    theme: string;
    setTheme: (theme: string) => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
    achievementsEnabled: boolean;
    setAchievementsEnabled: (enabled: boolean) => void;
    onImport: (data: any) => void;
    onWipeData: () => void;
    allData: any;
}

const SettingsView = ({
    profile,
    setProfile,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    achievementsEnabled,
    setAchievementsEnabled,
    onImport,
    onWipeData,
    allData
}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vibetrack-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                onImport(json);
                alert('Data imported successfully!');
            } catch (err) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ maxWidth: '900px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>System Configuration</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <section className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '18px' }}>
                        <User size={20} color="var(--primary)" /> Profile
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>Display Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                            />
                        </div>
                    </div>
                </section>

                <section className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '18px' }}>
                        <Palette size={20} color="var(--secondary)" /> Customization
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Theme Mode</span>
                            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-glass)', padding: '4px', borderRadius: '8px' }}>
                                <button
                                    onClick={() => setTheme('dark')}
                                    style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: theme === 'dark' ? 'var(--primary)' : 'transparent', color: theme === 'dark' ? '#ffffff' : 'var(--text-dim)', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    Dark
                                </button>
                                <button
                                    onClick={() => setTheme('light')}
                                    style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: theme === 'light' ? 'var(--primary)' : 'transparent', color: theme === 'light' ? '#ffffff' : 'var(--text-dim)', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    Light
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Accent Color</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[
                                    { color: '#6366f1', name: 'Indigo' },
                                    { color: '#a855f7', name: 'Purple' },
                                    { color: '#10b981', name: 'Emerald' },
                                    { color: '#f59e0b', name: 'Amber' },
                                    { color: '#ec4899', name: 'Pink' }
                                ].map((c) => (
                                    <div
                                        key={c.color}
                                        onClick={() => setAccentColor(c.color)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: c.color,
                                            cursor: 'pointer',
                                            border: accentColor === c.color ? '2px solid var(--text-main)' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                        title={c.name}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '18px' }}>
                        <Bell size={20} color="var(--accent)" /> System Preference
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 600 }}>Ghibli Achievement System</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Show magical rewards when you complete tasks.</p>
                            </div>
                            <div
                                onClick={() => setAchievementsEnabled(!achievementsEnabled)}
                                style={{
                                    width: '44px',
                                    height: '24px',
                                    borderRadius: '12px',
                                    background: achievementsEnabled ? 'var(--primary)' : 'var(--bg-glass)',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    position: 'absolute',
                                    top: '3px',
                                    left: achievementsEnabled ? '23px' : '3px',
                                    transition: 'left 0.3s'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Data Management</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleExport}
                            className="btn-glass"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
                        >
                            <Download size={18} /> Export Data
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-glass"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
                        >
                            <Upload size={18} /> Import Data
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".json"
                            style={{ display: 'none' }}
                        />
                    </div>
                </section>

                <section className="glass-card" style={{ padding: '24px', gridColumn: '1 / -1', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '18px', color: '#ef4444' }}>
                        <Trash2 size={20} /> Danger Zone
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 600 }}>Reset Application Data</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>This will wipe all your progress, skills, and roadmaps. Cannot be undone.</p>
                        </div>
                        <button
                            onClick={onWipeData}
                            style={{ padding: '10px 20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Wipe All Data
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsView;
