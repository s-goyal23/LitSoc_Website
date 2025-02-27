from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from team.serializers import TeamViewSerializer, TeamUpdateSerializer
from django.contrib.admin.views.decorators import staff_member_required
from team.models import Team
import datetime
# Create your views here.


class TeamUpdate(APIView):
    # @staff_member_required
    def post(self, request, format=None):
        serializer = TeamUpdateSerializer(data=request.data)
        if serializer.is_valid():
            new = serializer.save()
            return Response({'new': serializer.data, 'msg': 'Team Updated Successfully'}, status=status.HTTP_200_OK)
        return Response("Please check the credentials", status=status.HTTP_404_NOT_FOUND)


class TeamView(APIView):

    def get(self, request, format=None):
        # positions = {'1':['Captain', 'Secretary'], '2':['Vice Captain', 'Joint Secretary', 'Head']}
        # __request.GET and request.query_params are same__
        
        # serializer = TeamViewSerializer(data=request.GET)
        # print(request.query_params['year'])
        if request.query_params['year'] != 'current':
            serializer = TeamViewSerializer(data=request.query_params)
        else:
            Year = datetime.date.today().year
            query_dict = {'year':Year}
            serializer = TeamViewSerializer(data=query_dict)

        if serializer.is_valid():
            # year = 0
            year = serializer.data.get('year')
            
            # print(year)

            team = Team.objects.filter(year = str(year)).values()
            # temp = list(team)
            # final = []
            max = 1
            for i in team:
                if i['hierarchy'] > max:
                    max = i['hierarchy']
            final = []
            for i in range(1, max+1):
                team_details = {}
                members = []
                title = None
                id = None
                for j in team:
                    if j['hierarchy'] == i:
                        title = j['por']
                        id = j['div_id']
                        members.append(j)
                team_details['title'] = title
                team_details['id'] = id
                team_details['members'] = members
                final.append(team_details)

            # print(final)

            return Response(final, status=status.HTTP_200_OK)
        return Response("Please check the credentials", status=status.HTTP_404_NOT_FOUND)
