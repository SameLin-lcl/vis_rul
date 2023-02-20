import axios from "axios";
// @ts-nocheck

const request = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  // timeout: 1000,
  headers: { "X-Custom-Header": "foobar" }
});

const IS_MOCK = true;

/**
 * @returns {Promise<axios.AxiosResponse<any>>}
 */

export const fetchModels = () => {
  // if (IS_MOCK) return Promise.resolve(mockFetchModels());
  return request({
    method: "get",
    url: "/queryModelScore"
  }).then((res) => res.data.data);
};

/**
 * @param params: {rul:[1,100]}
 * @returns {Promise<{maxMin: {x: {min: number, max: number}, rul: {min: number, max: number}, y: {min: number, max: number}}, units: {x: *|number, rul: *|number, y: *|number, unit_id: *}[]}>|Promise<axios.AxiosResponse<any>>}
 */

export const fetchUnitsPca = (params = { rul: [1, 340] }) => {
  // if (IS_MOCK) return Promise.resolve(mockFetchUnitsPca());
  return request({
    method: "get",
    url: "/queryUnitsPca",
    params: {
      rul: JSON.stringify(params.rul)
    }
  }).then((res) => res.data.data);
};

export const fetchInstances = (params) => {
  console.log(params);
  // if (IS_MOCK) return Promise.resolve(mockFetchInstances(params));
  return request({
    method: "get",
    url: "/queryInputData",
    params: {
      units: JSON.stringify(params?.units),
      models: JSON.stringify(params?.models),
      win: params?.win
    }
  }).then((res) => res.data.data);
};

export const fetchData = (params) => {
  return request({
    method: "get",
    url: "/queryTestData",
    params
  }).then((res) => res.data);
};
