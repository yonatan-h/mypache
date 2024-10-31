export interface Runtime {
  id: string;
  name: string;
  lang: string;
}

export interface Worker {}

export interface Cluster {
  id: string;
  state: "live" | "stopped" | "loading";
  userId: string;
  name: string;
  workers: Worker[];
  runtime: Runtime;
}

export interface CreateCluster {
  name: string;
  runtimeId: string;
  workers: number;
}
