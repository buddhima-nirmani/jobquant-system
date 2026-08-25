def to_title_case(value: str | None) -> str | None:
    if not value:
        return value

    return value.title()


ITEM_TITLE_CASE_FIELDS = (
    "product_category",
    "product_name",
    "material",
    "specification",
    "print_type",
    "lamination",
    "installation",
)


def titlecase_item_fields(data: dict) -> dict:
    for field in ITEM_TITLE_CASE_FIELDS:
        if data.get(field):
            data[field] = to_title_case(data[field])

    return data
