import { makeAutoObservable } from "mobx";
import {
  fetchFeatures,
  fetchInstances,
  fetchInstanceTimeline,
  fetchModels,
  fetchUnitsPca
} from "../api/api";

class GlobalData {
  units = [];
  unitsMaxMin = {};

  features = [];
  _models = [];

  models = [];
  modelsMaxMin = {};

  win = 1;
  rulRange = [0, 311];
  instances = [];
  instancesMaxMin = {};

  instanceImportance = [];
  featureImportance = [];

  selectedUnits = [];
  selectedModels = [];
  selectedInstances = [];
  selectedInput;

  importanceMaxMin = {};

  timelineData;
  timelineDataRandom = [];

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

  updateRulRange(range) {
    this.rulRange = range;
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
    this.updateInstanceFeatures();
    this.updateTimeline();
  }

  updateInstance() {
    fetchInstances({
      models: this.selectedModels,
      units: this.selectedUnits,
      win: this.win,
      rulRange: this.rulRange
    }).then(
      (data) => {
        this.instances = data.instances;
        this.instancesMaxMin = data.maxMin;
      },
      () => undefined
    );
  }

  updateSelectedInstance(instanceId) {
    let isSelected = false;
    if (Array.isArray(instanceId)) {
      this.selectedInstances = instanceId;
    } else {
      const _id = this.selectedInstances.indexOf(instanceId);
      if (_id !== -1) {
        isSelected = true;
        this.selectedInstances.splice(_id, 1);
      } else {
        this.selectedInstances.push(instanceId);
      }
    }
    this.updateInstanceFeatures();
    return isSelected;
  }

  updateInstanceFeatures() {
    if (this.selectedInstances.length > 0 && this.selectedModels.length > 0) {
      fetchFeatures({
        instances: this.selectedInstances,
        models: this.selectedModels
      }).then((data) => {
        this.instanceImportance = data.instances;
        this.featureImportance = data.features;
        this.importanceMaxMin = data.maxMin;
      });
    }
  }

  updateSelectedInput(instanceId) {
    this.selectedInput = instanceId;
    this.updateTimeline();
  }

  updateTimeline() {
    if (this.selectedInput && this.selectedModels.length > 0) {
      fetchInstanceTimeline({
        models: this.selectedModels,
        input: this.selectedInput
      }).then((data) => {
        this.timelineData = data;
        this.timelineDataRandom = Math.random();
      });
    }
  }

  updateFeature(features) {
    this.features = features;
  }
}

export const globalData = new GlobalData();
