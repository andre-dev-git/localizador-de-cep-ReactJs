export default function SearchButton(props) {

    return (
        <button className="flex-cont search" onClick={() => props.funcao()}>
            <h3>Pesquisar</h3>
            <span></span>
        </button>
    )
}