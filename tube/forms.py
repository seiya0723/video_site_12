from django import forms
from users.models import CustomUser


class IconForm(forms.ModelForm):
    class Meta:
        model  = CustomUser
        fields = ["usericon",]

