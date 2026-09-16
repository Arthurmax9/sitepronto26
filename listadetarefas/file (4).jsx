function Busca({ busca, setBusca }) {
  return (
    <div className="busca">
      <input
        type="text"
        placeholder="🔍 Buscar tarefa..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
    </div>
  );
}

export default Busca;
