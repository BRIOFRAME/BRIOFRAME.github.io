from pathlib import Path
import argparse
import json
import sys

PUBLIC_ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = PUBLIC_ROOT / "data" / "templates.json"
ALLOWED_STATES = {"not_started", "packaged", "verified"}


def inside_public_repo(path: Path) -> bool:
    try:
        path.resolve().relative_to(PUBLIC_ROOT.resolve())
        return True
    except ValueError:
        return False


def validate(root: Path) -> list[str]:
    errors: list[str] = []
    root = root.resolve()
    if inside_public_repo(root):
        errors.append("private delivery root must be outside the public repository")
        return errors

    manifest_path = root / "manifest.json"
    if not manifest_path.is_file():
        errors.append(f"missing private manifest: {manifest_path}")
        return errors

    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    records = manifest.get("templates") if isinstance(manifest, dict) else None
    if not isinstance(records, list):
        errors.append("private manifest must contain a templates array")
        return errors

    catalog_slugs = {item["slug"] for item in catalog}
    seen: set[str] = set()
    for index, record in enumerate(records):
        if not isinstance(record, dict):
            errors.append(f"templates[{index}] must be an object")
            continue
        missing = {"slug", "deliveryStatus", "packagePath"} - set(record)
        if missing:
            errors.append(f"templates[{index}] missing: {sorted(missing)}")
            continue
        slug = record["slug"]
        state = record["deliveryStatus"]
        package_path = record["packagePath"]
        if slug in seen:
            errors.append(f"duplicate private manifest slug: {slug}")
        seen.add(slug)
        if slug not in catalog_slugs:
            errors.append(f"unknown private manifest slug: {slug}")
        if state not in ALLOWED_STATES:
            errors.append(f"{slug}: invalid deliveryStatus {state!r}")
        if state == "not_started":
            if package_path:
                errors.append(f"{slug}: not_started must not invent a package path")
        else:
            if not isinstance(package_path, str) or not package_path.strip():
                errors.append(f"{slug}: {state} requires packagePath")
            else:
                package = (root / package_path).resolve()
                try:
                    package.relative_to(root)
                except ValueError:
                    errors.append(f"{slug}: packagePath escapes private root")
                else:
                    if not package.is_file():
                        errors.append(f"{slug}: package file does not exist: {package_path}")

    missing_slugs = sorted(catalog_slugs - seen)
    extra_slugs = sorted(seen - catalog_slugs)
    if missing_slugs:
        errors.append(f"private manifest missing catalog slugs: {missing_slugs}")
    if extra_slugs:
        errors.append(f"private manifest has unknown slugs: {extra_slugs}")
    if len(records) != len(catalog):
        errors.append(f"private manifest record count {len(records)} != catalog count {len(catalog)}")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, type=Path)
    args = parser.parse_args()
    errors = validate(args.root)
    if errors:
        print("BRIOFRAME private delivery validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
    print("BRIOFRAME private delivery validation passed")


if __name__ == "__main__":
    main()
