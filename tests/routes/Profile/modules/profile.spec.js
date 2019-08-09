import { ATTEMPT_LOGIN, attemptLogin, default as profileReducer } from 'routes/Profile/modules/profile';

/* describe('(Redux Module) Profile', () => {
  it('Should export a constant ATTEMPT_LOGIN.', () => {
    expect(ATTEMPT_LOGIN).to.equal('ATTEMPT_LOGIN')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(profileReducer).to.be.a('function')
    })

    it('Should initialize with a state of 0 (Number).', () => {
      expect(profileReducer(undefined, {})).to.equal(0)
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = profileReducer(undefined, {})
      expect(state).to.equal(0)
      state = profileReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(0)
      state = profileReducer(state, increment(5))
      expect(state).to.equal(5)
      state = profileReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(5)
    })
  })

  describe('(Action Creator) increment', () => {
    it('Should be exported as a function.', () => {
      expect(increment).to.be.a('function')
    })

    it('Should return an action with type "ATTEMPT_LOGIN".', () => {
      expect(increment()).to.have.property('type', ATTEMPT_LOGIN)
    })

    it('Should assign the first argument to the "payload" property.', () => {
      expect(increment(5)).to.have.property('payload', 5)
    })

    it('Should default the "payload" property to 1 if not provided.', () => {
      expect(increment()).to.have.property('payload', 1)
    })
  })

  describe('(Action Creator) doubleAsync', () => {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(() => {
      _globalState = {
        counter : profileReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          counter : profileReducer(_globalState.counter, action)
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    it('Should be exported as a function.', () => {
      expect(doubleAsync).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(doubleAsync()).to.be.a('function')
    })

    it('Should return a promise from that thunk that gets fulfilled.', () => {
      return doubleAsync()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
    })

    it('Should call dispatch and getState exactly once.', () => {
      return doubleAsync()(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledOnce
          _getStateSpy.should.have.been.calledOnce
        })
    })

    it('Should produce a state that is double the previous state.', () => {
      _globalState = { counter: 2 }

      return doubleAsync()(_dispatchSpy, _getStateSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledOnce
          _getStateSpy.should.have.been.calledOnce
          expect(_globalState.counter).to.equal(4)
          return doubleAsync()(_dispatchSpy, _getStateSpy)
        })
        .then(() => {
          _dispatchSpy.should.have.been.calledTwice
          _getStateSpy.should.have.been.calledTwice
          expect(_globalState.counter).to.equal(8)
        })
    })
  })

  // NOTE: if you have a more complex state, you will probably want to verify
  // that you did not mutate the state. In this case our state is just a number
  // (which cannot be mutated).
  describe('(Action Handler) ATTEMPT_LOGIN', () => {
    it('Should increment the state by the action payload\'s "value" property.', () => {
      let state = profileReducer(undefined, {})
      expect(state).to.equal(0)
      state = profileReducer(state, increment(1))
      expect(state).to.equal(1)
      state = profileReducer(state, increment(2))
      expect(state).to.equal(3)
      state = profileReducer(state, increment(-3))
      expect(state).to.equal(0)
    })
  })
}) */
