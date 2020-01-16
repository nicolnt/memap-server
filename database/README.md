# DB backup script usage

## Commands on LINUX
```sh
./backup.sh to do a simple timestamped backup of the graph.db, it goes into ./backups/graph_backup_DATE-%y-%m-%d_TIME-%H-%M-%S.tar.gz
```

```sh
./backup.sh myOtherBackup.tar.gz to do a named backup of the graph.db, it goes where you specified with the name myOtherBackup.tar.gz
```

```sh
./backup.sh myOtherBackup.tar.gz myDB to do a named backup of the myDB.db, it goes where you specified with the name myOtherBackup.tar.gz
```

## Backups
They are timestamped and located in `/database/backups/`
