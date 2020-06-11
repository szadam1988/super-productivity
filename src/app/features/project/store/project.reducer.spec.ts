import {projectReducer} from './project.reducer';
import {fakeEntityStateFromArray} from '../../../util/fake-entity-state-from-array';
import {Project} from '../project.model';
import {UpdateProjectOrder} from './project.actions';

describe('projectReducer', () => {

  describe('UpdateProjectOrder', () => {
    it('Should re-add archived projects if incomplete list is given as param', () => {
      const s = fakeEntityStateFromArray([
        {id: 'A', isArchived: false},
        {id: 'B', isArchived: false},
        {id: 'C', isArchived: true},
      ] as Partial<Project>[]);

      const ids = ['B', 'A'];
      const r = projectReducer(s as any, new UpdateProjectOrder({ids}));
      expect(r.ids).toEqual(['B', 'A', 'C']);
    });
  });
});
