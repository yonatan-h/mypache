export interface Notebook {
  id: string;
  name: string;
  createdAt: string;
}

export interface Compute {
  id: string;
  state: "live" | "stopped" | "loading";
  name: string;
  runTime: string;
  numWorkers: number;
}

export interface File {
  id: string;
  name: string;
}

export interface Cell {
  content: string;
  error: string;
  loading: boolean;
  result: string;
}
export interface Notebook {
  id: string;
  clusterId: string;
  fileId: string;

  cells: Cell[];
}
