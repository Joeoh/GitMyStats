/*

  When writing asynchronous tests  we need to let `mocha` the test runner know
  when the test is finished. This is done by calling the `done` function which
  `mocha` provides.

      function() {
          assert.isOk("some assertion", "failure message");
          done();
      }
  
  However we have to do something weird because of a known bug when using
  `mocha` with `chai` as the assertion library. What the bug does is that if an
  `assert` call fails an exception is raised that is not caught by `mocha`. So
  we have to catch the exception ourselves and return it to `mocha` through the
  `done` callback.
    
      try {
        assert.isOk("some assertion", "failure message");
        done();
      } catch(e) {
        done(e);
      }

  The reason you don't see the above in our actual tests is that it's a lot to
  type for every async test. So instead it's wrapped into a function resulting
  in the following code:

      asyncAsserts(done, function() {
          assert.isOk("some assertion", "failure message");
      });
*/

var asyncAsserts = function(done, asserts) {
    try {
        asserts();
        done();
    } catch(e) {
        done(e);
    }
}

module.exports = asyncAsserts;