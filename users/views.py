from django.shortcuts import render,redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http.response import JsonResponse

from .models import FollowUser
from .serializer import FollowUserSerializer

from rest_framework import views

class UserFollowView(LoginRequiredMixin,views.APIView):

    def post(self,request,pk,*args,**kwargs):

        followusers  = FollowUser.objects.filter(from_user=request.user.id,to_user=pk)

        json    = { "error":False }

        #すでにある場合は該当レコードを削除、無い場合は挿入
        #TIPS:↑メソッドやビュークラスを切り分けてしまうと、多重に中間テーブルへレコードが挿入されてしまう可能性があるため1つのメソッド内で分岐するやり方が無難。
        if followusers:
            print("ある")
            followusers.delete()

            return JsonResponse(json)
        else:
            print("無い")

        data        = { "from_user":request.user.id,"to_user":pk }
        serializer  = FollowUserSerializer(data=data)

        if serializer.is_valid():
            print("フォローOK")
            serializer.save()
        else:
            print("フォロー失敗")
            json["error"]   = True

        return JsonResponse(json)


follow   = UserFollowView.as_view()

