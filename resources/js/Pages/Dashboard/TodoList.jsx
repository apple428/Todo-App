import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Send, ListFilter, ChevronDown, Loader2 } from 'lucide-react';
import TodoItem from './TodoItem';

const AddTodoForm = ({ data, onChange, onSubmit, processing, errors }) => {
    return (
        <form onSubmit={onSubmit} className="mb-6">
            <div className="relative">
                <input
                    type="text"
                    value={data.title}
                    onChange={onChange}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Add a new task..."
                    autoFocus
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                    disabled={processing || !data.title}
                >
                    {processing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
            </div>
            {errors.title && (
                <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>
            )}
        </form>
    );
};

const TodoFilters = ({ filters, onFilterChange }) => {
    const selectClasses = "bg-gray-50 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

    return (
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <ListFilter size={18} className="text-gray-500" />
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Filters</h3>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <div>
                    <label htmlFor="status" className="sr-only">Status</label>
                    <select id="status" name="status" value={filters.status} onChange={onFilterChange} className={selectClasses}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div>
                     <label htmlFor="sort_by" className="sr-only">Sort by</label>
                    <select id="sort_by" name="sort_by" value={filters.sort_by} onChange={onFilterChange} className={selectClasses}>
                        <option value="created_at">Date Created</option>
                        <option value="due_date">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                    </select>
                </div>
                <div>
                     <label htmlFor="sort_order" className="sr-only">Order</label>
                    <select id="sort_order" name="sort_order" value={filters.sort_order} onChange={onFilterChange} className={selectClasses}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
        </div>
    );
};


export default function TodoList({
    todos,
    filters,
    onToggle,
    onEdit,
    onDelete,
    newTodoData,
    onNewTodoChange,
    onNewTodoSubmit,
    newTodoProcessing,
    newTodoErrors,
    onFilterChange
}) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6">
            <AddTodoForm
                data={newTodoData}
                onChange={onNewTodoChange}
                onSubmit={onNewTodoSubmit}
                processing={newTodoProcessing}
                errors={newTodoErrors}
            />
            <TodoFilters filters={filters} onFilterChange={onFilterChange} />

            <div className="mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="mt-4 space-y-2">
                    <AnimatePresence>
                        {todos.length > 0 ? (
                            todos
                                .filter((todo) => !todo.parent_id)
                                .map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={onToggle}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-10 px-4"
                            >
                                <p className="text-gray-500 dark:text-gray-400">
                                    You're all caught up!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}