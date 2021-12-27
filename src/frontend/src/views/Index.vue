<template>
  <main class="content">
    <form action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>

        <BuilderDoughSelector
          :doughs="doughs"
          :checkedDough="checkedDough"
          @doughChange="checkedDough = $event"
        />

        <BuilderSizeSelector
          :sizes="sizes"
          :checkedSize="checkedSize"
          @sizeChange="checkedSize = $event"
        />

        <BuilderIngredientsSelector
          :sauces="sauces"
          :ingredients="ingredients"
          :checkedSauce="checkedSauce"
          :checkedIngredients="checkedIngredients"
          @sauceChange="checkedSauce = $event"
          @updateIngredients="updateIngredients"
        />

        <BuilderPizzaView
          :pizzaName="pizzaName"
          :checkedDough="checkedDough"
          :checkedSauce="checkedSauce"
          :checkedIngredients="checkedIngredients"
          :totalPrice="totalPrice"
          @nameChange="pizzaName = $event.target.value.trim()"
          @updateIngredients="updateIngredients"
          @submit="handleSubmit"
        />
      </div>
    </form>
    <router-view v-if="!user" @login="$emit('login')"></router-view>
  </main>
</template>

<script>
import pizza from "@/static/pizza.json";
import {
  MIN_PRICE,
  MIN_MULTIPLIER,
  InitialPizzaState,
} from "@/common/constants";
import { findById, findIndexById, generateNewPizza } from "@/common/helpers";
import {
  normalizeDoughs,
  normalizeSizes,
  normalizeSauces,
  normalizeIngredients,
} from "@/common/normalize";
import {
  BuilderDoughSelector,
  BuilderSizeSelector,
  BuilderIngredientsSelector,
  BuilderPizzaView,
} from "@/modules/builder/components";

export default {
  name: "IndexHome",
  components: {
    BuilderDoughSelector,
    BuilderSizeSelector,
    BuilderIngredientsSelector,
    BuilderPizzaView,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      doughs: normalizeDoughs(pizza.dough),
      sizes: normalizeSizes(pizza.sizes),
      sauces: normalizeSauces(pizza.sauces),
      ingredients: normalizeIngredients(pizza.ingredients),
      pizzaName: InitialPizzaState.name,
      checkedDough: InitialPizzaState.dough,
      checkedSize: InitialPizzaState.size,
      checkedSauce: InitialPizzaState.sauce,
      isLoginShowed: false,
    };
  },
  computed: {
    checkedIngredients() {
      return this.ingredients.filter((it) => it.count);
    },
    doughPrice() {
      return findById(this.doughs, this.checkedDough)?.price || MIN_PRICE;
    },
    sizeMultiplier() {
      return (
        findById(this.sizes, this.checkedSize)?.multiplier || MIN_MULTIPLIER
      );
    },
    saucePrice() {
      return findById(this.sauces, this.checkedSauce)?.price || MIN_PRICE;
    },
    ingredientsPrice() {
      return this.checkedIngredients
        .map((it) => it.price * it.count)
        .reduce((acc, it) => acc + it, 0);
    },
    totalPrice() {
      return (
        (this.doughPrice + this.saucePrice + this.ingredientsPrice) *
        this.sizeMultiplier
      );
    },
  },
  methods: {
    updateIngredients({ id, count }) {
      const index = findIndexById(this.ingredients, id);
      if (~index) {
        this.ingredients[index].count = count;
      }
    },
    handleSubmit() {
      const newPizza = generateNewPizza({
        dough: this.checkedDough,
        sauce: this.checkedSauce,
        size: this.checkedSize,
        ingredients: this.checkedIngredients,
        name: this.pizzaName,
        price: this.totalPrice,
        count: 1,
      });
      this.$emit("addNewPizza", newPizza);
      this.resetPizza();
    },
    resetPizza() {
      this.pizzaName = InitialPizzaState.name;
      this.checkedDough = InitialPizzaState.dough;
      this.checkedSize = InitialPizzaState.size;
      this.checkedSauce = InitialPizzaState.sauce;
      this.ingredients.forEach((ingredient) => {
        ingredient.count = 0;
      });
    },
  },
};
</script>
