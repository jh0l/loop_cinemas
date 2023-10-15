import { AUTHENTICATED_USER } from "../context/app-context";
import renderWithRouter from "../test-utils";
import { User } from "../types";

const user: User = {
  name: "name",
  email: "a@b.c",
  password: "$fsd8fs_a3F0a2%;d1",
  createdAt: new Date(),
  updatedAt: new Date(),
  user_id: "abc123",
};

describe("profile page", () => {
  it("should render without crashing", () => {
    cy.mount(renderWithRouter("/profile"));
  });

  it("should display user information", () => {
    cy.intercept("/api/user", {
      type: "user",
      user,
    }).as("getUser");

    localStorage.setItem(AUTHENTICATED_USER, JSON.stringify(user));

    cy.mount(renderWithRouter("/"));
    cy.get('[data-cy="Profile"]').click();
    cy.wait("@getUser").its("response.body.user").should("exist");
    cy.contains(user.name);
    cy.contains(user.email);
  });

  it("should edit user information", () => {
    cy.intercept("GET", "/api/user", {
      type: "user",
      user,
    }).as("getUser");

    cy.intercept("PATCH", "/api/user", {
      type: "user",
      user,
    }).as("patchUser");

    localStorage.setItem(AUTHENTICATED_USER, JSON.stringify(user));

    cy.mount(renderWithRouter("/"));
    cy.get('[data-cy="Profile"]').click();
    cy.get('[data-cy="edit"]').click();
    cy.get('[data-cy="edit_name"]').clear().type("new name");
    cy.get('[data-cy="edit_email"]').clear().type("new@b.c");
    cy.get('[data-cy="edit_submit"]').click();
    cy.wait("@patchUser").its("response.body.user").should("exist");
  });
  // edit name

  it("should delete user", () => {
    cy.intercept("GET", "/api/user", {
      type: "user",
      user,
    }).as("getUser");

    cy.intercept("DELETE", "/api/user", {
      type: "user",
      user,
    }).as("deleteUser");

    localStorage.setItem(AUTHENTICATED_USER, JSON.stringify(user));

    cy.mount(renderWithRouter("/"));
    cy.get('[data-cy="Profile"]').click();
    cy.get('[data-cy="delete"]').click();
    cy.get('[data-cy="delete_submit"]').click();
    cy.wait("@deleteUser").its("response.body.user").should("exist");
  });
});
