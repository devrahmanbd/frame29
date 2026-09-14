import { describe, expect, it } from "vitest";
import {
  newSection,
  newWidget,
  parseBuilderBody,
  productWidgets,
  renderBuilderHtml,
  serializeBuilderBody,
  type BuilderDoc,
} from "./page-builder";

function docWithProducts(): BuilderDoc {
  const section = newSection([12]);
  section.columns[0]!.widgets = [newWidget("products")];
  return { version: 1, sections: [section] };
}

describe("page builder product blocks", () => {
  it("collects product widgets", () => {
    const doc = docWithProducts();
    expect(productWidgets(doc)).toHaveLength(1);
  });

  it("renders an empty state when no cards are supplied", () => {
    expect(renderBuilderHtml(docWithProducts())).toContain("No products to show yet.");
  });

  it("renders supplied cards with escaped titles and links", () => {
    const doc = docWithProducts();
    const id = productWidgets(doc)[0]!.id;
    const html = renderBuilderHtml(doc, {
      [id]: [
        {
          id: "p1",
          title: '<b>Tee</b>',
          slug: "tee",
          imageUrl: null,
          priceMinor: 129900,
          href: "/store/cloudman/p/tee",
        },
      ],
    });
    expect(html).toContain("&lt;b&gt;Tee&lt;/b&gt;");
    expect(html).toContain("/store/cloudman/p/tee");
    expect(html).not.toContain("<b>Tee</b>");
  });

  it("survives a serialise / parse round trip", () => {
    const doc = docWithProducts();
    const parsed = parseBuilderBody(serializeBuilderBody(doc));
    expect(productWidgets(parsed!)).toHaveLength(1);
  });
});
