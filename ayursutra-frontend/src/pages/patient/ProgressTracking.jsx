import { useState, Fragment, useMemo, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  XMarkIcon,
  ChartPieIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- MOCK DATA & CONFIG ---

const levelOptions = { 'Pain Level': ['Mild', 'Moderate', 'Severe'], 'Sleep Quality': ['Poor', 'Fair', 'Good', 'Excellent'], 'Stress Level': ['Low', 'Medium', 'High'], };
const levelToValue = { 'Pain Level': { Mild: 2, Moderate: 5, Severe: 8 }, 'Sleep Quality': { Poor: 2, Fair: 4, Good: 6, Excellent: 8 }, 'Stress Level': { Low: 2, Medium: 5, High: 8 }, };
const lineChartMetrics = ['Pain Level', 'Sleep Quality', 'Stress Level'];

const getDateAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

const initialRecentDataPoints = [
    { id: 13, date: getDateAgo(0), pain: 'Mild', sleep: 'Excellent', stress: 'Low', note: 'Feeling fantastic today, almost no issues.' },
    { id: 12, date: getDateAgo(1), pain: 'Mild', sleep: 'Good', stress: 'Low', note: 'A very calm and productive day.' },
    { id: 11, date: getDateAgo(2), pain: 'Moderate', sleep: 'Fair', stress: 'Medium', note: 'Slight setback today, feeling a bit stressed.' },
    { id: 10, date: getDateAgo(3), pain: 'Mild', sleep: 'Good', stress: 'Low', note: 'Back on track, feeling positive.' },
    { id: 9, date: getDateAgo(4), pain: 'Moderate', sleep: 'Good', stress: 'Medium', note: 'Pain was a little higher this morning.' },
    { id: 8, date: getDateAgo(5), pain: 'Moderate', sleep: 'Fair', stress: 'Medium', note: 'Didn\'t sleep as well, feeling a bit tired.' },
    { id: 7, date: getDateAgo(6), pain: 'Moderate', sleep: 'Good', stress: 'Medium', note: 'A stable day, nothing major to report.' },
    { id: 6, date: getDateAgo(7), pain: 'Severe', sleep: 'Poor', stress: 'High', note: 'Tough day. High pain and stress levels.' },
    { id: 5, date: getDateAgo(8), pain: 'Moderate', sleep: 'Fair', stress: 'Medium', note: 'Starting to feel a bit better after yesterday.' },
    { id: 4, date: getDateAgo(9), pain: 'Severe', sleep: 'Fair', stress: 'High', note: 'Work deadline was very stressful.' },
    { id: 3, date: getDateAgo(10), pain: 'Severe', sleep: 'Poor', stress: 'High', note: 'High pain, couldn\'t sleep well.' },
    { id: 2, date: getDateAgo(11), pain: 'Severe', sleep: 'Poor', stress: 'High', note: 'Second day of therapy, feeling tired.' },
    { id: 1, date: getDateAgo(12), pain: 'Severe', sleep: 'Poor', stress: 'High', note: 'First day, starting the therapy process.' },
].sort((a, b) => new Date(b.date) - new Date(a.date));


const panchakarmaTherapies = [ { name: 'Vamana', status: 'Completed' }, { name: 'Virechana', status: 'Completed' }, { name: 'Basti', status: 'Completed' }, { name: 'Nasya', status: 'In Progress' }, { name: 'Raktamokshana', status: 'Not Started' }, ];
const therapyStatusConfig = { 'Completed': { icon: CheckCircleIcon, color: 'text-emerald-500', value: 1 }, 'In Progress': { icon: ClockIcon, color: 'text-sky-500', value: 0.5 }, 'Not Started': { icon: CalendarIcon, color: 'text-slate-400 dark:text-slate-500', value: 0 }, };

const CustomLineChartTooltip = ({ active, payload, label }) => { if (active && payload && payload.length) { return ( <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"> <p className="font-semibold text-slate-900 dark:text-white">{label}</p> {payload[0].value !== null ? (<p className="text-emerald-600 dark:text-emerald-400">{`Rating: ${payload[0].payload.label}`}</p>) : (<p className="text-slate-400">No Data</p>)} </div> ); } return null; };


// --- MAIN COMPONENT ---
const ProgressTracking = () => {
  const [activeMetric, setActiveMetric] = useState('Pain Level');
  const [timeframe, setTimeframe] = useState('Monthly');
  const [dataPoints, setDataPoints] = useState(initialRecentDataPoints);
  
  // State for the modal visibility and the item being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();
  const handleOpenModal = (item) => {
    // Set a copy of the item to edit, so we don't change the original until we save
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  // This function now handles changes from any input inside the modal
  const handleEditChange = (field, value) => {
    if (editingItem) {
      setEditingItem(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDeleteItem = (id) => {
    setDataPoints(dataPoints.filter(item => item.id !== id));
  };
  
  const handleSaveItem = () => {
    if (editingItem) {
      const updatedPoints = dataPoints.map(item => item.id === editingItem.id ? editingItem : item);
      setDataPoints(updatedPoints.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    handleCloseModal();
  };

  const chartData = useMemo(() => {
    const now = new Date();
    const timeLimit = new Date();
    timeLimit.setDate(now.getDate() - (timeframe === 'Weekly' ? 7 : 30));

    const filteredPoints = dataPoints.filter(p => new Date(p.date) >= timeLimit);
    
    return filteredPoints.map(item => {
        let value, label;
        if (activeMetric === 'Pain Level') { [value, label] = [levelToValue[activeMetric][item.pain], item.pain]; }
        else if (activeMetric === 'Sleep Quality') { [value, label] = [levelToValue[activeMetric][item.sleep], item.sleep]; }
        else { [value, label] = [levelToValue[activeMetric][item.stress], item.stress]; }
        return { date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value, label, fullDate: new Date(item.date) };
    }).sort((a, b) => a.fullDate - b.fullDate);
  }, [dataPoints, timeframe, activeMetric]);

  const therapyProgress = useMemo(() => {
    const totalValue = panchakarmaTherapies.length;
    const completedValue = panchakarmaTherapies.reduce((sum, therapy) => sum + therapyStatusConfig[therapy.status].value, 0);
    return { percent: totalValue > 0 ? Math.round((completedValue / totalValue) * 100) : 0, data: [{ name: 'Completed', value: completedValue }, { name: 'Remaining', value: totalValue - completedValue }] };
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back 
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Progress Tracking</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Monitor your therapy progress and recovery milestones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={<ArrowTrendingUpIcon />} title="Panchakarma Progress" value={`${therapyProgress.percent}%`} color="emerald" />
        <SummaryCard icon={<ChartBarIcon />} title="Data Points Logged" value={dataPoints.length} color="teal" />
        <SummaryCard icon={<CalendarDaysIcon />} title="Days Tracked" value="13" color="emerald" />
        <SummaryCard icon={<ChartPieIcon />} title="Active Therapies" value={panchakarmaTherapies.filter(t => t.status === 'In Progress').length} color="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Metric Trends</h2>
            <div className="flex items-center space-x-2">
                {['Weekly', 'Monthly'].map(t => <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${timeframe === t ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{t}</button>)}
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-600"></div>
                {lineChartMetrics.map((m) => <button key={m} onClick={() => setActiveMetric(m)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${activeMetric === m ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{m}</button>)}
            </div>
          </div>
          <div className="p-6 h-96 w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="date" tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
                <YAxis domain={[0, 10]} tickFormatter={(value) => { if(value === 2) return 'Low'; if(value === 5) return 'Mid'; if(value === 8) return 'High'; return ''; }} tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
                <Tooltip content={<CustomLineChartTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}/>
                <Line type="monotone" dataKey="value" strokeWidth={3} stroke="#10b981" dot={{ r: 6, fill: '#10b981', stroke: 'var(--card-bg)', strokeWidth: 2 }} activeDot={{ r: 8 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Panchakarma Status</h2>
          </div>
          <div className="p-6 h-96 w-full flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="w-2/5 h-full relative">
                  <ResponsiveContainer>
                      <PieChart>
                          <Pie data={therapyProgress.data} dataKey="value" cx="50%" cy="50%" innerRadius={'70%'} outerRadius={'90%'} startAngle={90} endAngle={-270}>
                            <Cell fill="#10b981" stroke="" />
                            <Cell fill="rgba(241, 245, 249, 1)" stroke="" className="dark:fill-slate-700"/>
                          </Pie>
                      </PieChart>
                  </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{therapyProgress.percent}%</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Completed</span>
                  </div>
              </div>
              <div className="w-3/5 h-full flex flex-col justify-center space-y-3">
                  {panchakarmaTherapies.map(therapy => {
                      const Icon = therapyStatusConfig[therapy.status].icon;
                      const color = therapyStatusConfig[therapy.status].color;
                      return ( <div key={therapy.name} className="flex items-center"> <Icon className={`h-6 w-6 mr-3 flex-shrink-0 ${color}`} /> <div className="flex-grow"> <p className="font-semibold text-slate-800 dark:text-slate-200">{therapy.name}</p> <p className={`text-sm ${color}`}>{therapy.status}</p> </div> </div> );
                  })}
              </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Data Points</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dataPoints.map((data) => (
              <div key={data.id} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-lg">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">"{data.note}"</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <LevelBadge level={data.pain} metric={'Pain Level'} />
                    <LevelBadge level={data.sleep} metric={'Sleep Quality'} />
                    <LevelBadge level={data.stress} metric={'Stress Level'} />
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => handleOpenModal(data)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><PencilIcon className="h-5 w-5 text-slate-500" /></button>
                  <button onClick={() => handleDeleteItem(data.id)} className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"><TrashIcon className="h-5 w-5 text-rose-500" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* The modal is now simplified and directly controlled by the parent component */}
      {editingItem && <EditModal isOpen={isModalOpen} onClose={handleCloseModal} item={editingItem} onSave={handleSaveItem} onFieldChange={handleEditChange} />}
    </div>
  );
};


// --- HELPER COMPONENTS ---
const SummaryCard = ({ icon, title, value, subValue, color }) => ( <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"> <div className="p-5"> <div className="flex items-center"> <div className={`flex-shrink-0 rounded-xl p-3 bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800`}> <div className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}>{icon}</div> </div> <div className="ml-4 w-0 flex-1"> <dl> <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">{title}</dt> <dd> <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div> {subValue && <div className="text-xs text-slate-500 dark:text-slate-400">{subValue}</div>} </dd> </dl> </div> </div> </div> </div> );
const LevelBadge = ({ level, metric }) => { const levelColor = { 'Pain Level': { Mild: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', Severe: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }, 'Sleep Quality': { Poor: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', Fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', Good: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', Excellent: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'}, 'Stress Level': { Low: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }, }; const colorClass = levelColor[metric]?.[level] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'; return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>{metric.replace(' Level', '').replace(' Quality', '')}: {level}</span>; };

// REFACTORED EditModal: This modal is now "dumb" and fully controlled by the parent.
const EditModal = ({ isOpen, onClose, item, onSave, onFieldChange }) => {
    // This modal no longer has its own state for form fields.
    // It gets the current values directly from the `item` prop.
    // It calls the `onFieldChange` function passed from the parent to update the values.
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/40" /></Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-200 dark:border-slate-700">
                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900 dark:text-white flex justify-between items-center">
                                    Edit Daily Log for {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long'})}
                                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><XMarkIcon className="w-5 h-5" /></button>
                                </Dialog.Title>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pain Level</label>
                                        <select value={item.pain} onChange={(e) => onFieldChange('pain', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white">{levelOptions['Pain Level'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Sleep Quality</label>
                                        <select value={item.sleep} onChange={(e) => onFieldChange('sleep', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white">{levelOptions['Sleep Quality'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Stress Level</label>
                                        <select value={item.stress} onChange={(e) => onFieldChange('stress', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white">{levelOptions['Stress Level'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
                                    </div>
                                    <div>
                                        <label htmlFor="note" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Note</label>
                                        <textarea id="note" rows={3} value={item.note} onChange={(e) => onFieldChange('note', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"></textarea>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600">Cancel</button>
                                    <button type="button" onClick={onSave} className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Save Changes</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};


export default ProgressTracking;