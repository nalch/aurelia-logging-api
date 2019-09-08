import { configure } from 'resources/index';

class ConfigStub {
  globalResources(...resources) {
    this.resources = resources;
  }
}

describe('the Aurelia configuration', () => {
  var mockedConfiguration;

  beforeEach(() => {
    // mockedConfiguration = new ConfigStub();
    // configure(mockedConfiguration, {
    //   client: null
    // });
  });

  it('should throw an error without a configured client', () => {
    mockedConfiguration = new ConfigStub();
    expect(() => configure(mockedConfiguration)).toThrowError();
  });

});
