import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import style from "./index.module.scss";
import axios from 'axios';
import md5 from 'md5';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
//IMG
import HeartEmpty from "../../assets/icones/heart/Path Copy 2.png";
import HeartFull from "../../assets/icones/heart/Path@2x.png";
import Book from "../../assets/icones/book/Group.png";
import Movie from "../../assets/icones/video/Shape.png";
import Rating from "../../assets/review/Group 4.png";
import Marvel from "../../assets/logo/Group.png";


export default function Detail() {

    //ID que vem da url
    const { id } = useParams();
    //ESTADOS
    const [hero, setHero] = useState('');
    const [comics, setComics] = useState();
    const [loading, setLoading] = useState(false);
    const [latestComic, setLatestComic] = useState();
    const [favoritos, setFavoritos] = useState(() => {
        const savedFavoritos = localStorage.getItem('favoritos');
        return savedFavoritos ? JSON.parse(savedFavoritos) : [];
    });

    //NAVIGATE
    const navigate = useNavigate();

    // Váriaveis iniciais do token
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY
    const ts = Date.now().toString();
    const hash = md5(ts + privateKey + publicKey);

    // Função que pega a lista de pergonagem 
    const get_detail = async () => {
        try {
            const response = await axios.get('https://gateway.marvel.com:443/v1/public/characters/' + id, {
                params: {
                    ts: ts,
                    apikey: publicKey,
                    hash: hash,
                }
            })
            const [heroi] = response?.data?.data?.results;
            setHero(heroi);
        }
        catch (error) {
            console.log('Erro ao buscar personagens');
            throw error;
        }
    }
    //função que pega lista de comics
    const get_comics = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://gateway.marvel.com:443/v1/public/characters/' + id + '/comics', {
                params: {
                    ts: ts,
                    apikey: publicKey,
                    hash: hash,
                    limit: 10,
                }
            })
            setComics(response?.data?.data?.results)
            setLoading(false);
            const data = response?.data?.data?.results[0]?.modified;
            setLatestComic(data?.split('T')[0])
        }
        catch (error) {
            console.log('Erro ao buscar comics');
            throw error;
        }
    }

    useEffect(() => {
        get_detail();
        get_comics();
    }, [id]);

    //FUNÇÃO APAGAR FAVORITO
    function deleteFavorito(id) {
        const novosFavoritos = favoritos.filter(favorito => favorito !== Number(id));
        setFavoritos(novosFavoritos);
        localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
        alert("Favorito deletado")
    };
    //FUNÇÃO SALVAR FAVORITO
    function saveFavorito(id) {
        if (favoritos.includes(Number(id))) {
            deleteFavorito(id)
        } else {
            if (favoritos.length >= 5) {
                alert("Poxa, o máximo são 5 favoritos, desapegue de um para poder salvar esse.");
            } else if (!favoritos.includes(id)) {
                const novosFavoritos = [...favoritos, Number(id)];
                setFavoritos(novosFavoritos);
                localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
                alert("Salvo com sucesso")
            }
        }
    };
    
    return (
        <>
        <div className={style.mainContainer}>

            <div className={style.btnContainer} >
                <img src={Marvel} onClick={() => navigate(-1)} />
                <input placeholder="Procure por heróis" />
            </div>
            {
                loading ?

                    <div>
                        <img
                            style={{ width: '200px', height: '200px', cursor: "pointer" }}
                            alt="Wanda loading"
                            src="https://www.icegif.com/wp-content/uploads/2024/07/venom-icegif-3.gif"
                        />
                        <br />
                        <br />
                        Carregando ...
                    </div>
                    :
                    <> <div
                        className={style.container}
                    >
                        <div>
                            <div className={style.title} >
                                <h2>{hero.name}</h2>
                                <img
                                    src={favoritos?.includes(Number(id)) ? HeartFull : HeartEmpty}
                                    style={{ width: '20px', height: '20px' }}
                                    onClick={()=> saveFavorito(id)}
                                />
                            </div>
                            <p style={{ color: '#898989' }} >
                                {hero.description || 'Descrição não disponível'}
                            </p>

                            <div>
                                <div className={style.flex} >
                                    <div>
                                        <p>
                                            Quadrinhos
                                        </p>
                                        <img src={Book} style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                                        <span>{hero?.stories?.available}</span>
                                    </div>
                                    <div>
                                        <p>Filmes</p>
                                        <img src={Movie} style={{ width: '20px', height: '16px', marginRight: '12px' }} />
                                        <span>{hero?.series?.available}</span>
                                    </div>
                                </div>
                                <div>
                                    <p>Rating</p>
                                    <img src={Rating} style={{ width: 'auto', height: '16px', marginRight: '12px' }} />
                                </div>
                                <div>
                                    <p>  Último quadrinho:
                                        <span>
                                            {`  ${latestComic && format(new Date(latestComic), 'dd MMM. yyyy', { locale: ptBR })}`}
                                        </span>
                                    </p>

                                    {/* <br />
                                    {latestComic} */}
                                </div>
                            </div>
                        </div>
                        <div>
                            <img
                                src={`${hero.thumbnail?.path}.${hero.thumbnail?.extension}`}
                            />
                        </div>
                    </div>
                        <div className={style.comic} >
                            <h3>Últimos lançamentos</h3>
                            <div className={style.comicDiv} >
                                {
                                    comics &&
                                    comics.map((item) => {
                                        return (
                                            <div className={style.comicCard} key={item.id} >
                                                <img
                                                    src={`${item.thumbnail.path}.${item.thumbnail.extension}`}
                                                />
                                                <br />
                                                <span>
                                                    {`${item?.title?.slice(0, 20)}...`}
                                                    {/* {item?.title} */}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </>

            }
        </div>
        </>
    )
}