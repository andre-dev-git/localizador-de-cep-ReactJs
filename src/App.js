import { Fragment, useState } from 'react';
import './App.css';
import './components/Header'
import Header from './components/Header';
import SearchButton from './components/SearchButton'
import MaskedInput from 'react-text-mask'

let ladoExposto = "Formulário"

function App() {
  const [dados, setDados] = useState(false)
  async function validarCep() {
    let cep = document.getElementById("cepNumber").value
    cep = cep.replace(/[^0-9]/g, '')
    const errorMessage = document.getElementById("errorMessage")
    if (cep.length != 8) {
      errorMessage.style.color = "#00d0ff"
      return false
    } else {
      errorMessage.style.color = "transparent"
    }
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const dados = await pesquisarCEP(url)
    if (dados.erro) {
      errorMessage.style.color = "#00d0ff"
      return false
    } else {
      errorMessage.style.color = "transparent"
    }
    ladoExposto = "Resultado"
    if (dados.logradouro == "") {
      dados.logradouro = "Não consta"
    }
    setDados({
      "cep": dados.cep,
      "estado": dados.uf,
      "cidade": dados.localidade,
      "rua": dados.logradouro,
      "ddd": dados.ddd,
    })
  }
  function pesquisarCEP(url) {
    return fetch(url)
      .then((resposta) => resposta.json())
      .catch((err) => false)
  }
  function voltarForm() {
    ladoExposto = "Formulário"
    let cep = document.getElementById("cepNumber")
    cep.value = ""
    const container = document.getElementById("container-formulario-resultado")
    container.style.transform = `translate(0%, 0px)`
  }
  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      switch (ladoExposto) {
        case "Formulário":
          validarCep()
          break
        case "Resultado":
          voltarForm()
          break
      }
    }
  });
  if (dados) {
    let tamanhoContainer = document.getElementById("resultado").getBoundingClientRect()
    tamanhoContainer = tamanhoContainer.width
    const container = document.getElementById("container-formulario-resultado")
    container.style.transform = `translate(-${tamanhoContainer}px, 0px)`
    var resultados = (
      <div className='flex-cont flex-col container-dados'>
        <div id='cont-cep'>
          <label>
            CEP
          </label>
          <p>
            {dados.cep}
          </p>
        </div>
        <div className='cont-dados-indi'>
          <label>
            Estado
          </label>
          <p>
            {dados.estado}
          </p>
        </div>
        <div className='cont-dados-indi'>
          <label>
            Cidade
          </label>
          <p>
            {dados.cidade}
          </p>
        </div>
        <div className='cont-dados-indi'>
          <label>
            Rua
          </label>
          <p>
            {dados.rua}
          </p>
        </div>
        <div className='cont-dados-indi'>
          <label>
            DDD
          </label>
          <p>
            {dados.ddd}
          </p>
        </div>
        <div id='returnArrow'>
          <i className="fa-solid fa-arrow-left fa-5x" onClick={() => voltarForm()} />
        </div>
      </div>
    )
  } else {
    var resultados = null
  }
  return (
    <div className='main-container flex-cont flex-col'>
      <Header />
      <div className='flex-cont flex-col' id='container-formulario-resultado'>
        <div className='flex-cont flex-col formulario'>
          <p>Receba informações detalhadas sobre o local apenas com o CEP</p>
          <MaskedInput
            mask={[/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
            placeholder="Digite aqui o CEP!"
            type="text"
            className='input'
            id='cepNumber' />
          <p id='errorMessage'>Por favor, insira um CEP válido</p>
          <SearchButton funcao={() => validarCep()} />
        </div>
        <div className='flex-cont flex-col' id='resultado'>
          {resultados}
        </div>
      </div>
    </div>
  );
}

export default App;
