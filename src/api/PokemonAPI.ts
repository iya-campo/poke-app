import Configuration from "server/Configuration";

export default class PokemonAPI {

    static fetchPokemon = (): Promise<any> => {
        return (
            fetch(Configuration.PokemonURL.FetchPokemon.apiURL)
            .then((res) => res.json())
            .then((res) => {
                return Promise.resolve(res)
            })
            .catch((err) => {
                return Promise.reject(err);
            })
        )
    }

}