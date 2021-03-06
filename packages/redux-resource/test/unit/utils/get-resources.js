import { getResources } from '../../../src';

describe('getResources', function() {
  beforeEach(() => {
    stub(console, 'error');

    this.state = {
      books: {
        resources: {
          1: { id: 1, name: 'sandwiches' },
          10: { id: 10, name: 'pizza' },
          102: { id: 102, name: 'fried' },
          116: { id: 116, name: 'pickles' },
        },
        meta: {
          1: {},
          10: {
            selected: true,
          },
          102: {
            selected: false,
          },
          116: {
            selected: true,
          },
        },
        lists: {
          dashboardSearch: [10, 22, 102],
          detailsPage: [],
          malformedList: {},
        },
        requests: {},
      },
      movies: {
        resources: {},
        meta: {},
        requests: {},
        lists: {},
      },
    };
  });

  afterEach(() => {
    console.error.reset();
  });

  describe('when a nonexistent slice is passed', () => {
    it('should return an empty array', () => {
      expect(getResources(this.state.yum, [1])).to.deep.equal([]);
      expect(console.error.callCount).to.equal(0);
    });

    it('byId: should return an empty object', () => {
      expect(getResources(this.state.yum, [1], { byId: true })).to.deep.equal(
        {}
      );
      expect(console.error.callCount).to.equal(0);
    });
  });

  describe('when the resources object is empty', () => {
    it('should return an empty array', () => {
      expect(getResources(this.state.movies, [1])).to.deep.equal([]);
      expect(console.error.callCount).to.equal(0);
    });

    it('byId: should return an empty object', () => {
      expect(
        getResources(this.state.movies, [1], { byId: true })
      ).to.deep.equal({});
      expect(console.error.callCount).to.equal(0);
    });
  });

  describe('lists', () => {
    it('should return an empty array when the list does not exist', () => {
      expect(getResources(this.state.books, 'sandwiches')).to.deep.equal([]);
      expect(console.error.callCount).to.equal(0);
    });

    it('should return an empty array when the list exists, and has no IDs', () => {
      expect(getResources(this.state.books, 'detailsPage')).to.deep.equal([]);
      expect(console.error.callCount).to.equal(0);
    });

    it('should return an empty array when the list exists, but does not have an IDs array (this should never happen!)', () => {
      expect(getResources(this.state.books, 'malformedList')).to.deep.equal([]);
      expect(console.error.callCount).to.equal(0);
    });

    it('should return the resources that exist when the list exists', () => {
      expect(getResources(this.state.books, 'dashboardSearch')).to.deep.equal([
        { id: 10, name: 'pizza' },
        { id: 102, name: 'fried' },
      ]);
      expect(console.error.callCount).to.equal(0);
    });

    describe('byId', () => {
      it('should return an empty array when the list does not exist', () => {
        expect(
          getResources(this.state.books, 'sandwiches', { byId: true })
        ).to.deep.equal({});
        expect(console.error.callCount).to.equal(0);
      });

      it('should return an empty array when the list exists, and has no IDs', () => {
        expect(
          getResources(this.state.books, 'detailsPage', { byId: true })
        ).to.deep.equal({});
        expect(console.error.callCount).to.equal(0);
      });

      it('should return an empty array when the list exists, but does not have an IDs array (this should never happen!)', () => {
        expect(
          getResources(this.state.books, 'malformedList', { byId: true })
        ).to.deep.equal({});
        expect(console.error.callCount).to.equal(0);
      });

      it('should return the resources that exist when the list exists', () => {
        expect(
          getResources(this.state.books, 'dashboardSearch', { byId: true })
        ).to.deep.equal({
          10: { id: 10, name: 'pizza' },
          102: { id: 102, name: 'fried' },
        });
        expect(console.error.callCount).to.equal(0);
      });
    });
  });

  describe('ids', () => {
    it('should return an empty array when the IDs array is empty', () => {
      expect(getResources(this.state.books, [])).to.deep.equal([]);
      expect(console.error.callCount).to.equal(0);
    });

    it('should return the resources that when the IDs array is non-empty', () => {
      expect(getResources(this.state.books, [1, 116, 130])).to.deep.equal([
        { id: 1, name: 'sandwiches' },
        { id: 116, name: 'pickles' },
      ]);
      expect(console.error.callCount).to.equal(0);
    });
  });

  describe('filter function', () => {
    it('should return an empty array when nothing matches a filtering function', () => {
      const filter = (resource, meta, resourceSlice) => {
        const resourceId = resource.id;
        expect(resource).to.deep.equal(this.state.books.resources[resourceId]);
        expect(resourceSlice).to.deep.equal(this.state.books);
        expect(meta).to.deep.equal(this.state.books.meta[resourceId]);

        return false;
      };

      expect(getResources(this.state.books, filter)).to.deep.equal([]);
      expect(console.error.callCount).to.equal(0);
    });

    it('should return the resources that match a filtering function', () => {
      const filter = (resource, meta, resourceSlice) => {
        const resourceId = resource.id;
        expect(resource).to.deep.equal(this.state.books.resources[resourceId]);
        expect(resourceSlice).to.deep.equal(this.state.books);
        expect(meta).to.deep.equal(this.state.books.meta[resourceId]);

        return meta.selected;
      };

      expect(getResources(this.state.books, filter)).to.deep.equal([
        { id: 10, name: 'pizza' },
        { id: 116, name: 'pickles' },
      ]);
      expect(console.error.callCount).to.equal(0);
    });

    it('byId: should return an empty object when nothing matches a filtering function', () => {
      const filter = (resource, meta, resourceSlice) => {
        const resourceId = resource.id;
        expect(resource).to.deep.equal(this.state.books.resources[resourceId]);
        expect(resourceSlice).to.deep.equal(this.state.books);
        expect(meta).to.deep.equal(this.state.books.meta[resourceId]);

        return false;
      };

      expect(
        getResources(this.state.books, filter, { byId: true })
      ).to.deep.equal({});
      expect(console.error.callCount).to.equal(0);
    });

    it('byId: should return the resources that match a filtering function', () => {
      const filter = (resource, meta, resourceSlice) => {
        const resourceId = resource.id;
        expect(resource).to.deep.equal(this.state.books.resources[resourceId]);
        expect(resourceSlice).to.deep.equal(this.state.books);
        expect(meta).to.deep.equal(this.state.books.meta[resourceId]);

        return meta.selected;
      };

      expect(
        getResources(this.state.books, filter, { byId: true })
      ).to.deep.equal({
        10: { id: 10, name: 'pizza' },
        116: { id: 116, name: 'pickles' },
      });
      expect(console.error.callCount).to.equal(0);
    });
  });

  describe('no filter', () => {
    it('should return all of the resources', () => {
      expect(getResources(this.state.books)).to.deep.equal(
        Object.values(this.state.books.resources)
      );

      expect(console.error.callCount).to.equal(0);
    });
  });

  describe('removed three argument signature', () => {
    it('should warn', () => {
      try {
        getResources(this.state, 'books', [10]);
      } catch (e) {
        // Intentionally blank
      }

      expect(console.error.callCount).to.equal(1);
    });
  });
});
