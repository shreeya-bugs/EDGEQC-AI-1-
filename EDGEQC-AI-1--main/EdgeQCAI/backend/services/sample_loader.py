import os
import glob
import base64
from typing import List, Dict, Any

DATASET_ROOT = r"c:\Users\shree\Downloads\Datasett (1)\Datasett\Dataset\Datasets"

def get_sample_dataset_images() -> List[Dict[str, Any]]:
    """
    Scans dataset folder for sample images across categories (normal, misaligned, missing, blur, rotated, torn)
    and returns a curated list for 1-click testing in the frontend inspection HUD.
    """
    samples = []
    if not os.path.exists(DATASET_ROOT):
        return samples

    categories = ["normal", "misaligned", "missing", "blur", "rotated", "torn"]

    for split in ["train", "test"]:
        split_dir = os.path.join(DATASET_ROOT, split)
        if not os.path.exists(split_dir):
            continue

        for category in categories:
            cat_dir = os.path.join(split_dir, category)
            if not os.path.exists(cat_dir):
                continue

            # Pick up to 2 representative images per category
            image_files = glob.glob(os.path.join(cat_dir, "*.*"))
            for img_path in image_files[:2]:
                ext = os.path.splitext(img_path)[1].lower()
                if ext in [".jpg", ".jpeg", ".png", ".webp"]:
                    filename = os.path.basename(img_path)
                    try:
                        with open(img_path, "rb") as f:
                            encoded_b64 = base64.b64encode(f.read()).decode("utf-8")
                            mime_type = "image/jpeg" if ext in [".jpg", ".jpeg"] else f"image/{ext[1:]}"
                            data_url = f"data:{mime_type};base64,{encoded_b64}"
                            
                            samples.append({
                                "id": f"{split}_{category}_{filename}",
                                "name": f"{category.upper()} ({filename})",
                                "category": category,
                                "split": split,
                                "filename": f"{category}_{filename}",
                                "dataUrl": data_url
                            })
                    except Exception as e:
                        print(f"Error reading sample image {img_path}: {e}")

    return samples
