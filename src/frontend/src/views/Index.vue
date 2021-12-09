<template>
  <form action="#" method="post">
    <div class="content__wrapper">
      <h1 class="title title--big">Конструктор пиццы</h1>

      <div class="content__dough">
        <div class="sheet">
          <h2 class="title title--small sheet__title">Выберите тесто</h2>

          <div class="sheet__content dough">
            <label
              v-for="dough in doughs"
              :key="dough.id"
              class="dough__input"
              :class="`dough__input--${dough.value}`"
            >
              <input
                type="radio"
                name="dough"
                :value="dough.value"
                class="visually-hidden"
                :checked="dough.id === checkedDough"
                @change="handleChange"
              />
              <b>{{ dough.name }}</b>
              <span>{{ dough.description }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="content__diameter">
        <div class="sheet">
          <h2 class="title title--small sheet__title">Выберите размер</h2>

          <div class="sheet__content diameter">
            <label
              v-for="size in sizes"
              :key="size.id"
              class="diameter__input"
              :class="`diameter__input--${size.value}`"
            >
              <input
                type="radio"
                name="diameter"
                :value="size.value"
                class="visually-hidden"
                :checked="size.id === checkedSize"
                @change="handleChange"
              />
              <span>{{ size.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="content__ingredients">
        <div class="sheet">
          <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

          <div class="sheet__content ingredients">
            <div class="ingredients__sauce">
              <p>Основной соус:</p>

              <label
                v-for="sauce in sauces"
                :key="sauce.id"
                class="radio ingredients__input"
              >
                <input
                  type="radio"
                  name="sauce"
                  :value="sauce.value"
                  :checked="sauce.id === checkedSauce"
                  @change="handleChange"
                />
                <span>{{ sauce.name }}</span>
              </label>
            </div>

            <div class="ingredients__filling">
              <p>Начинка:</p>

              <ul class="ingredients__list">
                <li
                  v-for="ingredient in ingredients"
                  :key="ingredient.id"
                  class="ingredients__item"
                >
                  <span class="filling" :class="`filling--${ingredient.value}`">
                    {{ ingredient.name }}
                  </span>
                  <div class="counter counter--orange ingredients__counter">
                    <button
                      type="button"
                      class="counter__button counter__button--minus"
                      :disabled="ingredient.count === INGREDIENT_MIN_COUNT"
                      @click="handleDecrement(ingredient.id)"
                    >
                      <span class="visually-hidden">Меньше</span>
                    </button>
                    <input
                      type="text"
                      name="counter"
                      class="counter__input"
                      :value="ingredient.count"
                      readonly
                    />
                    <button
                      type="button"
                      class="counter__button counter__button--plus"
                      :disabled="ingredient.count === INGREDIENT_MAX_COUNT"
                      @click="handleIncrement(ingredient.id)"
                    >
                      <span class="visually-hidden">Больше</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="content__pizza">
        <label class="input">
          <span class="visually-hidden">Название пиццы</span>
          <input
            type="text"
            name="pizza_name"
            placeholder="Введите название пиццы"
            :value="pizzaName"
            required
            @change="handleNameChange"
          />
        </label>

        <div class="content__constructor">
          <div class="pizza" :class="pizzaFoundationClasses">
            <div v-if="totalSum" class="pizza__wrapper">
              <div
                v-for="ingredient in checkedIngredients"
                :key="ingredient.value"
                class="pizza__filling"
                :class="getPizzaFillingClasses(ingredient)"
              ></div>
            </div>
          </div>
        </div>

        <div class="content__result">
          <p>Итого: {{ totalSum }} ₽</p>
          <button type="button" class="button" :disabled="totalSum === 0">
            Готовьте!
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import pizza from "@/static/pizza.json";
import PizzaDoughs from "@/common/enums/doughs";
import PizzaSizes from "@/common/enums/sizes";
import PizzaSauces from "@/common/enums/sauces";
import PizzaIngredients from "@/common/enums/ingredients";
import PizzaFoundations from "@/common/enums/foundations";
import { findByValue, findById } from "@/common/helpers";
import {
  INGREDIENT_MIN_COUNT,
  INGREDIENT_MAX_COUNT,
  InitialPizzaState,
} from "@/common/constants";

export default {
  name: "IndexHome",
  data() {
    return {
      INGREDIENT_MIN_COUNT,
      INGREDIENT_MAX_COUNT,
      doughs: pizza.dough.map((dough) => ({
        ...dough,
        value: PizzaDoughs[dough.id],
      })),
      sizes: pizza.sizes.map((size) => ({
        ...size,
        value: PizzaSizes[size.id],
      })),
      sauces: pizza.sauces.map((sauce) => ({
        ...sauce,
        value: PizzaSauces[sauce.id],
      })),
      ingredients: pizza.ingredients.map((ingredient) => ({
        ...ingredient,
        value: PizzaIngredients[ingredient.id],
        count: 0,
      })),
      pizzaName: InitialPizzaState.name,
      checkedDough: InitialPizzaState.dough,
      checkedSize: InitialPizzaState.size,
      checkedSauce: InitialPizzaState.sauce,
    };
  },
  computed: {
    checkedIngredients() {
      return this.ingredients.filter((it) => it.count);
    },
    totalSum() {
      const doughPrice = findById(this.doughs, this.checkedDough)?.price || 0;

      const sizeMultiplier =
        findById(this.sizes, this.checkedSize)?.multiplier || 1;

      const saucePrice = findById(this.sauces, this.checkedSauce)?.price || 0;

      const ingredientsPrice = this.checkedIngredients
        .map((it) => it.price * it.count)
        .reduce((acc, it) => acc + it, 0);

      return (doughPrice + saucePrice + ingredientsPrice) * sizeMultiplier;
    },
    pizzaFoundationClasses() {
      const dough = PizzaFoundations[this.checkedDough];
      const sauce = PizzaSauces[this.checkedSauce];
      return `pizza--foundation--${dough}-${sauce}`;
    },
  },
  methods: {
    getPizzaFillingClasses(ingredient) {
      const valueClass = `pizza__filling--${ingredient.value}`;
      const count = ingredient.count;
      if (count === 1) {
        return valueClass;
      }
      const countModifier = count === 2 ? "second" : count === 3 ? "third" : "";
      const countClass = `pizza__filling--${countModifier}`;
      return `${valueClass} ${countClass}`;
    },
    handleChange(evt) {
      const { name, value } = evt.target;

      switch (name) {
        case "dough":
          this.checkedDough = findByValue(this.doughs, value)?.id;
          return;

        case "diameter":
          this.checkedSize = findByValue(this.sizes, value)?.id;
          return;

        case "sauce":
          this.checkedSauce = findByValue(this.sauces, value)?.id;
          return;

        default:
          return;
      }
    },
    handleIncrement(id) {
      const index = this.ingredients.findIndex((it) => it.id === id);
      this.ingredients[index].count++;
    },
    handleDecrement(id) {
      const index = this.ingredients.findIndex((it) => it.id === id);
      this.ingredients[index].count--;
    },
    handleNameChange(evt) {
      this.pizzaName = evt.target.value.trim();
    },
  },
};
</script>

<style lang="scss" scoped></style>
