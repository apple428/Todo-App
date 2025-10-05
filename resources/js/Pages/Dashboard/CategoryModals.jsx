import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function CategoryModals({ isOpen, onClose, modalType, category, ...props }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({ name: '' });

    const isEditing = modalType === 'edit';

    useEffect(() => {
        if (isOpen) {
            if (isEditing && category) {
                setData('name', category.name || '');
            } else {
                reset();
            }
        }
    }, [isOpen, category, modalType]);

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => onClose(),
            preserveScroll: true,
        };
        if (isEditing) {
            if (!category) return;
            patch(route('categories.update', category.id), options);
        } else {
            post(route('categories.store'), options);
        }
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
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="category_name" className={labelClass}>Category Name</label>
                                <input id="category_name" type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} autoFocus />
                                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 flex items-center" disabled={processing}>
                                    {processing && <Loader2 className="animate-spin mr-2" size={16} />} 
                                    {isEditing ? (processing ? 'Saving...' : 'Save Changes') : (processing ? 'Adding...' : 'Add Category')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}