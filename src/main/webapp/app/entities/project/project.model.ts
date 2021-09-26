export interface IProject {
  id?: string;
  name?: string | null;
}

export class Project implements IProject {
  constructor(public id?: string, public name?: string | null) {}
}

export function getProjectIdentifier(project: IProject): string | undefined {
  return project.id;
}
