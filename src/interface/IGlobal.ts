import { IEducation } from "./IEducation";
import { ISkill } from "./ISkills";
import { ISocial } from "./ISocial";

export interface IClientResponse {
  user?: IUser;
  educations?: IEducation[];
  projects?: IProject[];
  works?: IWork[];
  socials?: ISocial[];
  skills?: ISkill[];
}
