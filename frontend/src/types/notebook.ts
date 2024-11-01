import { Cluster } from "./compute";
import { SparkFile } from "./data";
import { User } from "./user";

export interface CreateNotebook {
  fileId: string;
  clusterId: string;
}

export interface RetrievedNotebook {
  id: string;
  user: User;
  cluster: Cluster;
  file: SparkFile;
  cells: RetrievedCell[];
}

export interface RetrievedCell {
  id?: string;
  content: string;
  error: string;
  result: string;
}

//

export interface Notebook {
  numRuns: number;
  id: string;
  user: User;
  cluster: Cluster;
  file: SparkFile;
  cells: Cell[];
}

export interface Cell extends RetrievedCell {
  loading: boolean;
}
