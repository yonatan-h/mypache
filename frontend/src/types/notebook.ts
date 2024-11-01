import { Cluster } from "./compute";
import { SparkFile } from "./data";
import { User } from "./user";

export interface Notebook {
  id: string;
  user: User;
  cluster: Cluster;
  file: SparkFile;
}

export interface RetrievedCell {
  id?: string;
  content: string;
  error: string;
  result: string;
}

export interface Cell extends RetrievedCell {
  loading: boolean;
}

export interface CreateNotebook {
  fileId: string;
  clusterId: string;
}
