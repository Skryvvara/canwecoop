import axios from "axios";

export const ApiClient = axios.create({
  baseURL: "http://localhost:3010/api/",
});
