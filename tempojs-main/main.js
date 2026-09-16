const apiKey = "da1fb2dd580888b067c0995ebf9ffcfe";

const cidadeInput = document.getElementById("cidadeInput");
const btnBuscar = document.getElementById("btnBuscar");
const btnLocal = document.getElementById("btnLocal");
const loading = document.getElementById("loading");
const resultado = document.getElementById("resultado");
const mensagemErro = document.getElementById("mensagemErro");

btnBuscar.addEventListener("click", () => buscarPorCidade());
btnLocal.addEventListener("click", buscarPorLocalizacao);
cidadeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarPorCidade();
});

function mostrarLoading() {
  loading.classList.remove("hidden");
  resultado.classList.add("hidden");
  mensagemErro.classList.add("hidden");
}

function mostrarErro() {
  loading.classList.add("hidden");
  resultado.classList.add("hidden");
  mensagemErro.classList.remove("hidden");
}

function mostrarResultado() {
  loading.classList.add("hidden");
  mensagemErro.classList.add("hidden");
  resultado.classList.remove("hidden");
}

async function buscarPorCidade() {
  const cidade = cidadeInput.value.trim();
  if (!cidade) return;

  mostrarLoading();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${apiKey}&lang=pt_br&units=metric`
    );
    if (!response.ok) throw new Error("Cidade não encontrada");
    const dados = await response.json();
    exibirDados(dados);
  } catch (erro) {
    mostrarErro();
  }
}

function buscarPorLocalizacao() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada pelo seu navegador.");
    return;
  }

  mostrarLoading();

  navigator.geolocation.getCurrentPosition(async (posicao) => {
    const { latitude, longitude } = posicao.coords;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=pt_br&units=metric`
      );
      if (!response.ok) throw new Error("Erro ao buscar clima");
      const dados = await response.json();
      exibirDados(dados);
    } catch (erro) {
      mostrarErro();
    }
  }, () => {
    mostrarErro();
  });
}

function exibirDados(dados) {
  document.getElementById("cidade").textContent = `${dados.name}, ${dados.sys.country}`;
  document.getElementById("dataHora").textContent = formatarDataHora();

  document.getElementById("temp").textContent = `${Math.round(dados.main.temp)}°`;
  document.getElementById("descricao").textContent = dados.weather[0].description;
  document.getElementById("sensacao").textContent = `Sensação térmica: ${Math.round(dados.main.feels_like)}°`;

  document.getElementById("tempMax").textContent = `${Math.round(dados.main.temp_max)}°`;
  document.getElementById("tempMin").textContent = `${Math.round(dados.main.temp_min)}°`;
  document.getElementById("umidade").textContent = `${dados.main.humidity}%`;
  document.getElementById("vento").textContent = `${Math.round(dados.wind.speed * 3.6)} km/h`;

  document.getElementById("iconeTempo").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`;

  mostrarResultado();
}

function formatarDataHora() {
  const agora = new Date();
  const dias = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} • ${agora.getHours()}:${String(agora.getMinutes()).padStart(2, "0")}`;
}
