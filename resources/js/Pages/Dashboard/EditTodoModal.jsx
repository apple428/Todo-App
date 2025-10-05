import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function EditTodoModal({ isOpen, onClose, todo, categories }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        title: '',
        category_id: '',
        due_date: '',
        priority: 2,
        notes: '',
    });

    useEffect(() => {
        if (todo) {
            setData({
                title: todo.title || '',
                category_id: todo.category_id || '',
                due_date: todo.due_date || '',
                priority: todo.priority || 2,
                notes: todo.notes || '',
            });
        } else {
            reset();
        }
    }, [todo]);

    const submit = (e) => {
        e.preventDefault();
        if (!todo) return;
        patch(route('todos.update', todo.id), {
            onSuccess: () => onClose(),
            preserveScroll: true,
        });
    };

    const inputClass = "w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Task</h3>
                            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="title" className={labelClass}>Title</label>
                                <input id="title" type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inputClass} />
                                {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category_id" className={labelClass}>Category</label>
                                    <select id="category_id" value={data.category_id} onChange={e => setData('category_id', e.target.value)} className={inputClass}>
                                        <option value="">No Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="due_date" className={labelClass}>Due Date</label>
                                    <input id="due_date" type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Priority</label>
                                <div className="flex justify-around p-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                                    {[1, 2, 3].map(p => (
                                        <button type="button" key={p} onClick={() => setData('priority', p)} className={`w-full py-1.5 text-sm rounded-md transition ${data.priority === p ? 'bg-white dark:bg-gray-900 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                            {p === 1 ? 'Low' : p === 2 ? 'Medium' : 'High'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="notes" className={labelClass}>Notes</label>
                                <textarea id="notes" value={data.notes} onChange={e => setData('notes', e.target.value)} rows={4} className={`${inputClass} min-h-[100px]`}></textarea>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 flex items-center" disabled={processing}>
                                    {processing && <Loader2 className="animate-spin mr-2" size={16} />} 
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}