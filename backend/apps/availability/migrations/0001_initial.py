# Generated by Django 5.0.1 on 2024-01-14 07:28

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Availability",
            fields=[
                (
                    "user_id",
                    models.UUIDField(
                        db_index=True,
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                ("year", models.CharField()),
                ("apr", models.BooleanField()),
                ("may", models.BooleanField()),
                ("jun", models.BooleanField()),
                ("jul", models.BooleanField()),
                ("aug", models.BooleanField()),
                ("sep", models.BooleanField()),
                ("oct", models.BooleanField()),
                ("nov", models.BooleanField()),
                ("dec", models.BooleanField()),
            ],
            options={
                "verbose_name": "availability",
                "abstract": False,
            },
        ),
    ]
