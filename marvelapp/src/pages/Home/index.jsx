import { useState } from "react";
//OPÇÕES
import Lista from "../Lista";
//IMG
import Marvel from "../../assets/logo/Group.png";
import MiniHero from "../../assets/icones/heroi/noun_Superhero_2227044.png";
import ToggleOff from "../../assets/toggle/Group 2@2x.png";
import ToggleOn from "../../assets/toggle/Group 6@2x.png";
import Heart from "../../assets/icones/heart/Path@2x.png"
//STYLE
import style from "./index.module.scss";

export default function MainPage() {

    //ESTADOS
    const [toggleImg, setToggleImg] = useState(ToggleOff);
    const [search, setSearch] = useState(null);
    const [searchAux, setSearchAux] = useState(null)
    const [order, setOrder] = useState(null);
    //PAGINAÇÃO
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    //FAVORITOS
    const [favoritos, setFavoritos] = useState(() => {
        const savedFavoritos = localStorage.getItem('favoritos');
        return savedFavoritos ? JSON.parse(savedFavoritos) : [];
    });
    const [showFavorites, setShowFavorites] = useState('Somente favoritos');
    const [amountOf, setAmountOf] = useState(20);

    //FUNÇÃO APAGAR FAVORITO
    function deleteFavorito(id) {
        const novosFavoritos = favoritos.filter(favorito => favorito !== id);
        setFavoritos(novosFavoritos);
        localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
        alert("Favorito deletado")
    };
    //FUNÇÃO SALVAR FAVORITO
    function saveFavorito(id) {
        if (favoritos.includes(id)) {
            deleteFavorito(id)
        } else {
            if (favoritos.length >= 5) {
                alert("Poxa, o máximo são 5 favoritos, desapegue de um para poder salvar esse.");
            } else if (!favoritos.includes(id)) {
                const novosFavoritos = [...favoritos, id];
                setFavoritos(novosFavoritos);
                localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
                alert("Salvo com sucesso")
            }
        }
    };
    //TROCAR ENTRE FAVORITOS E LISTA COMPLETA
    const handleFavorites = () => {
        setShowFavorites(showFavorites === 'Todos os heróis' ? 'Somente favoritos' : 'Todos os heróis')
    }

    //BOTÃO DE VER + HERÓIS
    const handleAmount = () => {
        setAmountOf(amountOf + 20)
    }

    //BOTÃO DE ORDENAR NOMES POR ORDEM DE A/Z
    const handleOrder = () => {
        setToggleImg(toggleImg === ToggleOff ? ToggleOn : ToggleOff);
        setOrder(!order ? '-name' : 'name')
    }

    //MANDAR O NOME DO HERÓI POR PARAMETRO COM O ENTER
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            const value = e.target.value;
            setSearchAux(value === "" ? null : value);
        }
    }

    //FUNÇÃO PAGINAÇÃO
    const itemsPerPage = 20;

    const handlePageChange = (elm) => {
        if (elm > 0 && page <= totalPages) {
            setPage(elm);
        }
    };

    return (
        <>
            <div className={style.header} >
                <img src={Marvel} alt="Logo da Marvel" />
                <h1>Explore o universo</h1>
                <p>
                    Mergulhe no domínio deslumbrante de todos os personagens
                    clássicos que você ama - e aqueles que você descobrirá em breve!
                </p>
                <div>
                    <input
                        placeholder="Procure por heróis"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <div className={style.bar} >
                    <div>
                        <span>Encontrados {amountOf} heróis</span>
                    </div>
                    <div>
                        <div
                            className={style.flex}
                        >

                            <img
                                src={MiniHero}
                                alt="Desenho Super Herói"
                                style={{ height: "26px", width: "auto" }}
                            />
                            <span
                                className={style.redTxt}
                            >Orderar por nome - A/Z</span>
                            <button
                                className={style.btn}
                                onClick={handleOrder}
                            >
                                <img
                                    src={toggleImg}
                                    style={{ height: "40px", width: "auto" }}
                                    alt="Botão de troca"
                                />
                            </button>
                        </div>
                        <div
                            onClick={() => setPage(page === 1 ? 2 : 1)}

                        >
                            <button className={style.btn} onClick={() => handleFavorites()} >
                                <img
                                    src={Heart}
                                    alt="Desenho Coração"
                                    style={{ height: "26px", width: "auto" }}
                                />

                                <span
                                    className={style.redTxt}
                                >{showFavorites}</span>
                            </button>


                        </div>
                    </div>
                </div>
            </div>
            <Lista
                search={searchAux}
                adicionarFavorito={saveFavorito}
                deleteFavorito={deleteFavorito}
                favoritos={favoritos}
                showFavorites={showFavorites}
                amountOf={amountOf}
                handleAmount={handleAmount}
                order={order}
                itemsPerPage={itemsPerPage}
                page={page}
            />
            {
                showFavorites === "Somente favoritos" &&
                <div className={style.pagination}>
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span> {page} de {totalPages} </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Próxima
                    </button>
                </div>
            }
        </>
    )
}