// cypress unit tests for signup page
import renderWithRouter from "../test-utils";
import { User } from "../types";

describe("signup page", () => {
  /**
   * Purpose of this test: to make sure that the signup page renders without crashing
   */
  it("should render without crashing", () => {
    cy.mount(renderWithRouter("/signup"));
    cy.contains("Submit").click();
  });

  /**
   * Purpose of this test: to make sure that the signup page validates user input
   */
  it("should validate user input", () => {
    cy.mount(renderWithRouter("/signup"));
    const nameInput = cy.get("[data-cy=name]");
    nameInput.type("name");
    const emailInput = cy.get("[data-cy=email]");
    emailInput.type("a@b.c");
    const passwordInput = cy.get("[data-cy=password]");
    passwordInput.type("password");
    const confirmPasswordInput = cy.get("[data-cy=confirm_password]");
    confirmPasswordInput.type("password");
    cy.contains("Submit").click();
    cy.get("[data-cy=password_error]").should(
      "contain",
      "Password must be at least 14 characters long"
    );
  });

  /**
   * Purpose of this test: to make sure that the signup page submits valid user input
   */
  it("should submit valid user input", () => {
    cy.intercept("POST", "/api/user/signup", {
      type: "user",
      user: {
        name: "name",
        email: "a@b.c",
        password: "$fsd8fs_a3F0a2%;d1",
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: "abc123",
      } as User,
    });
    cy.mount(renderWithRouter("/signup"));
    const nameInput = cy.get("[data-cy=name]");
    nameInput.type("name");
    const emailInput = cy.get("[data-cy=email]");
    emailInput.type("a@b.c");
    const passwordInput = cy.get("[data-cy=password]");
    passwordInput.type("$fsd8fs_a3F0a2%;d1");
    const confirmPasswordInput = cy.get("[data-cy=confirm_password]");
    confirmPasswordInput.type("$fsd8fs_a3F0a2%;d1");
    cy.contains("Submit").click();
    cy.contains("Welcome to Loop Cinemas! You have successfully signed up.");
    cy.contains("Close").click();
  });
});
