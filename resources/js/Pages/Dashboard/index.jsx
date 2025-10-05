import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { pickBy } from "lodash";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryList from "./CategoryList";
import TodoList from "./TodoList";
import EditTodoModal from "./EditTodoModal";
import CategoryModals from "./CategoryModals";
import Header from "./Header";

export default function Dashboard({ auth, todos, filters, categories }) {
    // State for filters and sorting
    const [filterParams, setFilterParams] = useState({
        status: filters.status || "all",
        sort_by: filters.sort_by || "created_at",
        sort_order: filters.sort_order || "desc",
        category: filters.category || null,
    });

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryModalType, setCategoryModalType] = useState("add");
    const [editingCategory, setEditingCategory] = useState(null);

    const {
        data: newTodoData,
        setData: setNewTodoData,
        post: postNewTodo,
        processing: newTodoProcessing,
        errors: newTodoErrors,
        reset: resetNewTodoForm,
    } = useForm({ title: "", parent_id: null });

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

    const handleCategorySelect = (categoryId) => {
        setFilterParams((prev) => ({ ...prev, category: categoryId }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterParams((prev) => ({ ...prev, [name]: value }));
    };

    const submitNewTodo = (e) => {
        e.preventDefault();
        postNewTodo(route("todos.store"), {
            onSuccess: () => resetNewTodoForm("title"),
            preserveScroll: true,
        });
    };

    // --- TODO Handlers ---
    const handleToggleTodo = (todo) => {
        router.patch(
            route("todos.update", todo.id),
            { completed: !todo.completed },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDeleteTodo = (todo) => {
        if (confirm("Are you sure you want to delete this todo?")) {
            router.delete(route("todos.destroy", todo.id), {
                preserveScroll: true,
            });
        }
    };

    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTodo(null);
    };

    // --- Category Handlers ---
    const handleAddCategory = () => {
        setCategoryModalType("add");
        setEditingCategory(null);
        setIsCategoryModalOpen(true);
    };

    const handleEditCategory = (cat) => {
        setCategoryModalType("edit");
        setEditingCategory(cat);
        setIsCategoryModalOpen(true);
    };

    const handleDeleteCategory = (cat) => {
        if (confirm("Are you sure you want to delete this category?")) {
            router.delete(route("categories.destroy", cat.id), {
                preserveState: false, // Full page reload to reflect changes
            });
        }
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                            <CategoryList
                                categories={categories}
                                currentCategory={filterParams.category}
                                onSelectCategory={handleCategorySelect}
                                onAddCategory={handleAddCategory}
                                onEditCategory={handleEditCategory}
                                onDeleteCategory={handleDeleteCategory}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Header title="Tasks" user={auth.user} />
                            <TodoList
                                todos={todos}
                                filters={filterParams}
                                onToggle={handleToggleTodo}
                                onEdit={handleEditTodo}
                                onDelete={handleDeleteTodo}
                                newTodoData={newTodoData}
                                onNewTodoChange={(e) =>
                                    setNewTodoData("title", e.target.value)
                                }
                                onNewTodoSubmit={submitNewTodo}
                                newTodoProcessing={newTodoProcessing}
                                newTodoErrors={newTodoErrors}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <EditTodoModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                todo={editingTodo}
                categories={categories}
            />

            <CategoryModals
                isOpen={isCategoryModalOpen}
                onClose={closeCategoryModal}
                modalType={categoryModalType}
                category={editingCategory}
            />
        </AuthenticatedLayout>
    );
}