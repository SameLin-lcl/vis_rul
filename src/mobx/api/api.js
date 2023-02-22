import axios from "axios";
// @ts-nocheck

const request = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  // timeout: 1000,
  headers: { "X-Custom-Header": "foobar" }
});

const IS_MOCK = true;

/**
 * @returns {Promise<{maxMin: {features: {min: number, max: number}, variance: {min: number, max: number}, perf: [{max: number, label: string},{max: number, label: string},{max: number, label: string}]}, models: {features: *, model: *, perf: [{label: string, value: number},{label: string, value: number},{label: string, value: number}]}[]}>}
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

export const fetchFeatures = (params) => {
  // if (IS_MOCK) return Promise.resolve(mockFetchFeatures(params));
  return request({
    method: "get",
    url: "/queryInstanceFeatures",
    params: {
      instances: JSON.stringify(params?.instances),
      models: JSON.stringify(params?.models)
    }
  }).then((res) => res.data.data);
};

export const fetchInstanceTimeline = (params) => {
  // if (IS_MOCK) return Promise.resolve(mockFetchInstanceTimeline(params));
  return request({
    method: "get",
    url: "/queryInstanceTimeline",
    params: {
      input: params?.input,
      models: JSON.stringify(params?.models)
    }
  }).then((res) => res.data.data);
};
