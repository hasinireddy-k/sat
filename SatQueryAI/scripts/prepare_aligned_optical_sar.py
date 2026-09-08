"""
SatQuery AI — Co-registered Optical-SAR Pair Generator
Generates physically co-registered Multi-Spectral Optical and SAR C-Band rasters with identical CRS and bounds.
"""

import os
import numpy as np
import tifffile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESTS_DIR = os.path.join(BASE_DIR, 'tests')
OPT_PATH = os.path.join(TESTS_DIR, 'coregistered_optical_vnir.tif')
SAR_PATH = os.path.join(TESTS_DIR, 'coregistered_sar_cband.tif')

def generate_coregistered_pair():
    h, w = 512, 512
    np.random.seed(101)

    # 1. Multi-Spectral Optical Scene (Blue, Green, Red, NIR)
    # Background: Mixed vegetation and agriculture
    opt_b = np.random.normal(45, 6, (h, w)).astype(np.float32)
    opt_g = np.random.normal(75, 8, (h, w)).astype(np.float32)
    opt_r = np.random.normal(50, 6, (h, w)).astype(np.float32)
    opt_nir = np.random.normal(160, 15, (h, w)).astype(np.float32)

    # Water reservoir in southwest sector (x: 50..180, y: 300..450)
    opt_b[300:450, 50:180] = 90.0
    opt_g[300:450, 50:180] = 55.0
    opt_r[300:450, 50:180] = 25.0
    opt_nir[300:450, 50:180] = 10.0 # Absorbs NIR

    # Urban industrial complex in northeast (x: 320..460, y: 60..200)
    opt_b[60:200, 320:460] = 180.0
    opt_g[60:200, 320:460] = 185.0
    opt_r[60:200, 320:460] = 190.0
    opt_nir[60:200, 320:460] = 70.0

    # Thin cloud/haze bank over the industrial complex in optical (x: 300..480, y: 40..220)
    opt_b[40:220, 300:480] += 60.0
    opt_g[40:220, 300:480] += 60.0
    opt_r[40:220, 300:480] += 60.0

    opt_raster = np.stack([
        np.clip(opt_b, 0, 255).astype(np.uint8),
        np.clip(opt_g, 0, 255).astype(np.uint8),
        np.clip(opt_r, 0, 255).astype(np.uint8),
        np.clip(opt_nir, 0, 255).astype(np.uint8)
    ], axis=0) # (4, 512, 512)

    # 2. SAR C-Band Microwave Radar (Single polarization amplitude)
    # Background: Speckled vegetation return (Rayleigh/Gamma distribution)
    sar_raw = np.random.gamma(3.0, 15.0, (h, w)).astype(np.float32)

    # Water reservoir in southwest: Specular reflection -> Extremely low return
    sar_raw[300:450, 50:180] = np.random.uniform(1.0, 4.0, size=(150, 130))

    # Urban complex in northeast: Dihedral double-bounce wall reflections -> High return spikes
    # NOTICE: Cloud haze does NOT affect SAR! SAR penetrates cloud to reveal building walls clearly!
    for _ in range(35):
        rx = np.random.randint(330, 450)
        ry = np.random.randint(70, 190)
        sar_raw[ry:ry+4, rx:rx+4] = np.random.uniform(350.0, 650.0)

    sar_raster = np.clip(sar_raw, 0, 1023).astype(np.float32) # (512, 512)

    # Identical GeoTIFF spatial metadata
    tags = [
        (33550, 'd', 3, (0.5, 0.5, 0.0), False),
        (33922, 'd', 6, (0.0, 0.0, 0.0, 775000.0, 1435000.0, 0.0), False),
        (34737, 's', 24, "WGS 84 / UTM zone 43N|", False),
        (306, 's', 20, "2024:05:10 11:20:00", False)
    ]

    tifffile.imwrite(OPT_PATH, opt_raster, extratags=tags)
    tifffile.imwrite(SAR_PATH, sar_raster, extratags=tags)

    print(f"Generated Co-registered Optical: {OPT_PATH}")
    print(f"Generated Co-registered SAR:     {SAR_PATH}")
    print("Spatial Reference: WGS 84 / UTM zone 43N | Extent: 775000E, 1435000N | GSD: 0.5m/px")

if __name__ == '__main__':
    generate_coregistered_pair()
