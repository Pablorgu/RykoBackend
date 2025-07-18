import { Gender } from '../enums/gender.enum';
import { WeightAim } from '../enums/weightAim.enum';

export class UserFullProfileDto {
  id: number;
  username: string;
  email: string;
  country?: string;
  gender?: Gender;
  weight?: number;
  height?: number;
  birthdate?: string;
  aim?: WeightAim;
  calorieGoal?: number;
  intolerances?: string[];
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}
