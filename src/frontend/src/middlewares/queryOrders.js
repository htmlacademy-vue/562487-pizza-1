export default function queryOrders({ store, nextMiddleware }) {
  store.dispatch("Orders/queryOrders");
  return nextMiddleware();
}
