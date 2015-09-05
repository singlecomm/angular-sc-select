describe('scSelectParser', () => {

  let scSelectParser;

  beforeEach(inject((_scSelectParser_) => {
    scSelectParser = _scSelectParser_;
  }));

  describe('parse success', () => {

    let scope, locals, actualResult, expectedResult, states, statesObj;

    beforeEach(function() {
      states = ['Alabama', 'California', 'Delaware'];
      statesObj = [
        {code: 'AL', name: 'Alabama'},
        {code: 'CA', name: 'California'},
        {code: 'DE', name: 'Delaware'}
      ];
    });

    it('should parse the simplest array-based syntax', () => {
      scope = {states: states};
      actualResult = scSelectParser.parse('state for state in states');
      locals = {
        [actualResult.itemName]: 'Alabama'
      };
      expectedResult = {
        source: states,
        viewMapper: 'Alabama',
        modelMapper: 'Alabama'
      };
    });

    it('should parse the simplest function-based syntax', () => {
      scope = {getStates: () => states};
      actualResult = scSelectParser.parse('state for state in getStates()');
      locals = {
        [actualResult.itemName]: 'Alabama'
      };
      expectedResult = {
        source: states,
        viewMapper: 'Alabama',
        modelMapper: 'Alabama'
      };
    });

    it('should allow to specify custom model mapping that is used as a label as well', () => {
      scope.states = statesObj;
      actualResult = scSelectParser.parse('state.name for state in states');
      locals = {
        [actualResult.itemName]: {
          name: 'Alabama'
        }
      };
      expectedResult = {
        source: statesObj,
        viewMapper: 'Alabama',
        modelMapper: 'Alabama'
      };
    });

    it('should allow to specify custom view and model mappers', () => {
      scope.states = statesObj;
      actualResult = scSelectParser.parse('state.code as state.name + " ("+state.code+")" for state in states');
      locals = {
        [actualResult.itemName]: {
          name: 'Alabama',
          code: 'AL'
        }
      };
      expectedResult = {
        source: statesObj,
        viewMapper: 'Alabama (AL)',
        modelMapper: 'AL'
      };
    });

    afterEach(() => {
      expect(actualResult.source(scope)).to.eql(expectedResult.source);
      expect(actualResult.viewMapper(scope, locals)).to.equal(expectedResult.viewMapper);
      expect(actualResult.modelMapper(scope, locals)).to.equal(expectedResult.modelMapper);
    });

  });

  describe('parse error', () => {

    it('should throw a parse error', () => {
      expect(scSelectParser.parse.bind(null, 'this is invalid')).to.throw(Error);
    });

  });

});
