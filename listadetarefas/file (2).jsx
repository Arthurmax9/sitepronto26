function Todo({ todo, removeTodo, completeTodo }) {
  const categoryColors = {
    Trabalho: '#3b82f6',
    Pessoal: '#a855f7',
    Estudo: '#f59e0b',
    Casa: '#10b981',
    Outro: '#6b7280',
  };

  const color = categoryColors[todo.category] || categoryColors.Outro;

  return (
    <div className={`todo ${todo.isCompleted ? 'completed' : ''}`}>
      <div className="todo-left">
        <button
          className="check-btn"
          onClick={() => completeTodo(todo.id)}
          aria-label="Concluir tarefa"
        >
          {todo.isCompleted ? '✅' : '⬜'}
        </button>
        <div className="todo-text-wrap">
          <span className="todo-text">{todo.text}</span>
          <span className="todo-badge" style={{ backgroundColor: color + '22', color }}>
            {todo.category}
          </span>
        </div>
      </div>
      <button className="remove-btn" onClick={() => removeTodo(todo.id)}>
        ✖
      </button>
    </div>
  );
}

export default Todo;
