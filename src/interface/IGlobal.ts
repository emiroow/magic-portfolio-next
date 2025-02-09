import { IEducation } from "./IEducation";
import { ISkill } from "./ISkills";
import { ISocial } from "./ISocial";

export interface IClientResponse {
  user?: IUser;
  education?: IEducation[];
  project?: IProject[];
  work?: IWork[];
  social?: ISocial[];
  skills?: ISkill[];
}
