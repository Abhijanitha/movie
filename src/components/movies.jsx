import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import Pagenation from "./common/pagenation";
import { pagenate } from "../utils/pagenate";
import ListGroup from "./common/listgroup";
import { getGenres } from "../services/genreService";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBox from "./searchBox";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
  };

  //this method will be called when an instance of this componet is rendered in the DOM
  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: " ", name: "All Genres" }, ...data];
    const { data: movies } = await getMovies();
    console.log("Movies data:", data);
    this.setState({ movies, genres });
  }

  handleDelete = async (movie) => {
    // console.log(movie);
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    // this.setState({movies:movies})
    this.setState({ movies });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("this movie has already been deleted");
      }
      this.setState({ movies: originalMovies });
    }
  };
  handleLike = (movie) => {
    // console.log("like clicked",movie);
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };
  handlePageChange = (page) => {
    // console.log(page);
    this.setState({ currentPage: page });
  };
  handleGenreSelect = (genre) => {
    this.setState({
      selectedGenre: genre === "All Genres" ? null : genre,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };
  handleSort = (sortColumn) => {
    // console.log(path);
    this.setState({ sortColumn });
  };
  getPageData = () => {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      searchQuery,
      movies: allMovies,
      sortColumn,
    } = this.state;
    let filtered = allMovies;
    // const filtered =
    //   selectedGenre && selectedGenre._id !== " "
    //     ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
    //     : allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    if (selectedGenre && selectedGenre._id && selectedGenre._id !== " ")
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);
    // else filtered = allMovies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = pagenate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: movies };
  };
  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, sortColumn } = this.state;
    const {user} =this.props;
    if (count === 0) return <p>There are no movies in the database.</p>;
    const { totalCount, data: movies } = this.getPageData();
    return (
      <div className="row">
        <div className="col-2">
          <ListGroup
            items={this.state.genres}
            // textProperty="name"
            // valueProperty="_id"
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {/* {user && ( )} */}
          <Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Movie
          </Link>
          <p>Showing {totalCount} movies in the database.</p>
          <SearchBox value={this.searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagenation
            itemsCount={totalCount}
            pageSize={pageSize}
            onCurrentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}
//this.state.movies.length=count;
export default Movies;
