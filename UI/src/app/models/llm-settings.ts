import { GoogleModel } from './google-model';

export interface LlmSettings {
  model: string;
  has_api_key: boolean;
  models?: GoogleModel[];
}
