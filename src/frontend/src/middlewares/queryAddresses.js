export default function queryAddresses({ store, nextMiddleware }) {
  store.dispatch("Auth/queryAddresses");
  return nextMiddleware();
}
