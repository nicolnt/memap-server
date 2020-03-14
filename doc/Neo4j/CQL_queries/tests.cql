name: A uuid: 01d44259-67a2-47cc-bbd3-c904ffc2fa59
name: D uuid: f667c8bc-370c-4cc2-8b2e-5910df49a89f
name: B uuid: 03e9ca0c-0569-4023-8ff8-488c8e7429eb
name: C uuid: fb759973-2a7d-472b-ba94-23872f766692

:params { rels: [ { type:"parent", uuidFrom: "f667c8bc-370c-4cc2-8b2e-5910df49a89f", uuidTo: "fb759973-2a7d-472b-ba94-23872f766692" }, { type:"friend", uuidFrom: "01d44259-67a2-47cc-bbd3-c904ffc2fa59", uuidTo: "fb759973-2a7d-472b-ba94-23872f766692" }, { type:"parent", uuidFrom: "03e9ca0c-0569-4023-8ff8-488c8e7429eb", uuidTo: "fb759973-2a7d-472b-ba94-23872f766692" }, { type:"parent", uuidFrom: "fb759973-2a7d-472b-ba94-23872f766692", uuidTo: "b826b0e8-66e9-4eed-857f-e0020cad3f65" } ] }

D is parent of C
B is parent of C

C is friend with A

// The query
UNWIND $rels AS rel
MATCH (from:Neuron)
	WHERE from.uuid = rel.uuidFrom
MATCH (to:Neuron)
	WHERE to.uuid = rel.uuidTo
WITH from, to, rel
FOREACH( t IN CASE WHEN rel.type = "parent" THEN [1] ELSE [] END | 
		CREATE (from)-[r:IS_PARENT]->(to) )
WITH from, to, rel
FOREACH( t IN CASE WHEN rel.type = "friend" THEN [1] ELSE [] END | 
		CREATE (from)-[r:IS_FRIEND]->(to) )



			MATCH (from:Neuron {uuid: $rel.uuidFrom})
			MATCH (to:Neuron {uuid: $rel.uuidTo})
			WITH from, to
			FOREACH( t IN CASE WHEN $rel.type = "parent" THEN [1] ELSE [] END | 
					CREATE (from)-[r:IS_PARENT]->(to) )
			WITH from, to
			FOREACH( t IN CASE WHEN $rel.type = "friend" THEN [1] ELSE [] END | 
					CREATE (from)-[r:IS_FRIEND]->(to) )
			RETURN from, to


MATCH ()-[r]-()
WHERE ID(r) IN [26, 5, 25, 4, 24]
DELETE r

			MATCH (from:Neuron {uuid: $rel.uuidFrom})-[r]-(to:Neuron {uuid: $rel.uuidTo})
			WITH from, to, r
			FOREACH( t IN CASE WHEN $rel.type = "parent" THEN [1] ELSE [] END | 
					DELETE (from)-[r:IS_PARENT]-(to) )
			WITH from, to, r
			FOREACH( t IN CASE WHEN $rel.type = "friend" THEN [1] ELSE [] END | 
					DELETE (from)-[r:IS_FRIEND]-(to) )
			RETURN from, to

MATCH (center:Neuron {uuid: $uuid})-[r]-(n:Neuron)
	RETURN n, TYPE(r) AS rel.type, STARTNODE(r).uuid AS rel.from

MATCH (from {name: "C"})-[r]-(to {name: "B"})
WHERE TYPE(r) = $type
DELETE r
RETURN from, to

// NOTE: relationship is optionnal
MATCH (t:Type)
WHERE t.name = $name
OPTIONAL MATCH (t)-[:ICON]-(i:Icon)
RETURN t AS type, i AS icon

// NOTE: Create relationship
MATCH (t:Type {name:$name})
MATCH (i:Icon {uuid: "112c2319-14d7-490d-8d53-3bd896eae22f"})
MERGE (t)-[r]->(i)
RETURN t AS type, i AS icon

// NOTE: change relationship type name
MATCH (f:Foo)-[rel:FOOBAR]->(b:Bar)
CALL apoc.refactor.setType(rel, 'NEW-TYPE')
YIELD input, output
RETURN input, output


MATCH (t:Type {name: $name})
OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
DELETE r
RETURN t AS type


// NOTE: Get links around 
MATCH (center:Neuron {uuid: $uuid})-[r]-(linkedNeuron:Neuron)
OPTIONAL MATCH (linkedNeuron)-[rp:IS_PARENT]->(o1:Neuron) WHERE o1 <> center 
OPTIONAL MATCH (linkedNeuron)<-[rc:IS_PARENT]-(o2:Neuron) WHERE o2 <> center
OPTIONAL MATCH (linkedNeuron)-[rf:IS_FRIEND]-(o3:Neuron) WHERE o3 <> center
RETURN { 
	name: linkedNeuron.name,
	relationship_type: TYPE(r),
	from: STARTNODE(r).uuid,
	neuronUUID: linkedNeuron.uuid,
	nChildren: COUNT(DISTINCT rp),
    nParents: COUNT(DISTINCT rc),
    nFriends: COUNT(DISTINCT rf)
} AS myNeuron
