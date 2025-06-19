import axios from 'axios'
const baseUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api/persons'
  : '/api/persons';

const getAll = () => axios.get(baseUrl).then(response => Array.isArray(response.data) ? response.data : []);
getAll().then(data => console.log("Fetched persons:", data));

const create = newObject => axios.post(baseUrl, newObject).then(response => response.data);

const remove = id => {
    console.log("Attempting to delete ID:", id); // Debugging
    if (!id) {
      console.error("Invalid delete request: ID is undefined");
      return Promise.reject("Invalid ID");
    }
    return axios.delete(`${baseUrl}/${id}`).then(() => id);
};

const update = (id, updatedObject) =>
  axios.put(`${baseUrl}/${id}`, updatedObject).then(response => response.data);

export default { getAll, create, remove, update };