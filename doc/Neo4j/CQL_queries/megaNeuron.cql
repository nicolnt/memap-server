
// NOTE: ADD a neuron
:params { props:{name: "TEST"}, tags:[{name:"tagA"}, {name:"tagB"}], type:"typeA", iconUUID:"f11cccc4-8689-423e-9c2e-0ce8357dc6b2" }

CREATE (neuron:Neuron)
	SET neuron = $props,
	neuron.dateCreated = TIMESTAMP(),
	neuron.dateEdited = TIMESTAMP(),
	neuron.dateConsulted = TIMESTAMP()
	WITH neuron

OPTIONAL MATCH (icon:Icon {uuid: $iconUUID})
	FOREACH ( dummy IN CASE WHEN $iconUUID <> "" THEN [1] ELSE [] END | 
			CREATE (neuron)-[r:HAS_ICON]->(icon)
			)
	WITH neuron, icon

OPTIONAL MATCH (type:Type {name: $type})
	FOREACH ( dummy IN CASE WHEN $type <> "" THEN [1] ELSE [] END | 
			CREATE (neuron)-[r:HAS_TYPE]->(type)
			)
	WITH neuron, icon, type

	UNWIND $tags AS tagItem
	MATCH (tag:Tag {name: tagItem.name})
	CREATE (neuron)-[r:HAS_TAG]->(tag)

	RETURN neuron, icon, type, tag

CREATE (neuron:Neuron)
	SET neuron = $props,
	neuron.dateCreated = TIMESTAMP(),
	neuron.dateEdited = TIMESTAMP(),
	neuron.dateConsulted = TIMESTAMP()
	WITH neuron

MATCH (icon:Icon {uuid: $iconUUID})
	FOREACH ( dummy IN CASE WHEN $iconUUID <> "" THEN [1] ELSE [] END | 
			CREATE (neuron)-[r:HAS_ICON]->(icon)
			)
	WITH neuron, icon

MATCH (type:Type {name: $type})
	FOREACH ( dummy IN CASE WHEN $type <> "" THEN [1] ELSE [] END | 
			CREATE (neuron)-[r:HAS_TYPE]->(type)
			)
	WITH neuron, icon, type

	UNWIND $tags AS tagItem
	MATCH (tag:Tag {name: tagItem.name})
	CREATE (neuron)-[r:HAS_TAG]->(tag)

	RETURN neuron, icon, type, tag



	// NOTE: Get data of a neuron
	:params {uuid: "neuronUUID"}

MATCH (neuron:Neuron {uuid: $uuid})
	OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
		OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
        WITH { name:tag.name, icon:iTag } AS tag, neuron
	OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
		OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
        WITH { name: type.name, color: type.color, icon:iType } AS type, tag, neuron
	OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)

	RETURN { neuron:neuron, tags: COLLECT(tag), type:type, icon:icon } AS myNeuron



	// NOTE: Delete neuron and break its relationships
	MATCH (neuron:Neuron {uuid! $uuid})
	DETACH DELETE neuron




:params { props: {les trucs du neuron}, tags: [ {name: "1"},{name: "2"} ], type:"type", iconUUID:"qzdqzq" }

CREATE (neuron:Neuron)
	SET neuron = $props,
	neuron.dateCreated = TIMESTAMP(),
	neuron.dateEdited = TIMESTAMP(),
	neuron.dateConsulted = TIMESTAMP()
	WITH neuron

OPTIONAL MATCH (neuron)-[r:HAS_ICON]-(i:Icon)
	DELETE r
	WITH neuron

MATCH (icon:Icon {uuid: $iconUUID})
	FOREACH ( dummy IN CASE WHEN $icon IS NOT NULL THEN [1] ELSE [] | 
			CREATE (neuron)-[r:HAS_ICON]->(icon)
			)
	WITH neuron, icon

OPTIONAL MATCH (n)-[r:HAS_TYPE]-(t:Type)
	DELETE r
	WITH neuron, icon

MATCH (type:Type {name: $type})
	FOREACH ( dummy CASE WHEN $type IS NOT NULL THEN [1] ELSE [] | 
			CREATE (neuron)-[r:HAS_TYPE]->(type)
			)
	WITH n, icon, type
	UNWIND $tags AS tag


	RETURN neuron, icon, type, tags

