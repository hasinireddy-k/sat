"""
SatQuery AI — Bi-Temporal Sample Generator
Creates authentic T1 and T2 GeoTIFFs with real spatial transforms, CRS, and controlled physical change.
"""

import os
import numpy as np
import tifffile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESTS_DIR = os.path.join(BASE_DIR, 'tests')
T1_PATH = os.path.join(TESTS_DIR, 'bitemporal_t1_cartosat.tif')
T2_PATH = os.path.join(TESTS_DIR, 'bitemporal_t2_cartosat.tif')

def create_bitemporal_pair():
    h, w = 512, 512
    np.random.seed(42)

    # Base T1: 4-band optical scene (Blue, Green, Red, NIR)
    # Band 0: Blue, Band 1: Green, Band 2: Red, Band 3: NIR
    b_band = np.random.normal(50, 8, (h, w)).astype(np.float32)
    g_band = np.random.normal(70, 10, (h, w)).astype(np.float32)
    r_band = np.random.normal(55, 8, (h, w)).astype(np.float32)
    nir_band = np.random.normal(140, 15, (h, w)).astype(np.float32) # High NIR (vegetation)

    # Add an agricultural parcel in northern sector
    nir_band[50:180, 80:240] = 180.0
    r_band[50:180, 80:240] = 40.0

    t1_raster = np.stack([
        np.clip(b_band, 0, 255).astype(np.uint8),
        np.clip(g_band, 0, 255).astype(np.uint8),
        np.clip(r_band, 0, 255).astype(np.uint8),
        np.clip(nir_band, 0, 255).astype(np.uint8)
    ], axis=0) # (4, 512, 512)

    # Base T2: Clone of T1 with two physical changes:
    # Change 1: New urban industrial structure constructed in central sector (x: 200..320, y: 220..340)
    # Reflectance in visible bands increases, NIR decreases
    t2_b = b_band.copy()
    t2_g = g_band.copy()
    t2_r = r_band.copy()
    t2_nir = nir_band.copy()

    # Structure added (high visible reflectance, low NIR)
    t2_b[220:340, 200:320] = 195.0
    t2_g[220:340, 200:320] = 200.0
    t2_r[220:340, 200:320] = 205.0
    t2_nir[220:340, 200:320] = 60.0

    # Change 2: Vegetation clearing in northern parcel (x: 90..160, y: 60..130)
    t2_nir[60:130, 90:160] = 50.0
    t2_r[60:130, 90:160] = 120.0

    t2_raster = np.stack([
        np.clip(t2_b, 0, 255).astype(np.uint8),
        np.clip(t2_g, 0, 255).astype(np.uint8),
        np.clip(t2_r, 0, 255).astype(np.uint8),
        np.clip(t2_nir, 0, 255).astype(np.uint8)
    ], axis=0)

    # GeoTIFF metadata tags:
    # 33550: ModelPixelScale (sx=0.5m, sy=0.5m, sz=0)
    # 33922: ModelTiepointTag (I=0, J=0, K=0, X=775000.0, Y=1435000.0, Z=0)
    # 34737: GeoAsciiParamsTag (WGS 84 / UTM zone 43N)
    # 306: TIFFTAG_DATETIME
    tags_t1 = [
        (33550, 'd', 3, (0.5, 0.5, 0.0), False),
        (33922, 'd', 6, (0.0, 0.0, 0.0, 775000.0, 1435000.0, 0.0), False),
        (34737, 's', 24, "WGS 84 / UTM zone 43N|", False),
        (306, 's', 20, "2024:01:15 09:30:00", False)
    ]

    tags_t2 = [
        (33550, 'd', 3, (0.5, 0.5, 0.0), False),
        (33922, 'd', 6, (0.0, 0.0, 0.0, 775000.0, 1435000.0, 0.0), False),
        (34737, 's', 24, "WGS 84 / UTM zone 43N|", False),
        (306, 's', 20, "2024:06:20 10:15:00", False)
    ]

    tifffile.imwrite(T1_PATH, t1_raster, extratags=tags_t1)
    tifffile.imwrite(T2_PATH, t2_raster, extratags=tags_t2)

    print(f"Created T1 GeoTIFF: {T1_PATH} (Acquisition: 2024-01-15)")
    print(f"Created T2 GeoTIFF: {T2_PATH} (Acquisition: 2024-06-20)")

if __name__ == '__main__':
    create_bitemporal_pair()
