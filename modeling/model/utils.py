import random
import re

import numpy as np
import torch


def set_seed(args):
    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    if args.n_gpu > 0:
        torch.cuda.manual_seed_all(args.seed)


string_split = lambda string: [(m.group(0), m.start(), m.end() - 1) for m in re.finditer(r'\S+', string)]


# tokenizer helper
def wordpiece_with_indices(tokenizer, word, start_index=0):
    tokens = tokenizer.tokenize(word)
    output = []
    for tok in tokens:
        if tok[:2] == "##":
            output.append((tok, start_index, start_index + len(tok) - 2))
            start_index += len(tok) - 2
        else:
            output.append((tok, start_index, start_index + len(tok)))
            start_index += len(tok)
    return output


def highlight_parser(string, highlights, tokenizer, source):
    # return list of token, indices, and highlight score
    highlights = [i for i in highlights if i]
    if len(highlights) == 0:
        return None
    highlights = [hl[source if source else 0] for hl in highlights]
    assert len(string) == len(highlights[0])
    highlights = [[int(i) for i in hl] for hl in highlights]
    string_splited = string_split(string)
    wordpiece_tokens = sum([wordpiece_with_indices(tokenizer, tok, start) for tok, start, end in string_splited], [])
    highlights = [[np.mean(highlight[start:end]) for _, start, end in wordpiece_tokens] for highlight in highlights]
    highlight_mean = list(np.mean(highlights, axis=0))
    return highlight_mean
