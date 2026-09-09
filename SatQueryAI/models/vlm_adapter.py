"""
SatQuery AI — Vision-Language Model (VLM) LoRA Adapter Architecture
SIH 2026 Problem Statement 26167
Target: Parameter-Efficient Domain Adaptation for Remote Sensing & Earth Observation
"""

import math
import torch
import torch.nn as nn
import torch.nn.functional as F

BIGEARTHNET_19 = [
    "Urban fabric",
    "Industrial or commercial units",
    "Arable land",
    "Permanent crops",
    "Pastures",
    "Complex cultivation patterns",
    "Land principally occupied by agriculture, with significant areas of natural vegetation",
    "Agro-forestry areas",
    "Broad-leaved forest",
    "Coniferous forest",
    "Mixed forest",
    "Natural grassland and sparsely vegetated areas",
    "Moors, heathland and sclerophyllous vegetation",
    "Transitional woodland, shrub",
    "Beaches, dunes, sands",
    "Inland wetlands",
    "Coastal wetlands",
    "Inland waters",
    "Marine waters"
]
CLASS2IDX = {c: i for i, c in enumerate(BIGEARTHNET_19)}

class LoRALinear(nn.Module):
    """
    Low-Rank Adaptation (LoRA) layer on top of linear projection.
    W' = W + (B * A) * (alpha / r)
    """
    def __init__(self, in_features, out_features, r=16, lora_alpha=32, lora_dropout=0.05):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.r = r
        self.scaling = lora_alpha / r

        # Frozen base projection
        self.weight = nn.Parameter(torch.empty(out_features, in_features), requires_grad=False)
        nn.init.kaiming_uniform_(self.weight, a=math.sqrt(5))

        # Trainable LoRA low-rank decomposition matrices
        self.lora_A = nn.Parameter(torch.zeros(r, in_features), requires_grad=True)
        self.lora_B = nn.Parameter(torch.zeros(out_features, r), requires_grad=True)
        self.dropout = nn.Dropout(p=lora_dropout)

        # Initialize A with normal, B with zeros (LoRA initially is identity)
        nn.init.kaiming_uniform_(self.lora_A, a=math.sqrt(5))
        nn.init.zeros_(self.lora_B)

    def forward(self, x):
        base_out = F.linear(x, self.weight)
        lora_out = (self.dropout(x) @ self.lora_A.t()) @ self.lora_B.t() * self.scaling
        return base_out + lora_out

class RemoteSensingVLMAdapter(nn.Module):
    """
    Domain-Adapted Vision-Language Model with BigEarthNet-19 Multi-Spectral LoRA.
    Adapts base visual transformer representations into earth observation spatial semantics.
    """
    def __init__(self, num_classes=19, embed_dim=768, lora_rank=16, lora_alpha=32):
        super().__init__()
        # Visual spatial patch projection
        self.patch_conv = nn.Conv2d(3, embed_dim, kernel_size=16, stride=16)
        self.norm = nn.LayerNorm(embed_dim)

        # LoRA-adapted Attention Projections
        self.q_proj = LoRALinear(embed_dim, embed_dim, r=lora_rank, lora_alpha=lora_alpha)
        self.k_proj = LoRALinear(embed_dim, embed_dim, r=lora_rank, lora_alpha=lora_alpha)
        self.v_proj = LoRALinear(embed_dim, embed_dim, r=lora_rank, lora_alpha=lora_alpha)
        self.o_proj = LoRALinear(embed_dim, embed_dim, r=lora_rank, lora_alpha=lora_alpha)

        # Multi-Spectral Cross-Attention Aggregator
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))
        nn.init.normal_(self.cls_token, std=0.02)

        # Domain Head: BigEarthNet-19 multi-label prediction
        self.classifier_head = nn.Sequential(
            nn.Linear(embed_dim, 256),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(256, num_classes)
        )

    def forward(self, images):
        # images: (B, 3, H, W)
        B = images.size(0)
        patches = self.patch_conv(images)  # (B, D, H/16, W/16)
        patches = patches.flatten(2).transpose(1, 2)  # (B, N, D)

        cls_tokens = self.cls_token.expand(B, -1, -1)
        x = torch.cat((cls_tokens, patches), dim=1)  # (B, N+1, D)
        x = self.norm(x)

        # Self-attention with LoRA projections
        q = self.q_proj(x)
        k = self.k_proj(x)
        v = self.v_proj(x)

        attn_weights = torch.softmax((q @ k.transpose(-2, -1)) / math.sqrt(q.size(-1)), dim=-1)
        attn_out = attn_weights @ v
        out = self.o_proj(attn_out)

        # Extract pooled classification representation
        pooled = out[:, 0]  # (B, D)
        logits = self.classifier_head(pooled)  # (B, num_classes)
        return logits, pooled