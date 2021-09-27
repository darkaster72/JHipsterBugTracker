import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITicket, Ticket } from '../ticket.model';

import { TicketService } from './ticket.service';

describe('Service Tests', () => {
  describe('Ticket Service', () => {
    let service: TicketService;
    let httpMock: HttpTestingController;
    let elemDefault: ITicket;
    let expectedResult: ITicket | ITicket[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TicketService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        title: 'AAAAAAA',
        description: 'AAAAAAA',
        dueDate: currentDate,
        done: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dueDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Ticket', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            dueDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Ticket()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ticket', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
            description: 'BBBBBB',
            dueDate: currentDate.format(DATE_FORMAT),
            done: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Ticket', () => {
        const patchObject = Object.assign(
          {
            title: 'BBBBBB',
            done: true,
          },
          new Ticket()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ticket', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
            description: 'BBBBBB',
            dueDate: currentDate.format(DATE_FORMAT),
            done: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dueDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Ticket', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTicketToCollectionIfMissing', () => {
        it('should add a Ticket to an empty array', () => {
          const ticket: ITicket = { id: 'ABC' };
          expectedResult = service.addTicketToCollectionIfMissing([], ticket);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ticket);
        });

        it('should not add a Ticket to an array that contains it', () => {
          const ticket: ITicket = { id: 'ABC' };
          const ticketCollection: ITicket[] = [
            {
              ...ticket,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, ticket);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Ticket to an array that doesn't contain it", () => {
          const ticket: ITicket = { id: 'ABC' };
          const ticketCollection: ITicket[] = [{ id: 'CBA' }];
          expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, ticket);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ticket);
        });

        it('should add only unique Ticket to an array', () => {
          const ticketArray: ITicket[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'fcf483b2-1c99-43ad-8beb-d194f35c895f' }];
          const ticketCollection: ITicket[] = [{ id: 'ABC' }];
          expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, ...ticketArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ticket: ITicket = { id: 'ABC' };
          const ticket2: ITicket = { id: 'CBA' };
          expectedResult = service.addTicketToCollectionIfMissing([], ticket, ticket2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ticket);
          expect(expectedResult).toContain(ticket2);
        });

        it('should accept null and undefined values', () => {
          const ticket: ITicket = { id: 'ABC' };
          expectedResult = service.addTicketToCollectionIfMissing([], null, ticket, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ticket);
        });

        it('should return initial array if no Ticket is added', () => {
          const ticketCollection: ITicket[] = [{ id: 'ABC' }];
          expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, undefined, null);
          expect(expectedResult).toEqual(ticketCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
