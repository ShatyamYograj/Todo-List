import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);

  // ✅ Apply body class on dark mode toggle
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
  }, [darkMode]);

  // ✅ Sync with local storage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addNewTask = () => {
    if (!newTodo.trim()) return;
    const newTask = {
      id: uuidv4(),
      task: newTodo,
      dueDate: newDate,
      isDone: false,
    };
    setTodos((prev) => [...prev, newTask]);
    setNewTodo("");
    setNewDate("");
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const markAsDone = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isDone: true } : todo
      )
    );
  };

  const markAllDone = () => {
    setTodos((prev) => prev.map((todo) => ({ ...todo, isDone: true })));
  };

  const updateTodo = (id, value) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, task: value } : todo
      )
    );
  };

  const startEdit = (id) => {
    setEditId(id);
  };

  const saveEdit = (id, value) => {
    updateTodo(id, value);
    setEditId(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.isDone;
    if (filter === "not_done") return !todo.isDone;
    return true;
  });

  const isDueToday = (date) => {
    if (!date) return false;
    const today = new Date().toISOString().split("T")[0];
    return date === today;
  };

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <h2>📝 My Todo List</h2>
        <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Add a task"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <br /><br />
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <br /><br />
      <button onClick={addNewTask}>Add Task</button>
      <button onClick={markAllDone}>Mark All Done</button>

      <hr />

      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("not_done")} className={filter === "not_done" ? "active" : ""}>Not Done</button>
        <button onClick={() => setFilter("done")} className={filter === "done" ? "active" : ""}>Done</button>
      </div>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <div className="task-content">
              {editId === todo.id ? (
                <input
                  value={todo.task}
                  onChange={(e) => updateTodo(todo.id, e.target.value)}
                  onBlur={() => saveEdit(todo.id, todo.task)}
                  autoFocus
                />
              ) : (
                <span
                  className={`task-text ${todo.isDone ? "task-done" : ""}`}
                  onDoubleClick={() => startEdit(todo.id)}
                >
                  {todo.task}
                </span>
              )}

              {todo.dueDate && (
                <small className={`due-date ${isDueToday(todo.dueDate) ? "due-today" : ""}`}>
                  📅 Due: {todo.dueDate}
                </small>
              )}
            </div>

            <div className="actions">
              <button onClick={() => deleteTodo(todo.id)}>❌</button>
              {!todo.isDone && <button onClick={() => markAsDone(todo.id)}>✅</button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
