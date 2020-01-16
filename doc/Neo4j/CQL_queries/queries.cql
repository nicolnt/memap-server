MATCH (p:Neuron) WHERE p.uuid = $uuid
MERGE (n:Neuron {title: 'N7'})
SET n.uuid = (n.title + '0b962e-041c-11e1-9234-0123456789ab')
CREATE (n)-[:PARENT]->(p)


// Bad IDEA: D'abord on créé après on lie (nope)
// INFO: On peut faire la liaison et la créa direct
// NOTE: RELATION must have a direction on CREATE
CREATE (n1:Node {name:"node A"})-[:FRIEND]->(n2:Node {name:"node B"});

//MATCH (n:Neuron {uuid: $uuid}), (n2:Neuron {uuid: 'N90b962e-041c-11e1-9234-0123456789ab'}) CREATE (n)-[:NOPE]->(n2)

// INFO: You can match without specifying the relationships direction
MATCH (n:Neuron),(n1:Neuron {title:'N8'}) WHERE (n)--(n1) RETURN n // OPTIMIZE: Cartesian product
// NOTE: Much simpler than above
MATCH (n:Neuron)--(n1:Neuron {title:"N8"}) RETURN n


// NOTE: Make a relation when creating a node, on a certain condition

// List to be unwinded
:params {"ids":[ {"id":1}, {"id":2}, {"id":3} ]}
// NOTE: Also possible without the quotes
:params {ids:[ {id:1}, {id:2}, {id:3} ]}

// Then do a batch create
UNWIND $ids AS id // INFO: AS is necessary
CREATE (n:Node)
SET n.uId = id.id,
n.name = ("name " + id.id)

:params {"uniqueId":2}

// BUG: Bad test 1
CREATE (new:Node {uId: 4})
MATCH (n2:Node {uId: $uniqueId})
CREATE (new)-[r]-(n2)
RETURN r

// BUG: Bad test 2
CREATE (new:Node {uId: 4, name: ("name "+$uniqueId)}),
(new)-[r:FRIEND]->(n2:Node {uId: $uniqueId})
SET new.name = "name 4"
RETURN r

// BUG: Bad test 3
CREATE (new:Node {uId: 4}),
(new)-[r:FRIEND]->(n2:Node {uId: $uniqueId})
SET new.name = "name 4"
RETURN r

// BUG: Bad test 4 - works when uniqueId exists among Nodes
MATCH (n2:Node {uId: $uniqueId})
CREATE (new:Node {uId: 4}),
(new)-[r:FRIEND]->(n2)
SET new.name = "name 4"
RETURN r

// INFO: Works super fine thanks InverseFalcon on StackOverflow
// URL: https://stackoverflow.com/a/59760202/11106413
CREATE (new:Node {uId: 4})
SET new.name = "name 4" 
WITH new //pipe for use after
MATCH (other:Node {uId: $uniqueId})
CREATE (new)-[r:FRIEND]->(other) 
RETURN r


// NOTE: MATCH with a limit
MATCH (n:Node) RETURN n LIMIT 25


// INFO: You must delete node's relations before deleting the actual node
MATCH (n:Node)-[r]-(n2:Node)
DELETE r // remove relation
WITH r // FIXME: WITH is necessary with a variable
MATCH (n:Node)
DELETE n // then remove node
// IDEA: Or I can separate with a semicolon ';' like
MATCH (n:Node)-[r]-(n2:Node) DELETE r; // Query 1
MATCH (n:Node) DELETE n // Then Query 2


// NOTE: Pipeing a variable 
// WITH is a means to pass on the variables you want to keep in scope (any others drop out of scope), and it's a good place to do aggregations and manipulation of data with function calls
MATCH (n1)
WITH n1
MATCH (n2)
WITH n1
RETURN n1 // n2 is out of scope here

// NOTE: Using aggregating and list functions
MATCH (n:Node)
WITH collect(n) AS nList // Pipe Nodes as a collection -> [{},{},{}]
// INFO: reduce(output = defaultValue, element IN elements | expression)
// URL: https://neo4j.com/docs/cypher-manual/3.5/functions/list/#functions-reduce
RETURN reduce(str = "", node IN nList | str + node.name) // NOTE: reduce() like in JavaScript


// NOTE: timestamping
UNWIND $props AS properties
CREATE (new:Neuron)
SET new = properties,
new.dateCreated = TIMESTAMP(),
new.dateConsult = TIMESTAMP(),
new.dateEdit = TIMESTAMP()

RETURN new


// NOTE: converting timestamps into dates if exists
MATCH (n:Neuron)
RETURN CASE exists(n.dateCreated)
WHEN true
	THEN datetime({epochMillis: n.dateCreated})
ELSE 
	n.dateCreated
END 
AS time

// NOTE: Rename a property
MATCH(n:Neuron)
WHERE EXISTS(n.dateCreation)
SET n.dateCreated = n.dateCreation
REMOVE n.dateCreation
