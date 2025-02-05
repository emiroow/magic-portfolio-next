import { IEducation } from "./IEducation";
import { ISocial } from "./ISocial";

export interface IClientResponse {
  user?: IUser;
  education?: IEducation[];
  work?: IWork[];
  social?: ISocial[];
}
