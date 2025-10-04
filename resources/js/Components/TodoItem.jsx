import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { pickBy } from 'lodash';

export default function TodoItem({ todo, categories, priorityMap, openEditTodoModal, toggleCompleted, deleteTodo, level = 0 }) {
    const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false);
    const {
        data: newSubtaskData,
        setData: setNewSubtaskData,
        post: postNewSubtask,
        processing: newSubtaskProcessing,
        errors: newSubtaskErrors,
        reset: resetNewSubtaskForm,
    } = useForm({ title: "", parent_id: todo.id });

    const submitNewSubtask = (e) => {
        e.preventDefault();
        postNewSubtask(route("todos.store"), {
            onSuccess: () => {
                resetNewSubtaskForm("title");
                setShowAddSubtaskForm(false);
                // Refresh the page to show the new subtask
                router.reload({ preserveState: true });
            },
        });
    };

    const indentation = level * 20; // Adjust as needed for visual indentation

    return (
        <div style={{ marginLeft: `${indentation}px` }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-base-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out mb-3 border border-base-300">
                <div className="flex items-center gap-4 flex-grow mb-3 md:mb-0">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleCompleted(todo)}
                        className="checkbox checkbox-primary checkbox-lg"
                    />
                    <div className="flex flex-col">
                        <span
                            className={`text-lg font-semibold ${
                                todo.completed ? "line-through text-gray-500" : "text-base-content"
                            }`}
                        >
                            {todo.title}
                        </span>
                        {todo.due_date && (
                            <p className="text-sm text-gray-500 mt-1">
                                Due: {todo.due_date}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                    {todo.category && (
                        <span className="badge badge-outline badge-info">
                            {todo.category.name}
                        </span>
                    )}
                    {todo.priority && (
                        <span
                            className={`badge ${priorityMap[todo.priority]?.className}`}
                        >
                            {priorityMap[todo.priority]?.text}
                        </span>
                    )}
                    <button
                        onClick={() => openEditTodoModal(todo)}
                        className="btn btn-ghost btn-sm text-info"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => deleteTodo(todo)}
                        className="btn btn-ghost btn-sm text-error"
                    >
                        Delete
                    </button>
                    {todo.parent_id === null && ( // Only show if it's a top-level todo
                        <button
                            onClick={() => setShowAddSubtaskForm(!showAddSubtaskForm)}
                            className="btn btn-ghost btn-sm"
                        >
                            {showAddSubtaskForm ? 'Cancel' : 'Add Subtask'}
                        </button>
                    )}
                </div>
            </div>

            {showAddSubtaskForm && (
                <form onSubmit={submitNewSubtask} className="flex gap-2 mb-4" style={{ marginLeft: `${indentation + 20}px` }}>
                    <input
                        type="text"
                        value={newSubtaskData.title}
                        onChange={(e) => setNewSubtaskData("title", e.target.value)}
                        className="input input-bordered input-sm w-full"
                        placeholder="Add a new subtask..."
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={newSubtaskProcessing}
                    >
                        Add
                    </button>
                </form>
            )}
            {newSubtaskErrors.title && (
                <p className="text-red-500 text-xs mt-1" style={{ marginLeft: `${indentation + 20}px` }}>
                    {newSubtaskErrors.title}
                </p>
            )}

            {todo.children && todo.children.length > 0 && (
                <div className="pl-4">
                    {todo.children.map((childTodo) => (
                        <TodoItem
                            key={childTodo.id}
                            todo={childTodo}
                            categories={categories}
                            priorityMap={priorityMap}
                            openEditTodoModal={openEditTodoModal}
                            toggleCompleted={toggleCompleted}
                            deleteTodo={deleteTodo}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
