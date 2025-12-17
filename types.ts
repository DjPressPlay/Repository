export interface BlueprintData {
  name: string;
  type: string;
  audience: string;
  core_action: string;
  outcome: string;
  replaces: string;
  form: string;
  reason: string;
}

export type BlueprintField = keyof BlueprintData;

export interface StepDef {
  id: number;
  field: BlueprintField;
  title: string;
  instruction: string;
  placeholder: string;
  example: string;
}

export interface BlueprintResult {
  text: string;
  imageUrl?: string;
}