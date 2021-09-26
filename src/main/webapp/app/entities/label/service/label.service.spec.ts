import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILabel, Label } from '../label.model';

import { LabelService } from './label.service';

describe('Service Tests', () => {
  describe('Label Service', () => {
    let service: LabelService;
    let httpMock: HttpTestingController;
    let elemDefault: ILabel;
    let expectedResult: ILabel | ILabel[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LabelService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        value: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Label', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Label()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Label', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            value: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Label', () => {
        const patchObject = Object.assign(
          {
            value: 'BBBBBB',
          },
          new Label()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Label', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            value: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Label', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLabelToCollectionIfMissing', () => {
        it('should add a Label to an empty array', () => {
          const label: ILabel = { id: 'ABC' };
          expectedResult = service.addLabelToCollectionIfMissing([], label);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(label);
        });

        it('should not add a Label to an array that contains it', () => {
          const label: ILabel = { id: 'ABC' };
          const labelCollection: ILabel[] = [
            {
              ...label,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addLabelToCollectionIfMissing(labelCollection, label);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Label to an array that doesn't contain it", () => {
          const label: ILabel = { id: 'ABC' };
          const labelCollection: ILabel[] = [{ id: 'CBA' }];
          expectedResult = service.addLabelToCollectionIfMissing(labelCollection, label);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(label);
        });

        it('should add only unique Label to an array', () => {
          const labelArray: ILabel[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'c0f1d8f9-4055-471f-a16e-99b37a13c72f' }];
          const labelCollection: ILabel[] = [{ id: 'ABC' }];
          expectedResult = service.addLabelToCollectionIfMissing(labelCollection, ...labelArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const label: ILabel = { id: 'ABC' };
          const label2: ILabel = { id: 'CBA' };
          expectedResult = service.addLabelToCollectionIfMissing([], label, label2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(label);
          expect(expectedResult).toContain(label2);
        });

        it('should accept null and undefined values', () => {
          const label: ILabel = { id: 'ABC' };
          expectedResult = service.addLabelToCollectionIfMissing([], null, label, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(label);
        });

        it('should return initial array if no Label is added', () => {
          const labelCollection: ILabel[] = [{ id: 'ABC' }];
          expectedResult = service.addLabelToCollectionIfMissing(labelCollection, undefined, null);
          expect(expectedResult).toEqual(labelCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
