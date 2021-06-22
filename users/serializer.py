from rest_framework import serializers

from .models import FollowUser

class FollowUserSerializer(serializers.ModelSerializer):

    class Meta:
        model  = FollowUser
        fields =[ "from_user","to_user" ]


