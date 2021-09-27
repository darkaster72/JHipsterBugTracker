import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ILabel {
  id?: string;
  value?: string | null;
  tickets?: ITicket[] | null;
}

export class Label implements ILabel {
  constructor(public id?: string, public value?: string | null, public tickets?: ITicket[] | null) {}
}

export function getLabelIdentifier(label: ILabel): string | undefined {
  return label.id;
}
