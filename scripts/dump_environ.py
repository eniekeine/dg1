import os

with open('environ.txt', 'w') as fp:
    for x, k in os.environ.items():
        fp.write(x)
        fp.write(' : ')
        fp.write(k)
        fp.write('\n')
