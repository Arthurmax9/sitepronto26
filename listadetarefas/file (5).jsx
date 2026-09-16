function Filtro({ filtro, setFiltro, sort, setSort }) {
  return (
    <div className="filtro">
      <div className="filtro-options">
        <div>
          <label>Status</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="All">Todas</option>
            <option value="Completed">Concluídas</option>
            <option value="Incomplete">Pendentes</option>
          </select>
        </div>
        <div>
          <label>Ordenar</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="Asc">A → Z</option>
            <option value="Desc">Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filtro;
