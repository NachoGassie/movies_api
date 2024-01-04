import * as mySqlAuth from "./mySql/auth";
import * as mySqlGenres from "./mySql/genres";
import * as mySqlMovies from "./mySql/movies";

export default {
    mySqlDb : {
        auth: mySqlAuth,
        genres: mySqlGenres,
        movies: mySqlMovies,
    }
}