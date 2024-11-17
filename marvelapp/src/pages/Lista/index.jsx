import { useEffect, useState } from "react";
import Card from "../../components/Card"
import style from "./lista.module.scss";
import axios from 'axios';
import md5 from 'md5';

export default function Lista({
    search,
    order,
    adicionarFavorito,
    favoritos,
    showFavorites,
    amountOf,
    itemsPerPage,
    page
}) {
    //ESTADOS
    const [heroes, setHeroes] = useState('');
    const [loading, setLoading] = useState(false);
    //MOSTRAR FAVORITOS
    const filteredHeroes = showFavorites === 'Todos os heróis' ?
        heroes && heroes?.filter(hero => favoritos?.includes(hero.id))
        : heroes;

    // Váriaveis iniciais
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY
    const ts = Date.now().toString();
    const hash = md5(ts + privateKey + publicKey);

    // Função que pega a lista de pergonagens com 
    const get_list = async () => {
        setLoading(true);
        const offset = (page - 1) * itemsPerPage;
        try {
            const response = await axios.get('https://gateway.marvel.com:443/v1/public/characters', {
                params: {
                    ts: ts,
                    apikey: publicKey,
                    hash: hash,
                    limit: amountOf,
                    name: search,
                    orderBy: order,
                    offset:offset
                }
            })
            setHeroes(response.data.data.results);
            setLoading(false)
        }
        catch (error) {
            console.log('Erro ao buscar personagens');
            throw error;
        }
    }

    useEffect(() => {
        get_list();
    }, [search, order, amountOf, page])

    return (
        <div className={style.main} >
            {
                loading ?
                    <div>
                        <img
                            style={{ width: '100px', height: '100px' }}
                            alt="Wanda loading"
                            src="https://www.icegif.com/wp-content/uploads/2022/01/icegif-1715.gif"
                        />
                        <br />
                        <br />
                        Carregando ...
                    </div>
                    :
                    <>
                        {
                            heroes.length > 0 &&
                            filteredHeroes.map((item) => {
                                return (
                                    <Card
                                        key={item.id}
                                        nome={item.name}
                                        hearted
                                        id={item.id}
                                        img={`${item.thumbnail.path}.${item.thumbnail.extension}`}
                                        adicionarFavorito={adicionarFavorito}
                                        favoritos={favoritos}
                                    />
                                )
                            })
                        }
                    </>
            }
        </div>
    )
}