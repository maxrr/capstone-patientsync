rsync-push:
	rsync -azP --filter=':- .gitignore' /mnt/c/Users/maxrr/Desktop/School/cs639-gehealthcare-1/ maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1

rsync-pull:
	rsync -nzP maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1/.gitignore /mnt/c/Users/maxrr/Desktop/School/cs639-gehealthcare-1/.gitignore
	rsync -nazP --filter=':e- .gitignore' --include='**.gitignore' maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1/ /mnt/c/Users/maxrr/Desktop/School/

rsync-push-delete:
	rsync -azP --filter=':e- .gitignore' --delete-after /mnt/c/Users/maxrr/Desktop/School/cs639-gehealthcare-1/ maxrr@dev02.grimb.ly:~/projects/cs639-gehealthcare-1

bumble-launch:
	python3 bumble_custom/examples/gehc_sample_devices.py bumble_custom/examples/multiple_devices.json android-netsim