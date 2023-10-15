import { AUTHENTICATED_USER } from "../context/app-context";
import renderWithRouter from "../test-utils";
import { Movie, User } from "../types";

const user: User = {
  name: "name",
  email: "a@b.c",
  password: "$fsd8fs_a3F0a2%;d1",
  createdAt: new Date(),
  updatedAt: new Date(),
  user_id: "abc123",
};

const movie: Movie = {
  movie_id: "123",
  title: "title",
  year: "2021",
  poster_url: "Document2_htm_f6f16106c7f9f014",
  plot: "plot",
  content_rating: "content_rating",
  genres: ["genre1", "genre2"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("review movie page", () => {
  /**
   * Purpose of this test: to make sure that the review movie page renders without crashing
   */
  it("should render without crashing", () => {
    cy.mount(renderWithRouter("/reviews/123"));
  });

  /**
   * Purpose of this test: to make sure reviews with content that is more than 600 characters is rejected
   */
  it("should reject reviews with content that is more than 600 characters", () => {
    localStorage.setItem(AUTHENTICATED_USER, JSON.stringify(user));
    cy.intercept("/api/user", {
      type: "user",
      user,
    });
    cy.intercept("GET", "/api/reviews", {
      type: "reviews",
      reviews: [],
    });
    cy.intercept("GET", "/api/movies", {
      type: "movies",
      movies: [movie],
    }).then(() => {
      cy.mount(renderWithRouter("/reviews/123"));

      // set value of element, (faster than typing)
      cy.get('[data-cy="content"]')
        .invoke("val", "a".repeat(601))
        .trigger("change");

      cy.get('[data-cy="submit"]').click();

      cy.contains("Content cannot be longer than 600 characters");
    });
  });

  /**
   * Purpose of this test: to make sure that users need to be authenticated to add reviews
   */
  it("should reject reviews if user is not authenticated", () => {
    cy.intercept("GET", "/api/reviews", {
      type: "reviews",
      reviews: [],
    });
    cy.intercept("GET", "/api/movies", {
      type: "movies",
      movies: [movie],
    }).then(() => {
      cy.mount(renderWithRouter("/reviews/123"));

      // should not contain form
      cy.contains("Submit").should("not.exist");

      cy.contains("You are not logged in.");
    });
  });

  /**
   * Purpose of this test: should accept valid reviews
   */
  it("should accept valid reviews", () => {
    localStorage.setItem(AUTHENTICATED_USER, JSON.stringify(user));
    cy.intercept("/api/user", {
      type: "user",
      user,
    });
    cy.intercept("GET", "/api/reviews", {
      type: "reviews",
      reviews: [],
    });
    cy.intercept("POST", "/api/reviews", {
      type: "success",
      msg: "Review submitted successfully",
    });
    // intercept user reviews lookup
    cy.intercept("GET", "/api/reviews?user_id=abc123", {
      type: "reviews",
      reviews: [],
    });

    cy.intercept("GET", "/api/movies", {
      type: "movies",
      movies: [movie],
    }).then(() => {
      cy.mount(renderWithRouter("/reviews/123"));

      // set value of element, (faster than typing)
      cy.get('[data-cy="content"]').type("bing bong");
      cy.get('[data-cy="human"]').type("I am not a robot");

      cy.get('[data-cy="submit"]').click();

      cy.contains("Review submitted successfully");
    });
  });
});
