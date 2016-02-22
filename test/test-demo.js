describe('thing being tested', function() {
  it('should do x', function() {
    [1].indexOf(0).should.equal(-1);
    [1].indexOf(2).should.equal(-1);
  });
});