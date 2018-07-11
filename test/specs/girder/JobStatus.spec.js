import * as status from '@/components/girder/jobs/status';

describe('job/status', () => {
  it('get a built in status by key', () => {
    expect(status.get('SUCCESS').value).to.equal(3);
  });

  it('get a built in status by value', () => {
    expect(status.getByValue(3).text).to.equal('Success');
  });

  it('get unknown status by key', () => {
    expect(status.get('not registered')).to.eql({});
  });

  it('get unknown status by value', () => {
    expect(status.getByValue(-999)).to.eql({});
  });

  it('get all statuses', () => {
    expect(status.all()).to.not.be.empty;
  });

  it('register a custom status', () => {
    status.register({
      CUSTOM_STATUS: {
        value: 9999,
        text: 'custom',
      },
    });
    expect(status.get('CUSTOM_STATUS')).to.eql({ value: 9999, text: 'custom' });
  });

  it('register no-op', () => {
    const all = status.all();
    status.register();
    expect(status.all()).to.eql(all);
  });
});
