from pathlib import Path

import cv2
import numpy as np


SOURCE = Path("spi.mp4")
TARGET = Path("spi-hd.mp4")
TARGET_SIZE = (1920, 1080)


def cinematic_crop(frame):
    height, width = frame.shape[:2]
    target_ratio = TARGET_SIZE[0] / TARGET_SIZE[1]
    crop_height = int(width / target_ratio)
    crop_height = min(crop_height, height)
    y0 = max((height - crop_height) // 2, 0)
    return frame[y0 : y0 + crop_height, 0:width]


def enhance_frame(frame):
    frame = cv2.resize(frame, TARGET_SIZE, interpolation=cv2.INTER_CUBIC)

    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    luminance, a_channel, b_channel = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(8, 8))
    luminance = clahe.apply(luminance)
    frame = cv2.cvtColor(cv2.merge((luminance, a_channel, b_channel)), cv2.COLOR_LAB2BGR)

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.08, 0, 255)
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.03, 0, 255)
    frame = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    blurred = cv2.GaussianBlur(frame, (0, 0), 1.15)
    return cv2.addWeighted(frame, 1.28, blurred, -0.28, 0)


def main():
    capture = cv2.VideoCapture(str(SOURCE))
    if not capture.isOpened():
        raise SystemExit(f"Could not open {SOURCE}")

    fps = capture.get(cv2.CAP_PROP_FPS) or 30
    total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(TARGET), fourcc, fps, TARGET_SIZE)

    if not writer.isOpened():
        raise SystemExit("Could not create HD MP4 writer")

    index = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break

        writer.write(enhance_frame(cinematic_crop(frame)))
        index += 1

        if total_frames and index % 100 == 0:
            print(f"rendered {index}/{total_frames}")

    writer.release()
    capture.release()
    print(f"wrote {TARGET.resolve()}")


if __name__ == "__main__":
    main()
