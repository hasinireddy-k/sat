"""
Backward compatibility shim for train_lora
"""
import os, sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
if MODELS_DIR not in sys.path:
    sys.path.insert(0, MODELS_DIR)
from vlm_adapter import RemoteSensingVLMAdapter, BIGEARTHNET_19, CLASS2IDX, LoRALinear