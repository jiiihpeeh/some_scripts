#Run system command executing list of items in threaded mode. NOTE: multiprocessing is not needed in this case as it runs a system command.

from subprocess import run
from glob import glob
from threading import Thread
from threading import active_count
from os import cpu_count
from time import sleep

file_list = glob('*.png')
threads=cpu_count()

def optipng(png):
    run(['optipng', '-O8', png])

for i in file_list:
    t = Thread(target=optipng, args=[i])
    while active_count() >= threads:
        sleep(1e-5)
    t.start()
t.join()
