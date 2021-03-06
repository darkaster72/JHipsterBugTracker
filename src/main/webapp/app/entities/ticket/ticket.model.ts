import * as dayjs from 'dayjs';
import { IProject } from 'app/entities/project/project.model';
import { IUser } from 'app/entities/user/user.model';
import { ILabel } from 'app/entities/label/label.model';

export interface ITicket {
  id?: string;
  title?: string | null;
  description?: string | null;
  dueDate?: dayjs.Dayjs | null;
  done?: boolean | null;
  project?: IProject | null;
  assignedTo?: IUser | null;
  labels?: ILabel[] | null;
}

export class Ticket implements ITicket {
  constructor(
    public id?: string,
    public title?: string | null,
    public description?: string | null,
    public dueDate?: dayjs.Dayjs | null,
    public done?: boolean | null,
    public project?: IProject | null,
    public assignedTo?: IUser | null,
    public labels?: ILabel[] | null
  ) {
    this.done = this.done ?? false;
  }
}

export function getTicketIdentifier(ticket: ITicket): string | undefined {
  return ticket.id;
}
