# Neo4j

## Installation
Using the tarball is convenient: https://neo4j.com/download-center/#community
* extract anywhere
* Make sure that your neo4j user and group is the owner
* run `chown --recursive neo4j:neo4j neo4j-community-3.5.14/`

## Systemd service
```systemd
[Unit]
Description=Neo4j Graph Database
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/home/nicolas/Downloads/Apps/neo4j-community-3.5.14/bin/neo4j console
Restart=on-failure
User=neo4j
Group=neo4j
Environment="NEO4J_CONF=/home/nicolas/Downloads/Apps/neo4j-community-3.5.14/conf" "NEO4J_HOME=/home/nicolas/Downloads/Apps/neo4j-community-3.5.14"
LimitNOFILE=40000
TimeoutSec=120

[Install]
WantedBy=multi-user.target
```

## Managing databases
Backup databases in `$NEO4J_HOME/data/databases/*.db`
Add db by adding this line in `$NEO4J_CONF/neo4j.conf` `dbms.active_database={ my new db name }.db`
