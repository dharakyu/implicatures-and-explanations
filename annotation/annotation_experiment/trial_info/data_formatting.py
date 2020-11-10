import json
from random import shuffle

with open('raw_data.json') as f:
    data = json.loads(f.read())
    # print(data[0]['text'])

shuffle(data)

bucket_list = [[]]
bucket_id = 0
for story_id in range(len(data)):
    bucket_list[bucket_id].append(data[story_id])
    if (story_id+1) % 10 == 0:
        bucket_list.append([])
        bucket_id += 1

# with open('data.txt', 'w') as outfile:
#     json.dump(data, outfile)


with open('out.txt', 'w') as f:
    print(bucket_list, file=f)