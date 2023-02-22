interface PrefType {
  label: string;
  value: number;
}

export interface FeatureType {
  label: string;
  value: number;
  variance: number;
}

export interface DataType {
  model: string;
  perf: PrefType[];
  features: FeatureType[];
  deviation: FeatureType[];
}

export interface RectType {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
