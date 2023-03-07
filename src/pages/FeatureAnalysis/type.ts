import { DataType } from "../Scatter/type";

export interface FeatureType {
  id: string | number;
  unit: number;
  node: DataType;
  features: Array<{ label: string; value: number; importance: number }>;
}
