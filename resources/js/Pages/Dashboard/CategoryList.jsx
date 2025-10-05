import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CategoryList({
    categories,
    currentCategory,
    onSelectCategory,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
}) {
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleMenuToggle = (e, categoryId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === categoryId ? null : categoryId);
    };
    
    // This is a simple way to close the menu when clicking outside.
    // A more robust solution might use a custom hook.
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        if (openMenuId) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);


    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Categories
                </h2>
                <button
                    onClick={onAddCategory}
                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Add Category"
                >
                    <Plus size={20} />
                </button>
            </div>
            <ul className="space-y-1">
                <li>
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            !currentCategory
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        All Tasks
                    </button>
                </li>
                {categories.map((category) => (
                    <li key={category.id} className="group">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => onSelectCategory(category.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    currentCategory === category.id
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {category.name}
                            </button>
                            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleMenuToggle(e, category.id)}
                                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                                <AnimatePresence>
                                {openMenuId === category.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
                                    >
                                        <ul className="p-1">
                                            <li>
                                                <button onClick={(e) => { e.stopPropagation(); onEditCategory(category); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                                    <Edit size={14} /> Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(category); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md">
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {categories.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                    No categories yet.
                </p>
            )}
        </div>
    );
}