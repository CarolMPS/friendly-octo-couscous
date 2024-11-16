import { useState } from "react";
import style from "./index.module.scss";
//IMGs
import HeartEmpty from "../../assets/icones/heart/Path Copy 2.png";
import HeartFull from "../../assets/icones/heart/Path.png";

//
import { useNavigate } from "react-router-dom";

export default function Card({nome, hearted, img, id, item, adicionarFavorito, favoritos }) {

    //NAVIGATE
    const navigate = useNavigate();
    //NAVEGAR ATÉ A PÁGINA DE DETALHE DO PERSONAGEM
    const handleNavigation = () => {
        navigate(`/character/${id}`);
    };

    return (
        <div
            className={style.card}
        >
            <img
                className={style.heroImg}
                src={img}

            />
            <div
                className={style.btnDiv}
            >
                <button
                    onClick={handleNavigation}
                >
                    <span>{nome}</span>
                </button>

                <button onClick={()=>adicionarFavorito(id)}>
                    <img
                        src={ favoritos.includes(id) ? HeartFull : HeartEmpty } 
                        style={{height: '20px', width: '20px'}}
                    />
                </button>
            </div>
        </div>
    )
}