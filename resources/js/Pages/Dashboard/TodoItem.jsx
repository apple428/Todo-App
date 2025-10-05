
import { motion } from 'framer-motion';
import { Check, Trash2, Edit, MoreHorizontal, Calendar, Flag } from 'lucide-react';

const priorityMap = {
    1: { text: 'Low', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    2: { text: 'Medium', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    3: { text: 'High', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

export default function TodoItem({
    todo,
    onToggle,
    onEdit,
    onDelete,
}) {
    const isCompleted = todo.completed;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`group w-full flex items-start gap-3 p-3 rounded-lg transition-colors ${
                isCompleted ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
        >
            {/* Checkbox */}
            <button
                onClick={() => onToggle(todo)}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                    isCompleted
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                }`}
            >
                {isCompleted && <Check size={14} className="text-white" />}
            </button>

            {/* Todo Content */}
            <div className="flex-grow">
                <p className={`transition-colors ${isCompleted ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                    {todo.title}
                </p>
                <div className="flex items-center gap-3 text-xs mt-1 text-gray-500 dark:text-gray-400">
                    {todo.due_date && (
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{todo.due_date}</span>
                        </div>
                    )}
                    {todo.priority && priorityMap[todo.priority] && (
                         <div className="flex items-center gap-1">
                            <Flag size={12} />
                            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${priorityMap[todo.priority].className}`}>
                                {priorityMap[todo.priority].text}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(todo)} className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Edit size={16} />
                </button>
                <button onClick={() => onDelete(todo)} className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
}
