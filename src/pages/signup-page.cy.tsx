// cypress unit tests for signup page
import renderWithRouter from "../test-utils";
import { User } from "../types";

describe("signup page", () => {
  it("should render without crashing", () => {
    cy.mount(renderWithRouter("/signup"));
    cy.contains("Submit").click();
  });
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
  it("should submit valid user input", () => {
    cy.intercept("POST", "/api/user/signup", (req) => {
      req.reply({
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
  });
});
