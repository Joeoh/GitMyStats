/*
  We have to do something weird in asynchronous tests because of a known bug
  when using `mocha` the test runner with `chai` as the assertion library.
  Ideally you'd like to write something like the following in a callback:
    
      assert.isOk("some assertion", "failure message");
      done();

  Since the test is asynchronous we need to let `mocha` the test runner
  know when the test is finished. This is done by calling the `done`
  callback, as you can see above. This is the normal way of writing an
  asynchonous callback.

  What the bug does is that if an `assert` call fails an exception is raised
  that is not caught by `mocha` the test runner. So we have to catch the
  exception ourselves and return it to `mocha` through the `done` callback. The
  following illustrates this approach:
    
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