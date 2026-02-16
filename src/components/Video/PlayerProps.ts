import { Run } from "../RunsList/RunData";

export type LocalPlayerProps = {
  uri: string;
  run_id: string;
};
export type PlayerProps = {
  run: Run;
  uri: string;
};
