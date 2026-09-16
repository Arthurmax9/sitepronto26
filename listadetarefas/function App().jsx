import { useState, useEffect } from 'react';
import Todo from './componentes/Todo';
import TodoForm from './componentes/TodoForm';
import Busca from './componentes/Busca';
import Filtro from './componentes/Filtro';

const STORAGE_KEY = 'todos-app-v1';

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('All');
  const [sort, setSort] = useState('Asc');

  // salva sempre que os todos mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, category) => {
    const newTodo = {
      id: Date.now(),
      text,
      category,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completeTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.isCompleted));
  };

  const visibleTodos = todos
    .filter((todo) =>
      filtro === 'All' ? true : filtro === 'Completed' ? todo.isCompleted : !todo.isCompleted
    )
    .filter((todo) => todo.text.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) =>
      sort === 'Asc' ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text)
    );

  const total = todos.length;
  const done = todos.filter((t) => t.isCompleted).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Minhas Tarefas</h1>
        <p className="subtitle">Organize seu dia com estilo</p>
      </header>

      <div className="progress-wrap">
        <div className="progress-info">
          <span>{done} de {total} concluídas</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <TodoForm addTodo={addTodo} />

      <Busca busca={busca} setBusca={setBusca} />
      <Filtro filtro={filtro} setFiltro={setFiltro} sort={sort} setSort={setSort} />

      <div className="todo-list">
        {visibleTodos.length === 0 ? (
          <p className="empty-state">Nenhuma tarefa encontrada ✨</p>
        ) : (
          visibleTodos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              completeTodo={completeTodo}
            />
          ))
        )}
      </div>

      {done > 0 && (
        <button className="btn-clear" onClick={clearCompleted}>
          🗑️ Limpar concluídas
        </button>
      )}
    </div>
  );
}

export default App;
