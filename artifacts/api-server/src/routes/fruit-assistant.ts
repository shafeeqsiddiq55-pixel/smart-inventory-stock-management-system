import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { gte, ilike, or, sql } from "drizzle-orm";
import { fruitKnowledge } from "../data/fruit-knowledge";

const disclaimer = "General nutrition information only. This assistant does not provide medical diagnosis or treatment.";
const medicalFollowUp = "For medical concerns, please consult a qualified doctor or healthcare professional.";

const normalizeText = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const parseBudget = (question: string): number | null => {
  const matches = question.match(/(?:under|below|less than|upto|up to|within|budget|affordable|cheaper than|less than)\s*(?:rs\.?|inr\.?|₹)?\s*(\d{1,5})/i);
  if (!matches?.[1]) return null;
  return Number.parseFloat(matches[1]);
};

const hasFruitContext = (question: string) => {
  const normalized = normalizeText(question);

  if (/(not a fruit question|not fruit related|not about fruits|fruitless question|unrelated question|something else)/.test(normalized)) {
    return false;
  }

  const fruitTerms = [
    "fruit", "fruits", "apple", "guava", "orange", "banana", "watermelon",
    "nutrition", "fiber", "hydration", "sugar", "potassium", "vitamin",
    "organic", "price", "cheap", "available", "stock", "compare", "benefits"
  ];
  return fruitTerms.some((term) => normalized.includes(term));
};

const detectMedicalConcern = (question: string) => {
  const normalized = normalizeText(question);
  const medicalTerms = [
    "fever", "diabetes", "sugar disease", "blood sugar", "illness", "doctor",
    "treatment", "cure", "disease", "medical", "infection", "pain"
  ];
  return medicalTerms.some((term) => normalized.includes(term));
};

const getFruitNameMatches = (question: string) => {
  const normalized = normalizeText(question);
  return fruitKnowledge.filter((fruit) => {
    const fruitName = normalizeText(fruit.name);
    return normalized.includes(fruitName) || normalized.includes(fruit.name.toLowerCase());
  });
};

const detectIntent = (question: string) => {
  const normalized = normalizeText(question);

  if (/(low sugar|lower sugar|less sugar|sugar conscious|low natural sugar|not much sugar|sugar wise)/.test(normalized)) return "low-sugar";
  if (/(high fiber|more fiber|fiber rich|fiber-rich|rich in fiber|fibre rich|high fibre|good fiber)/.test(normalized)) return "high-fiber";
  if (/(hydration|good for hydration|high water|water rich|water-rich|hydrating|rehydrat|quench thirst|high water content)/.test(normalized)) return "hydration";
  if (/(potassium|rich in potassium|contains potassium)/.test(normalized)) return "potassium";
  if (/(vitamin|nutrient|nutrition|benefits|healthy fruit|good for health)/.test(normalized)) return "nutrition";
  if (/(compare|comparison|which is better|difference between|vs\.?|versus)/.test(normalized)) return "compare";
  if (/(price|cost|cheap|budget|under\s*₹|under\s*rs|affordable|lower price|cheaper)/.test(normalized)) return "price";
  if (/(availability|available|in stock|stock|store|ready to ship|deliver|my shop)/.test(normalized)) return "availability";
  if (/(organic|organic fruit|chemical free|chemical-free|pesticide free|non gmo)/.test(normalized)) return "organic";
  if (/(banana|apple|orange|guava|watermelon)/.test(normalized)) return "fruit-name";

  return "general";
};

