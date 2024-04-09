from collections import deque
import sys

# def generate_advertisement_data(name, services: list[str]):
#     # The elements composed in these fields https://stackoverflow.com/questions/27506474/how-to-byte-swap-a-32-bit-integer-in-python

#     # format: (type, content); content is unreversed
#     intro = (0x1, '06', 2)
#     joined_services = "".join(list(map(lambda a : prepare_uuid(a.replace("-", "")), services))).lower()
#     complete_list_of_services = (0x7, joined_services)
#     complete_local_name = (0x9, encode_to_hex_str(name))

#     to_include = [intro, complete_list_of_services, complete_local_name]
#     acc = ""
#     for entry in to_include:
#         entry_type = num_to_hex_byte(entry[0])
#         entry_content = entry[1]
#         entry_content_len = len(entry_content) / 2 + 1
#         entry_content_len_bytes = num_to_hex_byte(entry_content_len)
#         if len(entry) > 2:
#             entry_content_len_bytes = num_to_hex_byte(entry[2])

#         print(f'adding type {entry_type} with length {entry_content_len} ({entry_content_len_bytes}): {entry_content}')
#         # print(type(entry_type), type(entry_content), type(entry_content_len_bytes))

#         # acc += entry_content_len_bytes + entry_type + entry_content
#         acc += entry_content_len_bytes + entry_type + entry_content

#     acc = str(acc)
#     # for i, c in enumerate(acc):
#     #     print(i, c)
#     print(acc)
#     return acc

def breakdown(input: str) -> None:
    p = []
    b = deque()
    for i in range(0, len(input), 2):
        b.append(int(input[i:i+2], 16))

    count = 0
    while (len(b) > 0):
        count += 1
        field_length = b.popleft()
        field_type = b.popleft()
        field_value = []
        for i in range(field_length - 1):
            field_value.append(b.popleft())

        # field_value = list(reversed(field_value))
        field_value_hex = " ".join([hex(s) for s in field_value])
        field_value_chars = "".join([chr(s) for s in field_value])
        # field_value_chars_rev = "".join([chr(s) for s in list(reversed(field_value))])

        # for i, s in enumerate(field_value):
        #     print(i, s, chr(s))

        print(f'Field {count}:')
        print(f'\tLength: {hex(field_length)} ({field_length})')
        print(f'\tType: {hex(field_type)} ({field_type})')
        print(f'\tValue (hex): {field_value_hex}')
        print(f'\tValue (str): {field_value_chars}')
        # print(f'\tValue (flp): {field_value_chars_rev}')

if __name__ == '__main__':
    to_validate = sys.argv[1]
    breakdown(to_validate)