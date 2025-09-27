import React from 'react';
import { 
    ChatBubbleBottomCenterTextIcon, 
    HeartIcon, 
    BoltIcon, 
    CloudIcon,
    SparklesIcon,
    FaceSmileIcon,
    MoonIcon,
    NoSymbolIcon
} from '@heroicons/react/24/outline';

// A helper component for displaying each data point
const FeedbackItem = ({ icon, label, value }) => (
    <div className="flex flex-col p-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg text-center">
        <div className="mx-auto h-7 w-7 text-slate-500 dark:text-slate-400">{icon}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{value}</p>
    </div>
);

const FeedbackDisplay = ({ feedback }) => {
    if (!feedback) return null;

    return (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-emerald-200 dark:border-emerald-800/50">
            <h5 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center">
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2" />
                Patient Feedback Submitted
            </h5>
            <div className="space-y-4">
                {/* Vitals Section */}
                <div className="grid grid-cols-3 gap-3">
                    <FeedbackItem icon={<HeartIcon />} label="Pain" value={`${feedback.painLevel}/10`} />
                    <FeedbackItem icon={<CloudIcon />} label="Stress" value={`${feedback.stressLevel}/10`} />
                    <FeedbackItem icon={<BoltIcon />} label="Energy" value={`${feedback.energyLevel}/10`} />
                </div>
                {/* Indicators Section */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <FeedbackItem icon={<SparklesIcon />} label="Appetite" value={feedback.appetite} />
                    <FeedbackItem icon={<NoSymbolIcon />} label="Digestion" value={feedback.digestion} />
                    <FeedbackItem icon={<MoonIcon />} label="Sleep" value={feedback.sleepQuality} />
                    <FeedbackItem icon={<FaceSmileIcon />} label="Mental State" value={feedback.mentalState} />
                </div>
                {/* Notes Section */}
                {feedback.notes && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                         <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Additional Notes:</p>
                         <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{feedback.notes}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackDisplay;