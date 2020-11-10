import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)

import torch
from torch.nn import MSELoss
import torch.nn as nn
from transformers import (BertPreTrainedModel, BertModel)
import logging

logger = logging.getLogger(__name__)


class BertForGuilt(BertPreTrainedModel):
    r"""
        **labels**: (`optional`) ``torch.LongTensor`` of shape ``(batch_size,)``:
            Labels for computing the sequence classification/regression loss.
            Indices should be in ``[0, ..., config.num_labels - 1]``.
            If ``config.num_labels == 1`` a regression loss is computed (Mean-Square loss),
            If ``config.num_labels > 1`` a classification loss is computed (Cross-Entropy).
    Outputs: `Tuple` comprising various elements depending on the configuration (config) and inputs:
        **loss**: (`optional`, returned when ``labels`` is provided) ``torch.FloatTensor`` of shape ``(1,)``:
            Classification (or regression if config.num_labels==1) loss.
        **logits**: ``torch.FloatTensor`` of shape ``(batch_size, config.num_labels)``
            Classification (or regression if config.num_labels==1) scores (before SoftMax).
        **hidden_states**: (`optional`, returned when ``config.output_hidden_states=True``)
            list of ``torch.FloatTensor`` (one for the output of each layer + the output of the embeddings)
            of shape ``(batch_size, sequence_length, hidden_size)``:
            Hidden-states of the model at the output of each layer plus the initial embedding outputs.
        **attentions**: (`optional`, returned when ``config.output_attentions=True``)
            list of ``torch.FloatTensor`` (one for each layer) of shape ``(batch_size, num_heads, sequence_length, sequence_length)``:
            Attentions weights after the attention softmax, used to compute the weighted average in the self-attention heads.
    Examples::
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        model = BertForSequenceClassification.from_pretrained('bert-base-uncased')
        input_ids = torch.tensor(tokenizer.encode("Hello, my dog is cute")).unsqueeze(0)  # Batch size 1
        labels = torch.tensor([1]).unsqueeze(0)  # Batch size 1
        outputs = model(input_ids, labels=labels)
        loss, logits = outputs[:2]
    """

    def __init__(self, config):
        super(BertForGuilt, self).__init__(config)
        self.num_labels = config.num_labels

        self.bert = BertModel(config)
        self.dropout = nn.Dropout(0.1)
        self.dropout_tok = nn.Dropout(0.1)
        self.classifier = nn.Linear(config.hidden_size, 1)
        self.token_classifier = nn.Linear(config.hidden_size, 1)
        self.init_weights()

    def forward(self, input_ids=None, attention_mask=None, token_type_ids=None,
                position_ids=None, head_mask=None, inputs_embeds=None, labels=None, training_head=[-1],
                with_token_cls=False, token_labels=None, device='cpu', highlight_ratio=None, use_cls_token=True):
        # use_cls_token: True if using [CLS] for final prediction; False if using mean pooling
        assert len(training_head) == 1
        assert training_head[0] != -1
        outputs = self.bert(input_ids,
                            attention_mask=attention_mask,
                            token_type_ids=token_type_ids,
                            position_ids=position_ids,
                            head_mask=head_mask,
                            inputs_embeds=inputs_embeds)
        all_hidden = outputs[0]
        if use_cls_token:
            pooled_output = outputs[1]
        else:
            pooled_output = torch.div(torch.sum(all_hidden * attention_mask.unsqueeze(-1), dim=1),
                                      torch.sum(attention_mask, axis=1).unsqueeze(-1))
        pooled_output = self.dropout(pooled_output)
        logits = self.classifier(pooled_output)

        if with_token_cls:
            seq_output = self.dropout(outputs[0])
            seq_logits = self.token_classifier(seq_output)
            seq_logits = seq_logits * attention_mask.unsqueeze(-1)
            outputs = (logits, seq_logits) + outputs[2:]  # add hidden states and attention if they are here
        else:
            outputs = (logits,) + outputs[2:]  # add hidden states and attention if they are here

        if labels is not None:
            loss_fct = MSELoss()
            loss = loss_fct(logits, labels)
            if with_token_cls:
                loss_fct_token = MSELoss()

                token_loss = loss_fct_token(seq_logits.reshape(-1), token_labels.reshape(-1))
                outputs = (token_loss,) + outputs
            outputs = (loss,) + outputs

        return outputs  # (loss), (token_loss), logits, (hidden_states), (attentions)
