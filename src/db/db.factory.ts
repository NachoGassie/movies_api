import * as mySqlAuth from "./mySql/auth";
import * as mySqlGenres from "./mySql/genres";
import * as mySqlMovies from "./mySql/movies";

import * as PgAuth from "./postgreSql/auth";
import * as PgGenres from "./postgreSql/genres";
import * as PgMovies from "./postgreSql/movies";

export default {
    mySqlDb : {
        auth: mySqlAuth,
        genres: mySqlGenres,
        movies: mySqlMovies,
    },
    pgDb: {
        auth: PgAuth,
        genres: PgGenres,
        movies: PgMovies,
    }
}