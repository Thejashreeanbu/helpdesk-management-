import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReportStats } from '../reportsSlice';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Calendar, Filter, Users, Ticket, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';

// Neon Color Palette
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
const SLA_COLORS = ['#ef4444', '#10b981']; // Red for Breached, Green for Met

const ReportsDashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.reports);
    const [dateRange, setDateRange] = useState('30');

    useEffect(() => {
        const endDate = new Date().toISOString();
        let startDate = null;

        if (dateRange !== 'all') {
            const d = new Date();
            d.setDate(d.getDate() - parseInt(dateRange));
            startDate = d.toISOString();
        }

        dispatch(getReportStats({ startDate, endDate }));
    }, [dispatch, dateRange]);

    if (isLoading && !stats) return <div className="p-8 text-center text-primary animate-pulse font-mono">LOADING ANALYTICS MODULE...</div>;
    if (!stats) return null;

    // Data Preparation
    const statusData = stats.statusDistribution.map(item => ({ name: item._id, value: item.count }));
    const priorityData = stats.priorityDistribution.map(item => ({ name: item._id, value: item.count }));
    const slaData = [
        { name: 'Breached', value: stats.slaStats.breached },
        { name: 'Met', value: stats.slaStats.met }
    ];

    const totalTickets = statusData.reduce((acc, curr) => acc + curr.value, 0);

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel p-3 border border-white/10 rounded-lg shadow-xl">
                    <p className="text-white font-bold text-sm mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-xs font-mono">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                        <Activity className="mr-3 text-primary" /> Reports & Analytics
                    </h1>
                </div>

                <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-3">
                    <Calendar size={18} className="text-primary" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-white cursor-pointer outline-none uppercase tracking-wider"
                    >
                        <option value="7" className="bg-slate-900">Last 7 Days</option>
                        <option value="30" className="bg-slate-900">Last 30 Days</option>
                        <option value="90" className="bg-slate-900">Last 3 Months</option>
                        <option value="all" className="bg-slate-900">All Time</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-6 border-l-4 border-l-primary relative overflow-hidden group hover:border-l-primary/80 transition-all">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Ticket size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2">Total Tickets</div>
                        <div className="text-4xl font-bold text-white">{totalTickets}</div>
                        <div className="mt-2 text-xs text-primary flex items-center">
                            <TrendingUp size={12} className="mr-1" /> New Tickets
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-danger relative overflow-hidden group hover:border-l-danger/80 transition-all">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <AlertTriangle size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2">SLA Breached</div>
                        <div className="text-4xl font-bold text-white">{stats.slaStats.breached}</div>
                        <div className="mt-2 text-xs text-danger font-bold bg-danger/10 py-1 px-2 rounded-full inline-block">
                            {totalTickets ? ((stats.slaStats.breached / totalTickets) * 100).toFixed(1) : 0}% Breach Rate
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-success relative overflow-hidden group hover:border-l-success/80 transition-all">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <CheckCircle size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2">SLA Met</div>
                        <div className="text-4xl font-bold text-white">{stats.slaStats.met}</div>
                        <div className="mt-2 text-xs text-success flex items-center">
                            Compliance Rate
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-secondary relative overflow-hidden group hover:border-l-secondary/80 transition-all">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Users size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2">Active Agents</div>
                        <div className="text-4xl font-bold text-white">{stats.agentPerformance.length}</div>
                        <div className="mt-2 text-xs text-secondary flex items-center">
                            Active Agents
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution - Pie Chart */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Ticket Status Distribution</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Distribution - Bar Chart */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Tickets by Priority</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Tickets" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume over time - Area Chart */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Ticket Volume (Daily)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.volumeOverTime}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="_id" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SLA - Pie Chart */}
                <div className="glass-panel p-6 rounded-2xl relative">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">SLA Compliance</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={slaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {slaData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={SLA_COLORS[index % SLA_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-6">
                            <div className="text-3xl font-bold text-white drop-shadow-lg">
                                {totalTickets ? ((stats.slaStats.met / totalTickets) * 100).toFixed(0) : 0}%
                            </div>
                            <div className="text-xs text-text-muted uppercase tracking-widest">Compliance</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Performance Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Agent Performance Board</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-text-muted uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Agent Name</th>
                                <th className="px-6 py-4 text-center">Assigned</th>
                                <th className="px-6 py-4 text-center">Resolved</th>
                                <th className="px-6 py-4 text-center">Resolution Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.agentPerformance.map((agent, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{agent.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-blue-500/20 text-blue-400 py-1 px-3 rounded-lg text-xs font-bold">{agent.totalAssigned}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-emerald-500/20 text-emerald-400 py-1 px-3 rounded-lg text-xs font-bold">{agent.resolved}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="w-full bg-white/10 rounded-full h-2 max-w-[100px] mx-auto overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                                                style={{ width: `${agent.totalAssigned ? (agent.resolved / agent.totalAssigned) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-text-muted mt-1 font-mono">
                                            {agent.totalAssigned ? ((agent.resolved / agent.totalAssigned) * 100).toFixed(0) : 0}%
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {stats.agentPerformance.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-text-muted italic">No agent data available for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
