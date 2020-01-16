# UUID installation procedure

Procedures that use internal APIs have to be allowed in $NEO4J_HOME/conf/neo4j.conf with, e.g.  for security reasons.
In `$NEO4J_HOME/config/neo4j.conf` append the following
```
dbms.security.procedures.unrestricted=apoc.*

apoc.uuid.enabled=true
```

## Usage
```cql
CREATE CONSTRAINT ON (mynode:MyNodeLabel) ASSERT mynode.myUUIDField IS UNIQUE
```
```cql
CALL apoc.uuid.install('MyNodeLabel', {addToExistingNodes: true, uuidProperty: 'myUUIDField'}) yield label, installed, properties
```

## Help

https://github.com/neo4j-contrib/neo4j-apoc-procedures#manual-installation-download-latest-release
https://neo4j.com/docs/labs/apoc/current/graph-updates/uuid/

### My stackoverflow question with answer
https://stackoverflow.com/questions/59760516/how-to-use-uuids-in-neo4j-to-keep-pointers-to-nodes-elsewhere/59760719?noredirect=1#comment105667296_59760719
