export async function getPokemon() {
    const request = new Request("https://pokeapi.co/api/v2/ability/?limit=9&offset=0", {
        method: "GET"
    });
    const response = await fetch(request)

    if (!response.ok) {
        throw new Error("Fail to fetch");
    }
    console.log(response)
    return await response.json();
}