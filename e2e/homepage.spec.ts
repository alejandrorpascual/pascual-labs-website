import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("presents the approved company identity and five apps", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Pascual Code Labs/);
  await expect(page.getByRole("heading", { level: 1, name: "Thoughtful apps for everyday life." })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Apps in development" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(5);
  await expect(page.getByText("In development", { exact: true })).toHaveCount(5);

  for (const product of [
    "Walk Blocker",
    "Macro Chef",
    "Colofon",
    "Music discovery app",
    "Game discovery app",
  ]) {
    await expect(page.getByRole("heading", { level: 3, name: product })).toBeVisible();
  }

  await expect(page.getByRole("link", { name: "alejandro@pascual-labs.com" })).toHaveAttribute(
    "href",
    "mailto:alejandro@pascual-labs.com",
  );
});

test("primary navigation works and decorative images load", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View the apps" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Apps in development" })).toBeInViewport();

  const imageStates = await page.locator("img").evaluateAll((images) =>
    images.map((image) => ({
      complete: (image as HTMLImageElement).complete,
      naturalWidth: (image as HTMLImageElement).naturalWidth,
    })),
  );
  expect(imageStates.every(({ complete, naturalWidth }) => complete && naturalWidth > 0)).toBe(true);
});

test("has no automated WCAG A or AA violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("never overflows the viewport horizontally", async ({ page }) => {
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
});
