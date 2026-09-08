from pathlib import Path
import argparse
import json

PUBLIC_ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = PUBLIC_ROOT / "data" / "templates.json"


def inside_public_repo(path: Path) -> bool:
    try:
        path.resolve().relative_to(PUBLIC_ROOT.resolve())
        return True
    except ValueError:
        return False


def initialize(root: Path) -> Path:
    root = root.resolve()
    if inside_public_repo(root):
        raise ValueError("private delivery root must be outside the public repository")

    root.mkdir(parents=True, exist_ok=True)
    for folder in ("working", "packages", "docs"):
        (root / folder).mkdir(exist_ok=True)

    manifest_path = root / "manifest.json"
    if manifest_path.exists():
        print(f"Existing manifest preserved: {manifest_path}")
        return manifest_path

    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    manifest = {
        "schemaVersion": 1,
        "publicCatalog": "BRIOFRAME/BRIOFRAME.github.io",
        "templates": [
            {
                "slug": item["slug"],
                "deliveryStatus": "not_started",
                "packagePath": "",
            }
            for item in catalog
        ],
    }
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, type=Path)
    args = parser.parse_args()
    manifest_path = initialize(args.root)
    print(f"BRIOFRAME private delivery workspace ready: {manifest_path.parent}")


if __name__ == "__main__":
    main()
