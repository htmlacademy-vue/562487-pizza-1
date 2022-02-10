export default function auth({ next, store, nextMiddleware }) {
  const token = store.$jwt.getToken();
  if (!token) {
    next("/");
  }
  return nextMiddleware();
}
