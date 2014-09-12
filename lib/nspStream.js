// 0. return a duplex stream
// 1. Check if it is a package.json or a shrinkwrap.json (in shrinkwrap, dependencies are objects)
// 2. then pipe it to different functions specially for each (that use nsp-core)
// 3. pipe out