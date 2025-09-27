import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FeedbackModal = ({ isOpen, onClose, dayNumber, patientId, onFeedbackSubmitted }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    try {
      // Get the existing plan from localStorage
      const savedPlan = localStorage.getItem(`treatment_plan_${patientId}`);
      if (!savedPlan) {
        toast.error('Could not find treatment plan to update.');
        return;
      }
      const plan = JSON.parse(savedPlan);

      // Find the correct day and add the feedback
      const dayIndex = plan.schedule.findIndex(d => d.day === dayNumber);
      if (dayIndex !== -1) {
        plan.schedule[dayIndex].feedback = {
          ...data,
          // Convert slider values to numbers
          painLevel: parseInt(data.painLevel, 10),
          stressLevel: parseInt(data.stressLevel, 10),
          energyLevel: parseInt(data.energyLevel, 10),
          submissionDate: new Date().toISOString(),
        };
      }

      // Save the updated plan back to localStorage
      localStorage.setItem(`treatment_plan_${patientId}`, JSON.stringify(plan));

      toast.success('Feedback submitted successfully!');
      onFeedbackSubmitted(plan);
      onClose();
    } catch (error) {
      toast.error('Failed to save feedback.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl m-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Daily Feedback for Day {dayNumber}</h3>
          <button type="button" className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* --- Section 1: Core Vitals --- */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-slate-800 dark:text-slate-200">Core Vitals (0-10 Scale)</legend>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pain Level</label>
                <Controller name="painLevel" control={control} defaultValue={0} render={({ field }) => ( <input type="range" min="0" max="10" {...field} className="w-full" /> )}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Stress Level</label>
                <Controller name="stressLevel" control={control} defaultValue={5} render={({ field }) => ( <input type="range" min="0" max="10" {...field} className="w-full" /> )}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Energy Level</label>
                <Controller name="energyLevel" control={control} defaultValue={5} render={({ field }) => ( <input type="range" min="0" max="10" {...field} className="w-full" /> )}/>
              </div>
            </fieldset>

            {/* --- Section 2: Key Indicators --- */}
            <fieldset className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <legend className="text-lg font-semibold text-slate-800 dark:text-slate-200">Key Indicators</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Appetite</label>
                  <select {...register('appetite')} className="w-full mt-1 rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                    <option>Normal</option><option>Low</option><option>Strong</option><option>Variable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Digestion</label>
                  <select {...register('digestion')} className="w-full mt-1 rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                    <option>Comfortable</option><option>Bloated / Gassy</option><option>Acidity / Heartburn</option><option>Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Sleep Quality</label>
                  <select {...register('sleepQuality')} className="w-full mt-1 rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                    <option>Deep / Restful</option><option>Disturbed / Interrupted</option><option>Difficulty Falling Asleep</option><option>Woke up Tired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mental State</label>
                  <select {...register('mentalState')} className="w-full mt-1 rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700">
                    <option>Calm / Clear</option><option>Anxious / Worried</option><option>Irritable / Agitated</option><option>Lethargic / Dull</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* --- Section 3: Additional Notes --- */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200">Additional Notes</label>
                <textarea {...register('notes')} rows={4} placeholder="Describe any other specific feelings or symptoms..." className="w-full mt-2 rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700"></textarea>
            </div>
          </div>
          
          <div className="flex justify-end p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg">Submit Feedback</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;