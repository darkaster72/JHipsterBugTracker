import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProject, Project } from '../project.model';

import { ProjectService } from './project.service';

describe('Service Tests', () => {
  describe('Project Service', () => {
    let service: ProjectService;
    let httpMock: HttpTestingController;
    let elemDefault: IProject;
    let expectedResult: IProject | IProject[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProjectService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        name: 'AAAAAAA',
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

      it('should create a Project', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Project()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Project', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Project', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Project()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Project', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
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

      it('should delete a Project', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProjectToCollectionIfMissing', () => {
        it('should add a Project to an empty array', () => {
          const project: IProject = { id: 'ABC' };
          expectedResult = service.addProjectToCollectionIfMissing([], project);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(project);
        });

        it('should not add a Project to an array that contains it', () => {
          const project: IProject = { id: 'ABC' };
          const projectCollection: IProject[] = [
            {
              ...project,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addProjectToCollectionIfMissing(projectCollection, project);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Project to an array that doesn't contain it", () => {
          const project: IProject = { id: 'ABC' };
          const projectCollection: IProject[] = [{ id: 'CBA' }];
          expectedResult = service.addProjectToCollectionIfMissing(projectCollection, project);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(project);
        });

        it('should add only unique Project to an array', () => {
          const projectArray: IProject[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '436faf56-642d-467f-9841-ee80fc0457fb' }];
          const projectCollection: IProject[] = [{ id: 'ABC' }];
          expectedResult = service.addProjectToCollectionIfMissing(projectCollection, ...projectArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const project: IProject = { id: 'ABC' };
          const project2: IProject = { id: 'CBA' };
          expectedResult = service.addProjectToCollectionIfMissing([], project, project2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(project);
          expect(expectedResult).toContain(project2);
        });

        it('should accept null and undefined values', () => {
          const project: IProject = { id: 'ABC' };
          expectedResult = service.addProjectToCollectionIfMissing([], null, project, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(project);
        });

        it('should return initial array if no Project is added', () => {
          const projectCollection: IProject[] = [{ id: 'ABC' }];
          expectedResult = service.addProjectToCollectionIfMissing(projectCollection, undefined, null);
          expect(expectedResult).toEqual(projectCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
