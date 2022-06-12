<template>
  <label class="input">
    <span :class="labelIsHidden && 'visually-hidden'" data-test="input-label">{{ label }}</span>
    <input
      :class="{ 'input__input--error': error }"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :value="value"
      :readonly="readonly"
      @input="$emit('input', $event.target.value)"
      ref="input"
    />
    <span v-if="error" class="input__error-text" data-test="input-error">
      {{ error }}
    </span>
  </label>
</template>

<script>
export default {
  name: "AppInput",
  props: {
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    labelIsHidden: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>
