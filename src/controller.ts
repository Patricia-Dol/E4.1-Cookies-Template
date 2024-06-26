import { IncomingMessage, ServerResponse } from "http";
import { database } from "./model";
import { renderTemplate } from "./view";
import { stringify } from "querystring";

/**
 * All of these function have a TODO comment. Follow the steps in the
 * instructions to know which function to work on, and in what order.
 */

export const getHome = async (req: IncomingMessage, res: ServerResponse) => {
    /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Welcome message to the view based on the language.
     */

    let theCookies = getCookies(req)
    // HELP THE COOKIE DOESN'T WANT TO BE DISPLAYED!
    console.log(theCookies)

    let language = theCookies["language"]

    const cookies = [];

    if(language == null){
        language = "English"
        // need to add it to the list of headers
        cookies.push("language=English")
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    cookies.push("likes=somethingYouLike")
    cookies.push("lovesWebDev=false")
    res.setHeader("Set-Cookie", cookies);
  if(language == "French" || language == "fr"){
    res.end(
        await renderTemplate("src/views/HomeView.hbs", {
            title: "Bonjour",
            cookies: req.headers.cookie?.toString(),
        }),

    );
  }
  // The other cases will be in english since I can make an if statement for each language
  else{
    res.end(
        await renderTemplate("src/views/HomeView.hbs", {
            title: "Welcome",
            cookies: req.headers.cookie?.toString(),
        }),

    );
  }
    
};

export const changeLanguage = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
        /** TODO:
         * 1. Parse the body of the request.
         * 2. Extract the language from the body. This data is coming from a form submission.
         * 3. Set the language cookie.
         * 4. Redirect the user back to the previous page using the referer header.
         *    @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
         * 5. End the response.
         */
        let parseReq = parseBody(req)
        let theCookies = getCookies(req)
        let language = theCookies["language"];
        res.end(
            
        );

    }

export const getOnePokemon = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Pokemon data to the view based on the language.
     */
    let theCookies = getCookies(req)
    let language = theCookies["language"]

    const id = Number(req.url?.split("/")[2]);
    const foundPokemon = database.find((pokemon) => pokemon.id === id);

    if (!foundPokemon) {
        res.statusCode = 404;
        res.end(
            await renderTemplate("src/views/ErrorView.hbs", {
                title: "Error",
                message: "Pokemon not found!",
            }),
        );
        return;
    }

    if(language == "French"){
        let thePokemon = {name:foundPokemon.name.fr,type:foundPokemon.type.fr,info:foundPokemon.info.fr,image:foundPokemon.image}
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ShowView.hbs", {
                pokemon: thePokemon,
            }),
        );
    }
    else{
        let thePokemon = {name:foundPokemon.name.en,type:foundPokemon.type.en,info:foundPokemon.info.en,image:foundPokemon.image}
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ShowView.hbs", {
                pokemon: thePokemon,
            }),
        );
    }
};

export const getAllPokemon = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Pokemon data to the view based on the language.
     */
    let theCookies = getCookies(req)
    let language = theCookies["language"]

    if(language == "French"){
        let pokemons = database.map((poke) => {
            return{
                id: poke.id,
                name: poke.name.fr,
                type: poke.type.fr,
                info: poke.info.fr,
                image: poke.image}
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ListView.hbs", {
                pokemon: pokemons,
            }),
        );
    }
    else{
        let pokemons = database.map((poke) => {
            return{
                id: poke.id,
                name: poke.name.en,
                type: poke.type.en,
                info: poke.info.en,
                image: poke.image}
        });
        
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ListView.hbs", {
                pokemon: pokemons,
            }),
        );
    }
};

const parseBody = async (req: IncomingMessage) => {
    return new Promise<string>((resolve) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            resolve(body);
        });
    });
};

/**
 * @returns The cookies of the request as a Record type object.
 * @example name=Pikachu;type=Electric => { "name": "Pikachu", "type": "Electric" }
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
 */
const getCookies = (req: IncomingMessage): Record<string, string> => {
    // header of the cookie
    let cookieHeader = req.headers.cookie
    // if there are multiple cookies they will be divided by ";" 
    let indivodualCookies = cookieHeader?.split("; ")
    //record == dictionaries (object of key vale references)
    let cookies: Record<string,string> = {}

    indivodualCookies?.forEach(item => {
        let halfCookie = item.split("=")
        cookies[halfCookie[0]] = halfCookie[1]
    })


    /** TODO:
     * 1. Get the cookie header from the request.
     * 2. Parse the cookie header into a Record<string, string> object.
     *    - Split the cookie header by the semicolon.
     *    - Split each cookie by the equals sign.
     *    - Assign the name as the key and the value as the value.
     * 3. Return the object.
     */

    return cookies;
};
