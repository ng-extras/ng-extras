import { TestBed } from '@angular/core/testing';

import { NgExtrasService } from './ng-extras.service';

describe('NgExtrasService', () => {
   beforeEach(() => TestBed.configureTestingModule({}));

   it('should be created', () => {
      const service : NgExtrasService = TestBed.get(NgExtrasService);
      expect(service).toBeTruthy();
   });
});
