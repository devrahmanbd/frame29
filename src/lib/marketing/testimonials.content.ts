/**
 * Homepage testimonial / case-study deck.
 *
 * Integrity rule (same as `/customers`): a merchant name, quote or number only
 * loses its "sample" label once written consent is filed and the figure is
 * queryable from that merchant's own dashboard. Until then this deck ships as
 * clearly-labelled placeholders — the layout is real, the badge tells the
 * reader the profiles are illustrative, and swapping in a signed-off story is
 * a one-line edit: fill in `merchant`, set `verified: true`.
 */

export type CaseStudy = {
  id: string;
  /** Two- or three-letter wordmark tile used in place of a customer logo. */
  mark: string;
  merchant: string;
  sector: string;
  city: string;
  quote: string;
  attribution: string;
  results: readonly { label: string; value: string }[];
  /** True only when consent is filed and every figure is dashboard-checkable. */
  verified: boolean;
};

export const TESTIMONIALS = {
  eyebrow: "Case studies",
  title: "What changes in the first ninety days.",
  sub: "Three merchant profiles we build against: a Facebook seller, a high-street shop going online, and a brand leaving a marketplace. Figures are the outcomes each setup is designed to produce.",
  disclaimer:
    "Sample profiles. Named merchant stories are published only with written consent and figures we can show you inside that merchant's dashboard.",
  cta: "Read verified customer stories",
  cases: [
    {
      id: "facebook",
      mark: "FS",
      merchant: "Facebook-first apparel seller",
      sector: "Apparel",
      city: "Dhaka",
      quote:
        "Orders used to live in comment threads and three phone notebooks. Now the buyer types the address once, the courier is booked from the same screen, and I stop losing the order I already sold.",
      attribution: "Profile: comment-to-order seller, roughly 40 orders a day",
      results: [
        { label: "Order capture", value: "One checkout link" },
        { label: "Address re-entry", value: "Removed" },
        { label: "Courier booking", value: "In the order drawer" },
      ],
      verified: false,
    },
    {
      id: "retail",
      mark: "HS",
      merchant: "High-street shop adding an online counter",
      sector: "Homeware",
      city: "Chattogram",
      quote:
        "Counter sales and website sales draw down the same stock. What sells at the shop stops selling online in the same second, so we stopped apologising for items we could not ship.",
      attribution: "Profile: single storefront, POS plus online",
      results: [
        { label: "Stock ledger", value: "One, shared" },
        { label: "Month-end merge", value: "No spreadsheet" },
        { label: "Oversell risk", value: "Removed at source" },
      ],
      verified: false,
    },
    {
      id: "marketplace",
      mark: "MB",
      merchant: "Brand leaving a marketplace",
      sector: "Beauty",
      city: "Sylhet",
      quote:
        "We were paying a commission on every order and still did not own the customer. On our own domain the repeat buyer is ours, and the export button means we can leave whenever we want.",
      attribution: "Profile: brand previously paying 8–20% marketplace commission",
      results: [
 { label: "Per-order commission", value: "BDT 0" },
        { label: "Customer records", value: "Owned and exportable" },
        { label: "Domain and SEO", value: "Yours" },
      ],
      verified: false,
    },
  ],
} as const satisfies {
  eyebrow: string;
  title: string;
  sub: string;
  disclaimer: string;
  cta: string;
  cases: readonly CaseStudy[];
};
