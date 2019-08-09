import ProfileRoute from 'routes/Profile';

describe('(Route) Profile', () => {
    let _route;

    beforeEach(() => {
        _route = ProfileRoute({});
    });

    it('Should return a route configuration object', () => {
        expect(typeof _route).to.equal('object');
    });

    it('Configuration should contain path `profile`', () => {
        expect(_route.path).to.equal('profile');
    });
});
