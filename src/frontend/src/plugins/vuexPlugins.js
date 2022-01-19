import Notifier from "@/plugins/notifier";
import JwtService from "../services/jwt.service";
import { createResources } from "../common/helpers";

export default function (store) {
  store.$notifier = new Notifier(store);
  store.$jwt = JwtService;
  store.$api = createResources(store.$notifier);
}
