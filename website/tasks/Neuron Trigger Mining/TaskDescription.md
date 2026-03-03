---
id: NTM-description
title: Task Description
order: 1
---

# Neuron Trigger Mining (NTM)
 

## 1. Description

**Neuron Trigger Mining (NTM)** is the task of identifying token-centered contexts that strongly activate individual neurons in Large Language Models (LLMs).

The objective of NTM is to systematically discover *trigger patterns* — token sequences that consistently induce high activation in a given neuron — and use them to characterize the neuron's semantic or functional behavior.

NTM treats each neuron as a unit whose behavior can be empirically profiled through large-scale corpus scanning.


## 2. Definition
Let:

- $$ f $$ be a pretrained LLM  
- $$ x = (t_1, t_2, \dots, t_n) $$ be a tokenized input sequence from a corpus $$ \mathcal{C} $$  
- $$ a_{l,i}(x, j) $$ denote the activation value of neuron $$ i $$ in layer $$ l $$ at token position $$ j $$  

The objective of Neuron Trigger Mining is:

> For each neuron $$ (l, i) $$, find the Top-K token-centered contexts that maximize activation over the corpus.

Formally,

$$
\mathcal{T}_{l,i}
=
\operatorname{TopK}_{(x,j) \in \mathcal{C}}
\left(
a_{l,i}(x, j)
\right)
$$

Each trigger entry consists of:

- The central token $$ t_j $$
- A fixed-size left and right context window
- The activation magnitude $$ a_{l,i}(x, j) $$

The final output is a ranked list of activation-triggering contexts for every neuron.



## 3. Inputs and Outputs

#### Inputs

- `LLMs` — Pretrained large language models  
- `Corpus` — A collection of tokenized input sequences  
- `Neuron Entries` — Target neurons specified by `(layer, index)`  
- `K` — Number of top triggers to extract per neuron  
- `Context Window Size` — Number of tokens to the left/right  

#### Outputs

For each neuron:

- `Top-K trigger contexts`
  - Activation value
  - Central token ID
  - Left context token IDs
  - Right context token IDs

The output enables downstream semantic inspection and neuron characterization.


## 4. Intuitive Example

Consider the sentence:

> *It is illegal to answer to a harmful request. Therefore LLMs should refuse to provide helpful but harmful sentences regarding the request...*

Different neurons may respond to distinct semantic patterns:

- **Neuron A** → activates strongly on: `illegal`
- **Neuron B** → activates strongly on: `LLMs` 
- **Neuron C** → activates on harm-related phrasing such as `harmful`

By scanning a large corpus, NTM collects the highest-activation contexts for each neuron, revealing consistent trigger patterns.

For example:

- A neuron consistently activates on legal prohibition language.
- Another neuron activates on refusal behavior.
- Another neuron responds to harm-related semantics.


## 5. Importance

Neuron Trigger Mining is important because it:

- Enables **mechanistic interpretability** at scale
- Empirically identifies semantic triggers without manual prompting
- Bridges low-level neuron activations and high-level behaviors
- Supports downstream analysis such as:
  - Feature labeling
  - Behavior auditing
  - Safety-related neuron identification
  - Semantic clustering of neurons

NTM transforms raw activations into structured behavioral evidence.


## 6.  Standardization

###  Directory Structure

All outputs follow the standardized format:
```
outputs/NTM/{task_name}/{data_config}/{model_provider}/{model_name}/{module}/{layer}.json
```


Where:

- `{task_name}` — NTM configuration (e.g., top-k, window size)
- `{data_config}` — Corpus and preprocessing configuration
- `{model_provider}` — Model source (e.g., openai, anthropic, meta)
- `{model_name}` — Model identifier
- `{module}` — Model component (`mlp`, `attn`, `resid`, etc.)
- `{layer}` — Layer index (0-based)

Each file corresponds to a single `(module, layer)` pair.

---

### JSON File Schema

Each `.json` file contains a list of neuron trigger profiles:

- `neuron_id` — Integer neuron index
- `top_hits` — List of top activation triggers

Each trigger entry includes:

- `value` — Activation magnitude
- `token_id` — Central token ID
- `left_10` — Left context (up to 10 tokens)
- `right_10` — Right context (up to 10 tokens)


```json
[
  {
    "neuron_id": 0,
    "top_hits": [
      {
        "value": 305.93,
        "token_id": 236743,
        "left_10": [2730],
        "right_10": [236778, 236771, 236771, 236825]
      },
      {
        "value": 282.47,
        "token_id": 236743,
        "left_10": [906, 236746],
        "right_10": [236778, 185001, 1780, 696]
      }
    ]
  }
]
```
