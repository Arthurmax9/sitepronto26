import { useState } from 'react';

function TodoForm({ addTodo }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Trabalho');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text.trim(), category);
    setText('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>Adicionar tarefa</h2>
      <div className="form-row">
        <input
          type="text"
          placeholder="O que você precisa fazer?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Trabalho">💼 Trabalho</option>
          <option value="Pessoal">🧘 Pessoal</option>
          <option value="Estudo">📚 Estudo</option>
          <option value="Casa">🏠 Casa</option>
          <option value="Outro">📌 Outro</option>
        </select>
        <button type="submit" className="btn-add">+ Adicionar</button>
      </div>
    </form>
  );
}

export default TodoForm;
