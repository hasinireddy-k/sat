# 🛰️ SatQuery AI: Multimodal Vision-Language Assistant for Remote Sensing

[![SIH 2026](https://img.shields.io/badge/SIH%202026-Problem%20Statement%2026167-blue.svg)](https://www.sih.gov.in/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20PyTorch-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB.svg)](https://vitejs.dev/)
[![LoRA](https://img.shields.io/badge/Domain%20Adaptation-BigEarthNet--19%20LoRA-FF6F00.svg)](https://arxiv.org/abs/2106.09685)

> **Official Solution for Smart India Hackathon (SIH) 2026 — Problem Statement 26167**  
> *Autonomous Multi-Agent Vision-Language System for Complex Remote Sensing Imagery, Bitemporal Change Detection, and Multi-Sensor Fusion.*

---

## 📖 Presentation Quick Guide
👉 **For a step-by-step evaluator script and folder-by-folder presentation guide, see [CODEBASE_EXPLAINER.md](CODEBASE_EXPLAINER.md).**

---

## 🌟 Key Capabilities & PS 26167 Compliance

| Requirement | SatQuery AI Implementation |
|---|---|
| **1. Input Compatibility Guardian** | Strict 10-point raster validation (format, CRS, GSD, bands, bit depth, temporal separation, optical-SAR coregistration) before model invocation. |
| **2. Multi-Agent Specialization** | Autonomous intent orchestrator routing to 5 dedicated models: Captioner, Grounding Engine, Bitemporal Change Specialist, and Optical-SAR Fusion Specialist. |
| **3. Domain Adaptation** | Qwen2-VL-2B adapted via BigEarthNet-19 Multi-Spectral LoRA weights (`models/adapters/bigearthnet_lora/adapter_model.pt`). |
| **4. Precise Spatial Grounding** | Pixel coordinate clicks and natural language localization translated into bounding boxes with confidence scores. |
| **5. Multitemporal Change** | Pixel-wise difference detection and interactive swipe-compare slider for floods, urban growth, and deforestation. |
| **6. Mission Control UI** | ISRO PS 26167 themed dashboard with live background constellation animations, factor breakdowns, and formal briefing export. |

---

## 🏗️ Architecture

```
User Query + Satellite GeoTIFF / Multi-Spectral Raster
                     │
                     ▼
       ┌───────────────────────────┐
       │ Input Compatibility Guard │ ──► Rejection if corrupted or incompatible
       └─────────────┬─────────────┘
                     │ Approved
                     ▼
       ┌───────────────────────────┐
       │   Master Orchestrator     │ ──► Classifies Task Intent
       └─────────────┬─────────────┘
                     ├─────────────────┬──────────────────┬─────────────────┐
                     ▼                 ▼                  ▼                 ▼
             [Scene Captioner]  [Grounding Agent]  [Change Specialist]  [SAR Specialist]
                     │                 │                  │                 │
                     └─────────────────┴─────────┬────────┴─────────────────┘
                                                 ▼
                                     [BigEarthNet LoRA VLM]
                                                 │
                                                 ▼
                             Calibrated Answer + BBoxes + Audit Trace
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Run Backend
```bash
# From repository root:
python -u SatQueryAI/backend/server.py
```
*Backend runs on `http://localhost:8000`*

### 3. Run Frontend
```bash
# In a new terminal:
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

### 4. Run ML Test Suite
```bash
python SatQueryAI/scripts/03_run_agent_pipeline.py
```

---

## 📁 Repository Structure

- `SatQueryAI/backend/`: FastAPI server, database ORM, and file uploads.
- `SatQueryAI/models/`: The 5 specialized AI agents + BigEarthNet LoRA weights.
- `SatQueryAI/datasets/`: Dataset reference specifications (BigEarthNet, VRSBench, RSVQA, CDVQA).
- `SatQueryAI/scripts/`: Numbered CLI pipeline for training, evaluation, and inference.
- `SatQueryAI/tests/`: Automated unit tests for all 5 agents and input validator.
- `src/`: React + TypeScript frontend with Mission Control UI and interactive canvas viewers.
- `CODEBASE_EXPLAINER.md`: Comprehensive cheat sheet for hackathon presentations.

---

## 📜 License
Developed for Smart India Hackathon (SIH) 2026. All rights reserved.\n