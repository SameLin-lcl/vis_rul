import { makeAutoObservable } from "mobx";
import { fetchInstances, fetchModels, fetchUnitsPca } from "../api/api";

class GlobalData {
  units = [];
  unitsMaxMin = {};

  _models = [];

  models = [];
  modelsMaxMin = {};

  instances = [];
  instancesMaxMin = {};

  win = 1;

  selectedUnits = [];
  selectedModels = [];

  features = [];

  constructor() {
    makeAutoObservable(this);
  }

  async updateUnits(params) {
    const data = await fetchUnitsPca(params);
    this.units = data.units;
    this.unitsMaxMin = data.maxMin;
    return data;
  }

  async updateModels(models = []) {
    const data = await fetchModels();
    this.models = data.models;
    this.modelsMaxMin = data.maxMin;
    this.features = data[0]?.features.map((item) => item.label) ?? [];
    if (models.length === 0) {
      this._models = data.models.map((item) => item.model);
    }
    return data;
  }

  updateSelectedUnits(units) {
    this.selectedUnits = units;
    this.updateInstance();
  }

  updateWin(win) {
    this.win = win;
    this.updateInstance();
  }

  updateSelectedModel(model, isSelected) {
    if (isSelected) {
      this.selectedModels = this._models.filter(
        (v) => this.selectedModels.includes(v) || v === model
      );
    } else {
      this.selectedModels = this._models.filter(
        (v) => this.selectedModels.includes(v) && v !== model
      );
    }
    this.updateInstance();
  }

  updateInstance() {
    fetchInstances({
      models: this.selectedModels,
      units: this.selectedUnits,
      win: this.win
    }).then(
      (data) => {
        this.instances = data.instances;
        this.instancesMaxMin = data.maxMin;
        console.log(data.maxMin.modelPerf);
      },
      () => undefined
    );
  }

  updateFeature(features) {
    this.features = features;
  }
}

export const globalData = new GlobalData();
