export async function getPokemon(page:number) {
    const request = new Request(`https://pokeapi.co/api/v2/ability/?limit=9&offset=${(page-1)*9}`, {
        method: "GET"
    });
    const response = await fetch(request)

    if (!response.ok) {
        throw new Error("Fail to fetch");
    }
    console.log(response)
    return await response.json();
}