from django.apps import AppConfig
import apps.user.signals  # noqa


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.user'

    def ready(self):
        import apps.user.signals  # Import signals to connect them