const scoreFruitMatch = (fruit: (typeof fruitKnowledge)[number], question: string) => {
  const normalized = normalizeText(question);
  const name = normalizeText(fruit.name);
  let score = 0;

  if (normalized.includes(name)) score += 30;

  const benefitText = `${fruit.benefits.join(" ")} ${fruit.generalInfo} ${fruit.name}`.toLowerCase();
  if (/(fiber|fibre)/.test(normalized) && /fiber|fibre/i.test(benefitText)) score += 20;
  if (/(hydrat|water|thirst)/.test(normalized) && /(hydration|water)/i.test(benefitText)) score += 20;
  if (/(potassium)/.test(normalized) && /potassium/i.test(benefitText)) score += 20;
  if (/(sugar|low sugar|less sugar)/.test(normalized) && /low|moderate/i.test(fruit.naturalSugar)) score += 20;
  if (/(organic)/.test(normalized) && fruit.name.toLowerCase().includes("apple")) score += 5;

  if (/(vitamin|nutrition|healthy|benefits)/.test(normalized)) score += 10;
  if (fruit.benefits.some((value) => normalized.includes(normalizeText(value)))) score += 15;
  if (fruit.generalInfo && normalized.includes(normalizeText(fruit.generalInfo).split(" ")[0])) score += 5;

  return score;
};

const findRelevantFruits = (question: string) => {
  const normalized = normalizeText(question);
  const namedMatches = getFruitNameMatches(question);
  if (namedMatches.length > 0) {
    return namedMatches;
  }

  const intent = detectIntent(question);
  const scored = fruitKnowledge
    .map((fruit) => ({ fruit, score: scoreFruitMatch(fruit, question) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ fruit }) => fruit);

  if (scored.length > 0) return scored;

  if (intent === "low-sugar") return fruitKnowledge.filter((fruit) => ["Low", "Low to Moderate"].includes(fruit.naturalSugar));
  if (intent === "high-fiber") return fruitKnowledge.filter((fruit) => fruit.benefits.some((benefit) => /fiber/i.test(benefit)));
  if (intent === "hydration") return fruitKnowledge.filter((fruit) => ["Very High", "High"].includes(fruit.waterContent));
  if (intent === "potassium") return fruitKnowledge.filter((fruit) => fruit.benefits.some((benefit) => /potassium/i.test(benefit)));
  if (intent === "compare") return fruitKnowledge.slice(0, 4);
  if (intent === "price") return fruitKnowledge.slice(0, 4);
  if (intent === "availability") return fruitKnowledge.slice(0, 4);
  if (intent === "organic") return fruitKnowledge.filter((fruit) => fruit.name.toLowerCase() === "apple" || fruit.name.toLowerCase() === "orange");

  return fruitKnowledge.slice(0, 3);
};

const buildProductShape = (product: typeof productsTable.$inferSelect) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  categoryId: product.categoryId,
  categoryName: "Fruit",
  description: product.description ?? null,
  price: Number.parseFloat(String(product.price)),
  discountPrice: product.discountPrice ? Number.parseFloat(String(product.discountPrice)) : null,
  stock: product.stock,
  imageUrl: product.imageUrl ?? null,
  rating: 4.5,
  reviewCount: 0,
  isFeatured: product.isFeatured,
  isOrganic: product.isOrganic,
  weightOptions: product.weightOptions ?? null,
  createdAt: product.createdAt,
});

