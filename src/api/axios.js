import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
export async function get(path) {
  const res = await api.get(path);
  return res.data;
}
export default api;
