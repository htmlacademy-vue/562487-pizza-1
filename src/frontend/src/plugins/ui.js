import Vue from "vue";
import AppLayout from "@/layouts/AppLayout";
import AppNotifications from "@/common/components/AppNotifications";
import AppDrag from "@/common/components/AppDrag";
import AppDrop from "@/common/components/AppDrop";
import AppButton from "@/common/components/AppButton";
import AppInput from "@/common/components/AppInput";
import ItemCounter from "@/common/components/ItemCounter";
import AppLogo from "@/common/components/AppLogo";
import RadioButton from "@/common/components/RadioButton";
import SelectorItem from "@/common/components/SelectorItem";
import UserPicture from "@/common/components/UserPicture";
import PopupLayout from "@/common/components/PopupLayout";
import PopupOverlay from "@/common/components/PopupOverlay";
import PopupButton from "@/common/components/PopupButton";
import ConfirmPopup from "@/common/components/ConfirmPopup";
import PizzaInfo from "@/common/components/PizzaInfo";
import PopupTransition from "@/common/components/PopupTransition";
import SlideTransitionGroup from "@/common/components/SlideTransitionGroup";

Vue.component("AppLayout", AppLayout);
Vue.component("AppNotifications", AppNotifications);
Vue.component("AppDrag", AppDrag);
Vue.component("AppDrop", AppDrop);
Vue.component("AppButton", AppButton);
Vue.component("AppInput", AppInput);
Vue.component("ItemCounter", ItemCounter);
Vue.component("AppLogo", AppLogo);
Vue.component("RadioButton", RadioButton);
Vue.component("SelectorItem", SelectorItem);
Vue.component("UserPicture", UserPicture);
Vue.component("PopupLayout", PopupLayout);
Vue.component("PopupOverlay", PopupOverlay);
Vue.component("PopupButton", PopupButton);
Vue.component("ConfirmPopup", ConfirmPopup);
Vue.component("PizzaInfo", PizzaInfo);
Vue.component("PopupTransition", PopupTransition);
Vue.component("SlideTransitionGroup", SlideTransitionGroup);

export const setUIComponents = (localVue) => {
  localVue.component("AppLayout", AppLayout);
  localVue.component("AppNotifications", AppNotifications);
  localVue.component("AppDrag", AppDrag);
  localVue.component("AppDrop", AppDrop);
  localVue.component("AppButton", AppButton);
  localVue.component("AppInput", AppInput);
  localVue.component("ItemCounter", ItemCounter);
  localVue.component("AppLogo", AppLogo);
  localVue.component("RadioButton", RadioButton);
  localVue.component("SelectorItem", SelectorItem);
  localVue.component("UserPicture", UserPicture);
  localVue.component("PopupLayout", PopupLayout);
  localVue.component("PopupOverlay", PopupOverlay);
  localVue.component("PopupButton", PopupButton);
  localVue.component("ConfirmPopup", ConfirmPopup);
  localVue.component("PizzaInfo", PizzaInfo);
  localVue.component("PopupTransition", PopupTransition);
  localVue.component("SlideTransitionGroup", SlideTransitionGroup);
};
