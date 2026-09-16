import pandas as pd
import numpy as np
from numpy import random
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# ===== GERAÇÃO DOS DADOS =====
tamanho_imovel = np.random.randint(50, 300, size=200)

precos_imoveis = (tamanho_imovel * np.random.uniform(1500, 2500, size=200)) + \
                  (np.random.normal(0, 100000, size=200))

# ===== GRÁFICO DE DISPERSÃO =====
plt.figure(figsize=(10, 6))
plt.scatter(
    tamanho_imovel, precos_imoveis,
    label='Relação de tamanhos e preços',
    alpha=0.6,
    color='blue'
)

# ===== TREINAMENTO DO MODELO =====
tamanho_imovelnew = tamanho_imovel.reshape(-1, 1)
modelo = LinearRegression()
modelo.fit(tamanho_imovelnew, precos_imoveis)

# ===== PREVISÃO PARA NOVO IMÓVEL =====
novo_tamanho = np.array([[220]])
previsao = modelo.predict(novo_tamanho)

print(f'Previsão para um imóvel de 220 m²: R$ {previsao[0]:.2f}')
print(f"Coeficiente (inclinação): R$ {modelo.coef_[0]:.2f}")
print(f"Intercepto (preço base): R$ {modelo.intercept_:.2f}")

# ===== LINHA DE REGRESSÃO =====
plt.plot(
    tamanho_imovelnew, modelo.predict(tamanho_imovelnew),
    color='red', linewidth=3,
    label='Linha de Regressão'
)

# ===== CONFIGURAÇÃO DO GRÁFICO =====
plt.title('Dados de Imóveis: Tamanho vs. Preço')
plt.xlabel('Tamanho do Imóvel (m²)')
plt.ylabel('Preço do Imóvel (R$)')
plt.grid(True)
plt.legend()

# ===== SALVAR IMAGEM =====
plt.savefig('previsao-imoveis.png', dpi=150, bbox_inches='tight')

plt.show()
