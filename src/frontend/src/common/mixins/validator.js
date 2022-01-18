import { emailRegex, urlRegex } from "@/common/constants";

const rules = {
  isNotEmpty: {
    rule: (value) => !!value?.trim(),
    message: "Поле не заполнено",
  },
  required: {
    rule: (value) => !!value?.trim(),
    message: "Поле обязательно для заполнения",
  },
  atLeastOne: {
    rule: (value) => value.length !== 0,
    message: "Выберите хотя бы 1 вариант",
  },
  email: {
    rule: (value) =>
      !value ? true : emailRegex.test(String(value).toLowerCase()),
    message: "Электроная почта имеет неверный формат",
  },
  url: {
    rule: (value) => (!value ? true : urlRegex.test(value)),
    message: "Ссылка имеет неверный формат",
  },
};

/**
 * @param { String } value
 * @param { String[] } appliedRules
 * @returns {string}
 */

const validator = (value, appliedRules) => {
  let error = "";
  appliedRules.forEach((appliedRule) => {
    if (!rules[appliedRule]) {
      return;
    }
    const { rule, message } = rules[appliedRule];
    if (!rule(value)) {
      error = message;
    }
  });
  return error;
};

export default {
  methods: {
    $validateFields(fields, validations) {
      let isValid = true;
      Object.keys(validations).forEach((key) => {
        validations[key].error = validator(fields[key], validations[key].rules);
        if (validations[key].error) {
          isValid = false;
        }
      });
      return isValid;
    },
    $validateField(field, validations) {
      validations[field.name].error = validator(
        field.value,
        validations[field.name].rules
      );
    },
    $clearValidationErrors() {
      if (!this.validations) {
        return;
      }
      Object.keys(this.validations).forEach((key) => {
        this.$set(this.validations[key], "error", "");
      });
    },
    $clearValidationError(field) {
      this.$set(this.validations[field], "error", "");
    },
  },
};
