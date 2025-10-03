// Initialize a single-node replica set for local development
try {
  const status = rs.status();
  if (status.ok === 1) {
    print("Replica set already initialized: " + status.set);
  }
} catch (e) {
  if (
    e.codeName === "NotYetInitialized" ||
    /no replset config has been received/.test(e.message)
  ) {
    print("Initializing replica set rs0...");
    rs.initiate({
      _id: "rs0",
      members: [{ _id: 0, host: "localhost:27017" }],
    });
    // Wait a bit for the replica set to become PRIMARY
    var attempt = 0;
    while (attempt < 10) {
      try {
        var s = rs.status();
        if (s.members && s.members[0] && s.members[0].stateStr === "PRIMARY") {
          print("Replica set rs0 is PRIMARY");
          break;
        }
      } catch (err) {}
      sleep(1000);
      attempt++;
    }
  } else {
    print("Unexpected error while checking replica set status: " + tojson(e));
  }
}

print("Replica set init script finished");
