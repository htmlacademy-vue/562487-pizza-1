import {
  PizzaDoughs,
  PizzaSizes,
  PizzaSauces,
  PizzaIngredients,
} from "@/common/enums";

export const normalizeDoughs = (doughs) =>
  doughs.map((dough) => ({
    ...dough,
    value: PizzaDoughs[dough.id],
    kind: "dough",
  }));

export const normalizeSizes = (sizes) =>
  sizes.map((size) => ({
    ...size,
    value: PizzaSizes[size.id],
    kind: "diameter",
  }));

export const normalizeSauces = (sauces) =>
  sauces.map((sauce) => ({
    ...sauce,
    value: PizzaSauces[sauce.id],
    kind: "sauce",
  }));

export const normalizeIngredients = (ingredients) =>
  ingredients.map((ingredient) => ({
    ...ingredient,
    value: PizzaIngredients[ingredient.id],
    count: 0,
  }));