const buildAnswer = (question: string, fruits: typeof fruitKnowledge, intent: string) => {
  const normalized = normalizeText(question);
  const names = fruits.map((fruit) => fruit.name).join(", ");

  if (/(fever|diabetes|disease|cure|treat|medical|doctor)/.test(normalized)) {
    return `For general nutrition, ${names} may be part of a balanced eating pattern, but fruit alone is not a treatment. ${medicalFollowUp}`;
  }

  if (intent === "low-sugar") {
    return `For lower natural sugar choices, ${names} are reasonable options. They generally have a lighter sugar profile compared with sweeter fruit choices.`;
  }

  if (intent === "high-fiber") {
    return `${names} are good fiber choices. Fiber helps support digestion and can be part of a balanced diet.`;
  }

  if (intent === "hydration") {
    return `${names} are good for hydration because they have high water content and refreshing nutrients.`;
  }

  if (intent === "potassium") {
    return `${names} are good options for potassium, a mineral important for normal nerve and muscle function.`;
  }

  if (intent === "compare") {
    return `Comparing these fruits: ${names}. Their main differences are in sugar, fiber, hydration and nutrient density, so the best choice depends on your goal.`;
  }

  if (intent === "price") {
    return `Budget-friendly fruit picks often include ${names}. Price can vary by season and stock in the shop.`;
  }

  if (intent === "availability") {
    return `These fruits are commonly available when stock is healthy: ${names}. Check the current product list for the most up-to-date availability.`;
  }

  if (intent === "organic") {
    return `Organic fruit options may include ${names}. Organic fruit is grown with different production practices, and availability varies by season and stock.`;
  }

  if (intent === "fruit-name") {
    return `${names} are fruit options that match your question. In general, they provide a mix of fiber, hydration, and nutrients as part of a balanced diet.`;
  }

  return `A few suitable fruit options are ${names}. They can contribute fiber, hydration, and important nutrients as part of a balanced diet.`;
};

const router: IRouter = Router();

router.post("/fruit-assistant", async (req, res): Promise<void> => {
  const sendJson = (statusCode: number, payload: Record<string, unknown>) => {
    res.status(statusCode);
    res.setHeader("Content-Type", "application/json");
    res.json(payload);
  };

  try {
    const question = typeof req.body?.question === "string" ? req.body.question : "";

    if (!question.trim()) {
      sendJson(400, { error: "A fruit question is required." });
      return;
    }

    const normalizedQuestion = normalizeText(question);

    if (!hasFruitContext(question)) {
      sendJson(200, {
        answer: "I’m designed for fruit-related questions, nutrition, fruit comparisons, pricing, stock, and availability. Please ask about fruits or fruit products.",
        intent: "unsupported",
        fruits: [],
        products: [],
        disclaimer,
        question,
      });
      return;
    }

    const intent = detectIntent(question);
    const selectedFruits = findRelevantFruits(question).slice(0, 4);

    let productRows = await db.select().from(productsTable).where(gte(productsTable.stock, 1));

    const maxPrice = parseBudget(normalizedQuestion);

    if (maxPrice !== null) {
      productRows = productRows.filter((product) => Number.parseFloat(String(product.price)) <= maxPrice);
    }

    if (/(organic|chemical free|chemical-free|pesticide free)/.test(normalizedQuestion)) {
      productRows = productRows.filter((product) => product.isOrganic);
    }

    if (selectedFruits.length > 0) {
      const fruitTokens = selectedFruits.map((fruit) => normalizeText(fruit.name));
      productRows = productRows.filter((product) => {
        const haystack = normalizeText(`${product.name} ${product.description ?? ""} ${product.healthBenefits ?? ""}`);
        return fruitTokens.some((token) => haystack.includes(token));
      });
    }

    if (intent === "availability") {
      productRows = productRows.filter((product) => product.stock > 0);
    }

    if (productRows.length === 0) {
      productRows = (await db.select().from(productsTable).where(gte(productsTable.stock, 1))).slice(0, 4);
    }

    const products = productRows.slice(0, 4).map((product) => buildProductShape(product));
    const answer = buildAnswer(question, selectedFruits.length > 0 ? selectedFruits : fruitKnowledge.slice(0, 3), intent);

    sendJson(200, {
      answer: `${answer} ${disclaimer}`,
      intent,
      fruits: selectedFruits.map((fruit) => ({
        name: fruit.name,
        naturalSugar: fruit.naturalSugar,
        waterContent: fruit.waterContent,
        benefits: fruit.benefits,
        generalInfo: fruit.generalInfo,
      })),
      products,
      disclaimer,
      question,
    });
  } catch (error) {
    console.error("Fruit assistant failed", error);
    sendJson(500, {
      error: "Unable to answer that fruit question right now.",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
