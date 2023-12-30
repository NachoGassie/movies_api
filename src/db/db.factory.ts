import * as mySqlAuth from "@db/mySql/auth";
import * as mySqlGenres from "@db/mySql/genres";
import * as mySqlMovies from "@db/mySql/movies";

export default {
    mySqlDb : {
        auth: mySqlAuth,
        genres: mySqlGenres,
        movies: mySqlMovies,
    }
}