rsync-push:
	rsync -azP --filter=':- .gitignore' /mnt/c/Users/maxrr/Desktop/School/cs639-gehealthcare-1/ maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1

rsync-pull:
	rsync -nzP maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1/.gitignore /mnt/c/Users/maxrr/Desktop/School/cs639-gehealthcare-1/.gitignore
	rsync -nazP --filter=':e- .gitignore' --include='**.gitignore' maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1/ /mnt/c/Users/maxrr/Desktop/School/

sync-delete:
	rsync -azP --filter=':e- .gitignore' --delete-after /mnt/c/Users/maxrr/Desktop/School/cs639-gehealthcare-1/ maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1