import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getToday = (date) => API.get(`/today/${date}`);
export const saveDay = (data) => API.post("/save", data);
export const addTask = (data) => API.post("/add", data);
export const getWeek = () => API.get("/week");