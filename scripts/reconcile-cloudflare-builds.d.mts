/** Types for the companion Cloudflare Workers Builds reconciliation CLI. */
export interface WorkersBuildTrigger {
  trigger_uuid: string;
  trigger_name?: string;
  branch_includes?: string[];
  branch_excludes?: string[];
  build_command?: string;
  deploy_command?: string;
  repo_name?: string;
  repo_connection?: { repo_name?: string };
}

export interface WorkersBuildChange {
  role: "production" | "preview";
  uuid: string;
  before: WorkersBuildTrigger;
  patch: {
    branch_excludes?: string[];
    build_command?: string;
    deploy_command?: string;
  };
}

export function safePreviewCommand(command: unknown): boolean;
export function planCloudflareBuildChanges(triggers: WorkersBuildTrigger[]): WorkersBuildChange[];
export function classifyBuildLog(lines: Array<string | unknown[]>): string[];
