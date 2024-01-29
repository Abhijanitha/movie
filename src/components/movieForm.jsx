import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getGenres } from "../services/genreService";
import { getMovie, saveMovie } from "../services/movieService";

class MovieForm extends Form {
  state = {
    data: { title: "", genreId: "", numberInStock: "", dailyRentalRate: "" },
    genres: [],
    errors: {},
  };
  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number In Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
  };
  //errors['username'] or if we are having an array then errors.find(e=>e.name==='username') that is why to avoid this we will be using an object of errors.
  //   username = React.createRef();
  // componentDidMount(){
  //     this.username.current.focus();
  // }

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id;
      // console.log("movieId:", movieId);

      if (movieId === "new") {
        // console.log("Creating a new movie");
        return;
      }
      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      // if (ex.response && ex.response.status === 404)
      //   this.props.history.replace("/not-found");
    }
  }
  async componentDidMount() {
    // console.log("MovieForm componentDidMount");
    await this.populateGenres();
    await this.populateMovie();
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  doSubmit = async () => {
    try {
      await saveMovie(this.state.data);
      this.props.history.push("/movies");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        // Handle validation errors or other cases where the save was not successful
        // You might want to display an error message to the user
        console.error(ex.response.data);
      }
    }
  };
  
  
  

  render() {
    const { genres } = this.state;

    // Check if genres is defined before rendering the form
    if (!genres) return null;

    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.doSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", genres)}
          {this.renderInput("numberInStock", "Number In Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
