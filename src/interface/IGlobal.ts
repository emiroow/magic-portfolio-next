import { IEducation } from "./IEducation";
import { ISkill } from "./ISkills";
import { ISocial } from "./ISocial";

export interface IClientResponse {
  profile?: IProfile;
  educations?: IEducation[];
  projects?: IProject[];
  works?: IWork[];
  socials?: ISocial[];
  skills?: ISkill[];
}
