import renderWithRouter from "../test-utils";
import { User } from "../types";

describe("login page", () => {
  /**
   * Purpose of this test: to make sure that the login page renders without crashing
   */
  it("should render without crashing", () => {
    cy.mount(renderWithRouter("/login"));
    cy.contains("Submit").click();
  });

  /**
   * Purpose of this test: to make sure that the login page validates user input
   */
  it("should validate user input", () => {
    cy.mount(renderWithRouter("/login"));
    const emailInput = cy.get("[data-cy=email]");
    emailInput.type("a@b.c");
    const passwordInput = cy.get("[data-cy=password]");
    passwordInput.type(" ");
    cy.contains("Submit").click();
    cy.get("[data-cy=password_error]").should(
      "contain",
      "Password is required"
    );
  });

  /**
   * Purpose of this test: to make sure that the login page submits valid user input
   */
  it("should submit valid user input", () => {
    cy.intercept("POST", "/api/user/signin", {
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
    cy.mount(renderWithRouter("/login"));
    const emailInput = cy.get("[data-cy=email]");
    emailInput.type("a@b.c");
    const passwordInput = cy.get("[data-cy=password]");
    passwordInput.type("$fsd8fs_a3F0a2%;d1");
    cy.contains("Submit").click();
    cy.contains("Login successful");
    cy.contains("Close").click();
  });
});
