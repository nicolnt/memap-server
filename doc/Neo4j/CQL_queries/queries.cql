// NOTE: Nodes can have multiple labels
CREATE (n:Node:Neuron:AWESOME)


// INFO: LABELS( n ) to get an array of an node 'n' labels
MATCH (n)
RETURN LABELS(n)


// NOTE: Get network around a node
// INFO: TYPE( r ) to get relation 'r' type eg. IS_FRIEND
// INFO: STARTNODE( r ) to get the starting node in a relation 'r' like (a)-[r]->(b) it is 'a'
MATCH (center:Neuron)-[r]-(n:Neuron)
WHERE center.uuid = "fb759973-2a7d-472b-ba94-23872f766692" // Center Node
RETURN n AS node, TYPE(r) AS type, STARTNODE(r).uuid AS from 


// NOTE: build a custom object
MATCH (center:Neuron {uuid: $uuid})-[r]-(n:Neuron)
WITH {
	type: TYPE(r),
    from: STARTNODE(r).uuid
} AS rel, n
RETURN n, rel


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


// BUG: Bad test - works when uniqueId exists among Nodes
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


// NOTE: You must delete node's relations before deleting the actual node
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


// NOTE: Use If-Else alternative with the FOREACH
// INFO prototype du foreach: FOREACH ( { item } IN { collection } | { opration } )
UNWIND $rels AS rel
MATCH (from:Neuron)
	WHERE from.uuid = rel.uuidFrom
MATCH (to:Neuron)
	WHERE to.uuid = rel.uuidTo
WITH from, to, rel
FOREACH( t IN CASE WHEN rel.type = "parent" THEN [1] ELSE [] END | // Le CASE renvoit des tableaux
		CREATE (from)-[r:IS_PARENT]->(to) )
WITH from, to, rel
FOREACH( t IN CASE WHEN rel.type = "friend" THEN [1] ELSE [] END | 
		CREATE (from)-[r:IS_FRIEND]->(to) )
