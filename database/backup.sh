#! /bin/sh


# Usage: 

# ./backup.sh to do a simple timestamped backup of the graph.db, it goes into ./backups/graph_backup_DATE-%y-%m-%d_TIME-%H-%M-%S.tar.gz

# ./backup.sh myOtherBackup.tar.gz to do a named backup of the graph.db, it goes where you specified with the name myOtherBackup.tar.gz

# ./backup.sh myOtherBackup.tar.gz myDB to do a named backup of the myDB.db, it goes where you specified with the name myOtherBackup.tar.gz

NEO4J_HOME="/home/nicolas/Downloads/Apps/neo4j-community-3.5.14"
NEO4J_CONF="$NEO4J_HOME/conf"

# $0 is the command like `./backup.sh`
SCRIPT_LOCATION="`dirname \"$0\"`"

DATABASE="graph.db"

if [ ! -d backups ]
then
	mkdir backups
fi

if [ $1 ]
then
	if [ $2 ]
	then
		#rsync --archive $NEO4J_HOME/data/databases/$2 $1
		tar --create --auto-compress --file $1 --directory=$NEO4J_HOME/data/databases/ $2
	else
		tar --create --auto-compress --file $1 --directory=$NEO4J_HOME/data/databases/ $DATABASE
	fi
else
	rsync --archive $NEO4J_HOME/data/databases/$DATABASE $SCRIPT_LOCATION/db/
	tar --create --auto-compress --file backups/graph_backup_$(date "+DATE-%y-%m-%d_TIME-%H-%M-%S").tar.gz --directory=db graph.db
fi

# tar --create --auto-compress --file backup-1.tar.gz db/graph.db
# --directory to change directory before starting operation
# tar --create --auto-compress --file backup-1.tar.gz --directory=db graph.db
