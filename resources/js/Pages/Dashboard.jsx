import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { pickBy } from "lodash";
import TodoItem from "@/Components/TodoItem"; // Added for subtasks

export default function Dashboard({ auth, todos, filters, categories }) {
    // State & forms for modals
    const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] =
        useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // State for filters and sorting
    const [filterParams, setFilterParams] = useState({
        status: filters.status || "all",
        sort_by: filters.sort_by || "created_at",
        sort_order: filters.sort_order || "desc",
        category: filters.category || null,
    });

    const {
        data: newTodoData,
        setData: setNewTodoData,
        post: postNewTodo,
        processing: newTodoProcessing,
        errors: newTodoErrors,
        reset: resetNewTodoForm,
    } = useForm({ title: "", parent_id: null }); // Added parent_id for subtasks
    const {
        data: editTodoData,
        setData: setEditTodoData,
        patch: patchTodo,
        processing: editTodoProcessing,
        errors: editTodoErrors,
        reset: resetEditTodoForm,
    } = useForm({
        id: "",
        title: "",
        due_date: "",
        priority: 2,
        notes: "",
        category_id: "",
    });
    const {
        data: addCategoryData,
        setData: setAddCategoryData,
        post: postCategory,
        processing: addCategoryProcessing,
        errors: addCategoryErrors,
        reset: resetAddCategoryForm,
    } = useForm({ name: "" });
    const {
        data: editCategoryData,
        setData: setEditCategoryData,
        patch: patchCategory,
        processing: editCategoryProcessing,
        errors: editCategoryErrors,
        reset: resetEditCategoryForm,
    } = useForm({ id: "", name: "" });

    // Re-fetch todos when filter/sort params change
    useEffect(() => {
        const query = pickBy(
            filterParams,
            (value) => value !== "all" && value !== null && value !== ""
        );
        router.get(route("dashboard"), query, {
            preserveState: true,
            replace: true,
        });
    }, [filterParams]);

    // Populate edit forms when an item is selected
    useEffect(() => {
        if (editingTodo)
            setEditTodoData({
                ...editingTodo,
                title: editingTodo.title || "",
                due_date: editingTodo.due_date || "",
                priority: editingTodo.priority || 2,
                notes: editingTodo.notes || "",
                category_id: editingTodo.category_id || "",
            });
    }, [editingTodo]);
    useEffect(() => {
        if (editingCategory)
            setEditCategoryData({
                id: editingCategory.id,
                name: editingCategory.name || "",
            });
    }, [editingCategory]);

    // Modal handlers
    const openEditTodoModal = (todo) => {
        setEditingTodo(todo);
        setIsEditTodoModalOpen(true);
    };
    const closeEditTodoModal = () => {
        setIsEditTodoModalOpen(false);
        setEditingTodo(null);
        resetEditTodoForm();
    };
    const openEditCategoryModal = (category) => {
        setEditingCategory(category);
        setIsEditCategoryModalOpen(true);
    };
    const closeEditCategoryModal = () => {
        setIsEditCategoryModalOpen(false);
        setEditingCategory(null);
        resetEditCategoryForm();
    };
    const openAddCategoryModal = () => setIsAddCategoryModalOpen(true);
    const closeAddCategoryModal = () => {
        setIsAddCategoryModalOpen(false);
        resetAddCategoryForm("name");
    };

    // Form submission handlers
    const submitNewTodo = (e) => {
        e.preventDefault();
        postNewTodo(route("todos.store"), {
            onSuccess: () => resetNewTodoForm("title"),
        });
    };
    const submitEditTodo = (e) => {
        e.preventDefault();
        patchTodo(route("todos.update", editTodoData.id), {
            onSuccess: () => closeEditTodoModal(),
        });
    };
    const submitAddCategory = (e) => {
        e.preventDefault();
        postCategory(route("categories.store"), {
            onSuccess: () => closeAddCategoryModal(),
        });
    };
    const submitEditCategory = (e) => {
        e.preventDefault();
        patchCategory(route("categories.update", editCategoryData.id), {
            onSuccess: () => closeEditCategoryModal(),
        });
    };

    // Action handlers
    const toggleCompleted = (todo) =>
        router.patch(
            route("todos.update", todo.id),
            { completed: !todo.completed },
            { preserveState: true, preserveScroll: true }
        );
    const deleteTodo = (todo) => {
        if (confirm("Are you sure?"))
            router.delete(route("todos.destroy", todo.id), {
                preserveScroll: true,
            });
    };
    const deleteCategory = (category) => {
        if (
            confirm(
                "Are you sure you want to delete this category? Todos in this category will not be deleted."
            )
        ) {
            router.delete(route("categories.destroy", category.id), {
                preserveState: false,
            });
        }
    };

    const handleFilterChange = (e) =>
        setFilterParams((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    const handleCategoryFilter = (categoryId) =>
        setFilterParams((prev) => ({ ...prev, category: categoryId }));

    const handleClearFilters = () => {
        setFilterParams({
            status: "all",
            sort_by: "created_at",
            sort_order: "desc",
            category: null,
        });
    };

    const priorityMap = {
        1: { text: "Low", className: "badge-info" },
        2: { text: "Medium", className: "badge-warning" },
        3: { text: "High", className: "badge-error" },
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Todo App" />

            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-lg">
                <div className="flex-1">
                    <Link
                        href={route("dashboard")}
                        className="btn btn-ghost normal-case text-xl"
                    >
                        Todo App
                    </Link>
                </div>
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <label
                            tabIndex={0}
                            className="btn btn-ghost rounded-btn"
                        >
                            {auth.user.name}
                            <svg
                                className="-me-0.5 ms-2 h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
                        >
                            <li>
                                <Link href={route("profile.edit")}>
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="col-span-1">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="card-title">
                                            Categories
                                        </h2>
                                        <button
                                            onClick={openAddCategoryModal}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <ul className="menu bg-base-100 w-full rounded-box">
                                        <li
                                            onClick={() =>
                                                handleCategoryFilter(null)
                                            }
                                            className={
                                                !filterParams.category
                                                    ? "bordered"
                                                    : ""
                                            }
                                        >
                                            <a>All Todos</a>
                                        </li>
                                        {categories.map((category) => (
                                            <li
                                                key={category.id}
                                                className={`group ${
                                                    filterParams.category ==
                                                    category.id
                                                        ? "bordered"
                                                        : ""
                                                }`}
                                            >
                                                <a
                                                    onClick={() =>
                                                        handleCategoryFilter(
                                                            category.id
                                                        )
                                                    }
                                                    className="flex justify-between"
                                                >
                                                    {category.name}
                                                    <div className="hidden group-hover:flex gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditCategoryModal(
                                                                    category
                                                                );
                                                            }}
                                                            className="btn btn-ghost btn-xs"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteCategory(
                                                                    category
                                                                );
                                                            }}
                                                            className="btn btn-ghost btn-xs text-error"
                                                        >
                                                            Del
                                                        </button>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                        {categories.length === 0 && (
                                            <p className="text-center text-gray-500">
                                                No categories yet.
                                            </p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Main Area */}
                        <div className="col-span-1 md:col-span-3">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">My Todos</h2>
                                    <form
                                        onSubmit={submitNewTodo}
                                        className="flex gap-2 mb-4"
                                    >
                                        <input
                                            type="text"
                                            value={newTodoData.title}
                                            onChange={(e) =>
                                                setNewTodoData(
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            className="input input-bordered input-primary w-full"
                                            placeholder="Add a new todo..."
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={newTodoProcessing}
                                        >
                                            Add
                                        </button>
                                    </form>
                                    {newTodoErrors.title && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {newTodoErrors.title}
                                        </p>
                                    )}

                                    <div className="flex justify-between items-center my-4">
                                        <div className="flex gap-4 flex-wrap">
                                            <div>
                                                <label className="label-text pb-1">
                                                    Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={filterParams.status}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="select select-bordered select-sm"
                                                >
                                                    <option value="all">
                                                        All
                                                    </option>
                                                    <option value="active">
                                                        Active
                                                    </option>
                                                    <option value="completed">
                                                        Completed
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label-text pb-1">
                                                    Sort by
                                                </label>
                                                <select
                                                    name="sort_by"
                                                    value={filterParams.sort_by}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="select select-bordered select-sm"
                                                >
                                                    <option value="created_at">
                                                        Date Created
                                                    </option>
                                                    <option value="due_date">
                                                        Due Date
                                                    </option>
                                                    <option value="priority">
                                                        Priority
                                                    </option>
                                                    <option value="title">
                                                        Title
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label-text pb-1">
                                                    Order
                                                </label>
                                                <select
                                                    name="sort_order"
                                                    value={
                                                        filterParams.sort_order
                                                    }
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="select select-bordered select-sm"
                                                >
                                                    <option value="asc">
                                                        Asc
                                                    </option>
                                                    <option value="desc">
                                                        Desc
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        {(filterParams.status !== "all" ||
                                            filterParams.sort_by !== "created_at" ||
                                            filterParams.sort_order !== "desc" ||
                                            filterParams.category !== null) && (
                                            <button
                                                onClick={handleClearFilters}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        {todos.length === 0 ? (
                                            <p className="text-center text-gray-500">
                                                No todos yet.
                                            </p>
                                        ) : (
                                            todos
                                                .filter((todo) => !todo.parent_id) // Filter for top-level todos
                                                .map((todo) => (
                                                    <TodoItem
                                                        key={todo.id}
                                                        todo={todo}
                                                        openEditTodoModal={
                                                            openEditTodoModal
                                                        }
                                                        toggleCompleted={
                                                            toggleCompleted
                                                        }
                                                        deleteTodo={deleteTodo}
                                                        priorityMap={
                                                            priorityMap
                                                        }
                                                    />
                                                ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <dialog
                id="edit_todo_modal"
                className={`modal ${isEditTodoModalOpen ? "modal-open" : ""}`}
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Todo</h3>
                    <form onSubmit={submitEditTodo} className="space-y-4 mt-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                value={editTodoData.title}
                                onChange={(e) =>
                                    setEditTodoData("title", e.target.value)
                                }
                                className="input input-bordered w-full"
                            />
                            {editTodoErrors.title && (
                                <p className="text-red-500 text-xs mt-1">
                                    {editTodoErrors.title}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={editTodoData.category_id}
                                onChange={(e) =>
                                    setEditTodoData(
                                        "category_id",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">No Category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {editTodoErrors.category_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {editTodoErrors.category_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Due Date</span>
                            </label>
                            <input
                                type="date"
                                value={editTodoData.due_date}
                                onChange={(e) =>
                                    setEditTodoData("due_date", e.target.value)
                                }
                                className="input input-bordered w-full"
                            />
                            {editTodoErrors.due_date && (
                                <p className="text-red-500 text-xs mt-1">
                                    {editTodoErrors.due_date}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Priority</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={editTodoData.priority}
                                onChange={(e) =>
                                    setEditTodoData(
                                        "priority",
                                        parseInt(e.target.value, 10)
                                    )
                                }
                            >
                                <option value={1}>Low</option>
                                <option value={2}>Medium</option>
                                <option value={3}>High</option>
                            </select>
                            {editTodoErrors.priority && (
                                <p className="text-red-500 text-xs mt-1">
                                    {editTodoErrors.priority}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Notes</span>
                            </label>
                            <textarea
                                value={editTodoData.notes}
                                onChange={(e) =>
                                    setEditTodoData("notes", e.target.value)
                                }
                                className="textarea textarea-bordered w-full"
                            ></textarea>
                            {editTodoErrors.notes && (
                                <p className="text-red-500 text-xs mt-1">
                                    {editTodoErrors.notes}
                                </p>
                            )}
                        </div>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={closeEditTodoModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={editTodoProcessing}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeEditTodoModal}>close</button>
                </form>
            </dialog>
            <dialog
                id="add_category_modal"
                className={`modal ${
                    isAddCategoryModalOpen ? "modal-open" : ""
                }`}
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add New Category</h3>
                    <form
                        onSubmit={submitAddCategory}
                        className="space-y-4 mt-4"
                    >
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Category Name
                                </span>
                            </label>
                            <input
                                type="text"
                                value={addCategoryData.name}
                                onChange={(e) =>
                                    setAddCategoryData("name", e.target.value)
                                }
                                className="input input-bordered w-full"
                                autoFocus
                            />
                            {addCategoryErrors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {addCategoryErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={closeAddCategoryModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={addCategoryProcessing}
                            >
                                Add Category
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeAddCategoryModal}>close</button>
                </form>
            </dialog>
            <dialog
                id="edit_category_modal"
                className={`modal ${
                    isEditCategoryModalOpen ? "modal-open" : ""
                }`}
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Category</h3>
                    <form
                        onSubmit={submitEditCategory}
                        className="space-y-4 mt-4"
                    >
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Category Name
                                </span>
                            </label>
                            <input
                                type="text"
                                value={editCategoryData.name}
                                onChange={(e) =>
                                    setEditCategoryData("name", e.target.value)
                                }
                                className="input input-bordered w-full"
                                autoFocus
                            />
                            {editCategoryErrors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {editCategoryErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={closeEditCategoryModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={editCategoryProcessing}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeEditCategoryModal}>close</button>
                </form>
            </dialog>
        </AuthenticatedLayout>
    );
}
